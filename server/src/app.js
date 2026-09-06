const express = require('express');
const cors = require('cors');
require('dotenv').config();

const routes = require('./routes');
const errorHandler = require('./middlewares/error.middleware');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => res.status(200).json({ status: 'ok' }));

app.use('/api', routes);

app.use((req, res) => {
  res.status(404).json({ error: { field: 'route', message: 'Route not found' } });
});

app.use(errorHandler);

module.exports = app;
