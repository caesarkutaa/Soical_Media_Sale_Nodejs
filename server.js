// @ts-nocheck
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const passport = require("passport");
const NodeCache = require("node-cache");

const rootRouter = require("./routes");

const app = express();

// Middleware Setup
app.use(cors());
app.use(helmet());
app.use(morgan("combined"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Rate Limiting Setup
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter);
    
// Connect database
require("./config/DB").connect();

console.log(typeof rootRouter); // Should log "function"



// Routes
app.use("/api/v1/", rootRouter);

// 404 Error Handling Middleware
app.use((req, res) => {
  res.status(404).json({ error: `Path ${req.originalUrl} not found` });
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error("Error:", err.message);
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});

// Initialize Cache
const cache = new NodeCache({ stdTTL: 600 });

const port = process.env.PORT || 3023;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
