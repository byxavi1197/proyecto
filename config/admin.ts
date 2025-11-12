export default ({ env }) => ({
  auth: {
    // si ADMIN_JWT_SECRET existe la usa, si no, usa la que está entre comillas
    secret: env('ADMIN_JWT_SECRET', 'admin-secret-de-prueba-123'),
  },
  apiToken: {
    salt: env('API_TOKEN_SALT', 'api-token-salt-123'),
  },
  transfer: {
    token: {
      salt: env('TRANSFER_TOKEN_SALT', 'transfer-salt-123'),
    },
  },
  secrets: {
    encryptionKey: env('ENCRYPTION_KEY', 'encryption-key-123'),
  },
  flags: {
    nps: env.bool('FLAG_NPS', true),
    promoteEE: env.bool('FLAG_PROMOTE_EE', true),
  },
});
