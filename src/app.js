const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const passport = require('../middleware/passport');
const sessionsRouter = require('../route/session');

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(passport.initialize());

app.use('/api/sessions', sessionsRouter);

app.get('/', (req, res) => {
  res.send('API funcionando');
});

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/ecommerce';

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log( 'Conectado a MongoDB');
    app.listen(PORT, () => console.log(`Server en http://localhost:${PORT}`));
  })
  .catch(err => console.error('Error MongoDB:', err));
