Store Rating Platform

A full-stack store rating application built for the FullStack Intern Coding Challenge. It allows users to submit ratings from 1 to 5 and provides different features for System Administrators, Normal Users, and Store Owners.

Tech Stack

React.js (Vite)

Express.js

MySQL

Sequelize ORM

JWT authentication

Axios

Project Structure

store-rating-app/
├── server/     # Express API
└── client/     # React frontend (Vite)

Prerequisites

Node.js 18+

npm

MySQL 8.x

MySQL can be running locally or on a remote server.

1. Database Setup

Create the database in MySQL:

CREATE DATABASE store_rating_db;

There is no need to create the tables manually. Sequelize creates and synchronizes the tables when the backend starts.

sequelize.sync({ alter: true }) is intended for development use.

2. Backend Setup

cd server
npm install
cp .env.example .env

Edit .env with your MySQL and JWT settings:

DB_HOST=localhost
DB_PORT=3306
DB_NAME=store_rating_db
DB_USER=root
DB_PASSWORD=your_mysql_password

JWT_SECRET=replace_this_with_a_long_random_secret

Start the backend:

npm run dev

The API runs at:

http://localhost:5000

On the first start, the application connects to MySQL and creates the users, stores, and ratings tables.

Create the first Admin account

Run the seeder once:

npm run seed

The seeder uses the BOOTSTRAP_ADMIN_* values from .env.

Default credentials:

Email: admin@storerating.com
Password: Admin@12345

After logging in, the administrator can create users, store owners, and stores from the Admin dashboard.

3. Frontend Setup

In a separate terminal:

cd client
npm install
cp .env.example .env

The default frontend API URL is:

http://localhost:5000/api

If you changed the backend port, update the frontend .env accordingly.

Start the frontend:

npm run dev

The application will normally be available at:

http://localhost:5173


