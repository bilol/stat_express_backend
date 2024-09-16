const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const companyRoutes = require('../routes/companyRoutes');
const excelRoutes = require('../routes/excelRoutes');
const errorHandler = require('../middlewares/errorHandler');

dotenv.config();

const app = express();

// Allow all origins with CORS
app.use(cors({
  origin: "*",  // Add your frontend origins here
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
