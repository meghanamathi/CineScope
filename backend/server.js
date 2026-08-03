const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();

const app = express();

// CORS
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://cine-sccope-meghana18.vercel.app",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

app.options("*", cors());

app.use(express.json());

// Connect MongoDB
connectDB();

// Routes
const authRoutes = require('./routes/auth');
const reviewRoutes = require('./routes/review');

app.use('/api/auth', authRoutes);
app.use('/api/reviews', reviewRoutes);

// Test route
app.get('/', (req, res) => {
  res.send('✅ CineScope backend is running!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});