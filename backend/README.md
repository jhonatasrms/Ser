
# Método Sereninho - Backend & Admin

## 1. Variáveis de Ambiente (.env)
```bash
DATABASE_URL="postgres://user:pass@host:5432/dbname"
JWT_SECRET="sua_chave_super_secreta_jwt"
PAYMENT_SECRET="chave_webhook_gateway"
PORT=3000
```

## 2. Configuração Inicial (Deploy)
1.  Suba um banco PostgreSQL (Ex: Railway, Supabase, AWS RDS).
2.  Rode o script de migração: `psql $DATABASE_URL -f migrations.sql`
3.  O script criará o usuário admin inicial:
    *   **User:** `jhonatasrms@gmail.com`
    *   **Senha:** `1234`
    *   **Atenção:** Mude essa senha imediatamente após o deploy usando um update no banco ou criando rota de change-password.

## 3. Webhooks
Configure o seu gateway de pagamento (Stripe/Hotmart/Kiwify) para apontar para:
`POST https://seu-dominio.com/api/webhooks/payments`
Certifique-se de configurar o segredo de assinatura no `.env`.

## 4. Automação
O servidor roda um Cron Job interno (`node-cron`) a cada hora para verificar:
1.  Trials que venceram (48h após cadastro).
2.  Planos anuais que venceram.
Os usuários terão o campo `access_active` definido como `FALSE` automaticamente.

## 5. Segurança
*   Senhas são hashadas com Bcrypt (Cost 12).
*   Rotas `/api/admin/*` exigem token JWT com `role: 'admin'`.
*   Webhooks validam assinatura HMAC-SHA256.

## 6. Testes Manuais
*   **Registro:** Crie um usuário na rota `/register`. Verifique se `trial_end` é D+2.
*   **Admin:** Logue com o admin e tente desbloquear esse usuário na rota `/unlock`.
