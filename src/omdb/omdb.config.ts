import { registerAs } from '@nestjs/config';

export default registerAs('omdb', () => ({
  apiKey: process.env.OMDB_API_KEY,
}));
