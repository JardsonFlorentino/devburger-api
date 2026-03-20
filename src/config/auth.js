export default {
  secret: process.env.JWT_SECRET || 'a7ffba05ad6baa669f62e96e890bb3dd',
  expiresIn: process.env.JWT_EXPIRES_IN || '5d',
}
