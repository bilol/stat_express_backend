const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const companyRoutes = require('../routes/companyRoutes');
const excelRoutes = require('../routes/excelRoutes');
const errorHandler = require('../middlewares/errorHandler');

dotenv.config();

const app = express();

// Middleware to log the host dynamically from the incoming request
app.use((req, res, next) => {
  const host = req.get('host');  // Get the host from the incoming request
  console.log(`Request received from host: ${host}`);
  next();
});

// Define allowed origins
const allowedOrigins = [process.env.FRONTEND_URL, 'https://stat-express-backend.vercel.app' || 'http://localhost:5173'];

// Middleware for CORS
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true); // Allow requests with no origin (like curl requests)
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

app.use(express.json()); // To parse incoming JSON payloads

// The URL you want to check (hardcoded)
const homepageUrl = 'https://example.com';  // Replace with the URL you want to check

// Simple GET route at '/'
app.get('/', async (req, res) => {
  try {
    // Make a GET request to the hardcoded URL
    const response = await axios.get(homepageUrl);

    // Check if the response status is OK (status code 200)
    if (response.status === 200) {
      return res.send(`<h1>The homepage ${homepageUrl} is loading successfully.</h1>`);
    } else {
      return res.send(`<h1>The homepage ${homepageUrl} returned status code: ${response.status}</h1>`);
    }
  } catch (error) {
    // Catch and return any errors that occur
    return res.send(`<h1>Error fetching the homepage ${homepageUrl}: ${error.message}</h1>`);
  }
});

// Routes
app.use('/api/company', companyRoutes);
app.use('/api/excel', excelRoutes); // Add the route for handling Excel uploads

// Custom error handler middleware
app.use(errorHandler);

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
