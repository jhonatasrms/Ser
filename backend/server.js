
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');
const cron = require('node-cron');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
// Raw body needed for webhook verification
app.use(express.json({
  verify: (req, res, buf) => {
    req.rawBody = buf;
  }
}));

// DB Connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

// --- UTILS ---
const generateToken = (user) => {
    return jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

const hashPassword = async (pass) => {
    return await bcrypt.hash(pass, 12);
};

// --- AUTH ROUTES ---

// Register (Auto 2-Day Trial)
app.post('/api/auth/register', async (req, res) => {
    const { name, email, password, whatsapp, consent_whatsapp } = req.body;
    
    try {
        const hashed = await hashPassword(password);
        const trialEnd = new Date();
        trialEnd.setDate(trialEnd.getDate() + 2); // 48h Trial

        const result = await pool.query(
            `INSERT INTO users (name, email, password_hash, whatsapp, trial_end, consent_whatsapp) 
             VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, name, role, trial_end`,
            [name, email, hashed, whatsapp, trialEnd, consent_whatsapp]
        );
        
        const user = result.rows[0];
        const token = generateToken(user);
        res.json({ user, token });
    } catch (err) {
        console.error(err);
        res.status(400).json({ error: 'Erro ao criar conta. Email já existe?' });
    }
});

// Login
app.post('/api/auth/login', async (req, res) => {
    const { login, password } = req.body;
    // Allow login by email or whatsapp
    const result = await pool.query('SELECT * FROM users WHERE email = $1 OR whatsapp = $1', [login]);
    
    if (result.rows.length === 0) return res.status(401).json({ error: 'Usuário não encontrado' });
    
    const user = result.rows[0];
    const valid = await bcrypt.compare(password, user.password_hash);
    
    if (!valid) return res.status(401).json({ error: 'Senha incorreta' });
    
    const token = generateToken(user);
    res.json({ user: { id: user.id, name: user.name, role: user.role, plan_id: user.plan_id }, token });
});

// --- MIDDLEWARE: VERIFY ADMIN ---
const isAdmin = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({error: 'No token'});
    
    try {
        const decoded = jwt.verify(authHeader.split(' ')[1], process.env.JWT_SECRET);
        if (decoded.role !== 'admin') throw new Error();
        req.user = decoded;
        next();
    } catch (e) {
        res.status(403).json({ error: 'Acesso negado' });
    }
};

// --- ADMIN ROUTES ---

// List Users
app.get('/api/admin/users', isAdmin, async (req, res) => {
    const result = await pool.query(`
        SELECT id, name, email, whatsapp, role, plan_id, trial_end, access_active, access_expires_at, points, streak 
        FROM users ORDER BY created_at DESC LIMIT 100
    `);
    res.json(result.rows);
});

// Unlock Access (Manual)
app.post('/api/admin/users/:id/unlock', isAdmin, async (req, res) => {
    const { id } = req.params;
    const { days = 365, plan_id } = req.body;
    
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + days);
    
    await pool.query(
        `UPDATE users SET 
            access_active = TRUE, 
            access_expires_at = $1, 
            plan_id = $2, 
            access_unlocked_by = $3, 
            access_unlocked_at = NOW() 
         WHERE id = $4`,
        [expiresAt, plan_id, req.user.id, id]
    );
    res.json({ success: true });
});

// Revoke Access
app.post('/api/admin/users/:id/revoke', isAdmin, async (req, res) => {
    await pool.query(
        `UPDATE users SET access_active = FALSE, access_expires_at = NULL, plan_id = NULL WHERE id = $1`,
        [req.params.id]
    );
    res.json({ success: true });
});

// Send Notification
app.post('/api/admin/notifications', isAdmin, async (req, res) => {
    const { title, message, link, type } = req.body;
    await pool.query(
        `INSERT INTO notifications (title, message, link, type, targets, status) VALUES ($1, $2, $3, $4, $5, 'sent')`,
        [title, message, link, type, JSON.stringify({all: true})]
    );
    // In a real app, here we would trigger the Push Service (Firebase/OneSignal)
    res.json({ success: true });
});

// --- WEBHOOKS (PAYMENT) ---

app.post('/api/webhooks/payments', async (req, res) => {
    const signature = req.headers['x-signature'];
    const secret = process.env.PAYMENT_SECRET;
    
    // 1. Verify HMAC Signature
    const hmac = crypto.createHmac('sha256', secret);
    const digest = hmac.update(req.rawBody).digest('hex');
    
    if (signature !== digest) {
        return res.status(401).send('Invalid signature');
    }

    const { user_id, status, amount, plan_id, payment_id } = req.body;

    // 2. Log Purchase
    await pool.query(
        `INSERT INTO purchases (user_id, plan_id, amount, provider_status, provider_payment_id) 
         VALUES ($1, $2, $3, $4, $5)`,
        [user_id, plan_id, amount, status, payment_id]
    );

    // 3. Auto-Unlock if Paid
    if (status === 'paid') {
        const expiresAt = new Date();
        expiresAt.setFullYear(expiresAt.getFullYear() + 1); // 1 Year Default

        await pool.query(
            `UPDATE users SET 
                access_active = TRUE, 
                plan_id = $1, 
                access_expires_at = $2 
             WHERE id = $3`,
            [plan_id, expiresAt, user_id]
        );
    }

    res.json({ received: true });
});

// --- CRON JOBS (AUTOMATION) ---

// Run every hour: Expire Trials
cron.schedule('0 * * * *', async () => {
    console.log('Running Expiration Job...');
    
    // Disable users where trial expired AND no active plan
    await pool.query(`
        UPDATE users 
        SET access_active = FALSE 
        WHERE trial_end < NOW() AND plan_id IS NULL AND access_active = TRUE
    `);

    // Disable users where plan expired
    await pool.query(`
        UPDATE users 
        SET access_active = FALSE 
        WHERE access_expires_at < NOW() AND access_active = TRUE
    `);
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
