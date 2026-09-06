/**
 * Creates the first (bootstrap) admin account, since only admins can
 * create other admins via the API. Run once after the database is set up:
 *   npm run seed
 */
require('dotenv').config();
const { sequelize, User } = require('../src/models');
const { hashPassword } = require('../src/utils/password');

async function seed() {
  await sequelize.authenticate();
  await sequelize.sync();

  const email = process.env.BOOTSTRAP_ADMIN_EMAIL || 'admin@storerating.com';
  const existing = await User.findOne({ where: { email } });

  if (existing) {
    console.log(`Admin account already exists for ${email}. Skipping.`);
    process.exit(0);
  }

  const hashed = await hashPassword(process.env.BOOTSTRAP_ADMIN_PASSWORD || 'Admin@12345');

  await User.create({
    name: process.env.BOOTSTRAP_ADMIN_NAME || 'System Administrator Account',
    email,
    password: hashed,
    address: process.env.BOOTSTRAP_ADMIN_ADDRESS || 'Head Office, Admin Street, Admin City',
    role: 'ADMIN',
  });

  console.log(`Bootstrap admin created: ${email}`);
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
