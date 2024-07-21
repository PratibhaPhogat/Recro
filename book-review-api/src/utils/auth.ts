import jwt from 'jsonwebtoken';

const JWT_SECRET = 'your_jwt_secret';

export const authenticate = (token: string) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
};
