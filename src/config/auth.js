require('dotenv/config');

export default {
  secret: process.env.SECRET_KEY,
  expiresIn: process.env.EXPIRES_IN,
};
