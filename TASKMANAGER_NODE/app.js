const cors = require('cors');
const express = require('express');
const connectDB = require('./db/connect');
const userRoutes = require('./routes/userRoutes');
require('dotenv').config();

const app = express();
const allowedOrigins = ['http://localhost:4200']; 

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.error(`CORS error: Origin ${origin} is not allowed.`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'], 
}));

app.use(express.json());

connectDB(process.env.MONGODB_URL);

app.use('/api/user', userRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
