import { registerAs } from '@nestjs/config';

export default registerAs('auth', () => ({
  jwt: {
    secret: process.env.JWT_SECRET,
    ttl: 30 * 60,
    issuer: 'https://www.netguru.com/',
  },
}));
