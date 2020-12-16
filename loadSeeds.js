'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

async function bootstrap() {
  await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const salt = await bcrypt.genSalt();

  const users = [
    {
      internalId: 123,
      plan: 'basic',
      name: 'Basic Thomas',
      username: 'basic-thomas',
      password: await bcrypt.hash('sR-_pcoow-27-6PAwCD8', salt),
    },
    {
      internalId: 434,
      plan: 'premium',
      name: 'Premium Jim',
      username: 'premium-jim',
      password: await bcrypt.hash('GBLtTyq3E_UNjFnpo9m6', salt),
    },
  ];

  await mongoose.connection.db.collection('users').insertMany(users);

  await mongoose.disconnect();
}

bootstrap();
