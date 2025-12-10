module.exports = {
  secret: process.env.JWT_SECRET || 'development_secret_key_change_in_production_123',
  expiresIn: '24h'
};