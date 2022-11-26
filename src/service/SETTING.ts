export const SETTING = {
  MONGODB_URL: process.env.MONGO_URI || 'url',
  JWT_SECRET: process.env.JWT_SECRET || 'sercret',
  SALT: process.env.SALT || '6',
};
