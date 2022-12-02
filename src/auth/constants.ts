export const jwtConstants = {
  secret: process.env.ACCESS_JWT_SECRET || '',
};

export const BASIC_CONSTANTS = {
  userName: process.env.BASIC_USER || 'admin',
  password: process.env.BASIC_PASS || 'qwerty',
};
