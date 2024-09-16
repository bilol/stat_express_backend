const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const companyRoutes = require('../routes/companyRoutes');
const excelRoutes = require('../routes/excelRoutes');
const errorHandler = require('../middlewares/errorHandler');

dotenv.config();

const app = express();

// Allow specific origins with CORS
const allowedOrigins = [
  'https://bilol.github.io',  // Your GitHub Pages frontend
  'http://localhost:5173'     // Add localhost for local development if necessary
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,  // If you are using cookies or authentication
}));

app.use(express.json()); // To parse incoming JSON payloads

// Routes
app.use('/api/company', companyRoutes);
app.use('/api/excel', excelRoutes); // Add the route for handling Excel uploads

// Custom error handler middleware
app.use(errorHandler);

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
