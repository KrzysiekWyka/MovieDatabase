import { registerAs } from '@nestjs/config';

export default registerAs('users', () => ({
  basicPlanMonthlyLimit: 5,
}));
