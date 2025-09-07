// ---------------- Import necessary packages or libraries for app ---------------- /
// Import the express framework to build the REST API server
const express = require("express");    

// Import the Mongoose model for "Transaction" (represents MongoDB collection)
const Transaction = require("./models/Transaction");

// Import mongoose library to connect and interact with MongoDB
const mongoose = require("mongoose");

// Import CORS middleware
// CORS (Cross-Origin Resource Sharing) allows communication between frontend and backend
// Example: React app running on http://localhost:3000 can send requests to this backend on http://localhost:300
const cors = require("cors");

// Import dotenv package to load environment variables from .env file
const dotenv = require("dotenv")
dotenv.config();  // Load variables into process.env (e.g., process.env.MONGO_URL)



// ---------------- Create App with Express---------------- //
const app = express();

// ---------------- Middleware ---------------- //
// Middleware
app.use(cors());   // Enable CORS so that your React frontend (on port 3000) can talk to backend (on port 3001)

// This middleware lets our backend read data in JSON format.
// Example: when the frontend sends a POST request with { "name": "Book" }, it will automatically be converted into a JavaScript object we can use.
// We use JSON because it's lightweight and easy to work with in JavaScript.
app.use(express.json());  




// ---------------- MongoDB Connection ---------------- //
// Connect to MongoDB database using the connection string stored in environment variable MONGO_URL
// This runs once when the server starts
mongoose.connect(process.env.MONGO_URL)    
.then(() => console.log("✅ MongoDB connected"))   // Success message
.catch((err) => console.error("❌ MongoDB connection error:", err));  // Error message if connection fails



// ----------------------- Routes ------------------------ //

// Simple test route to check if the server is working
// Endpoint: GET /api/test  , example : http://localhost:3001/api/test
// Response: { body: "testing successful" }
// Test route
app.get("/api/test", (req, res) => {
  res.send({ body: "testing successful , I'am SPIDER-MAN" });
});

// Get all transactions
// Route to fetch ALL transactions from MongoDB
// Endpoint: GET /api/transaction, example : http://localhost:3001/api/transaction
// Uses async/await to get data from MongoDB collection
app.get("/api/transaction", async (req, res) => {
  try {
    const transactions = await Transaction.find(); // Retrieve all transactions from "transactions" collection
    res.json(transactions);    // Send transactions back as JSON
  } catch (err) {
    console.error("❌ Error fetching transactions:", err);   
    res.status(500).json({ error: "Failed to fetch transactions" });  // Send error response to client
  }
});

// Route to create a NEW transaction and save it in MongoDB
// Endpoint: POST /api/transaction
app.post("/api/transaction", async (req, res) => {
  const { name, description, dateTime, price } = req.body;  // Extract fields from request body (sent by frontend)
  try {
    const transaction = await Transaction.create({   // Create and insert new transaction document in MongoDB
      name,         
      description,
      dateTime,
      price,
    });
    res.json(transaction);   // Return the newly created transaction as JSON
  } catch (err) {
    console.error("❌ Error creating transaction:", err);
    res.status(500).json({ error: "Failed to create transaction" });
  }
});

/*
// ----------------------- Understanding the GET and POST ------------------------ //
Even /api/transaction it is used two time they have there own purpose
 app.get("/api/transaction") → runs only when you make a GET request (for fetching transactions).
 app.post("/api/transaction") → runs only when you make a POST request (for creating a new transaction).

So the HTTP method (GET vs POST) + endpoint path = uniquely identifies the route.

// ----------------------- Testing the GET and POST ------------------------ //
🔍 How to test both
1. GET route
  In your browser or Postman, visit: http://localhost:3001/api/transaction
  (make sure your backend is running)
  You should see a JSON array of all transactions, e.g.:
      [
        {
          "_id": "64b0c1e...",
          "name": "Coffee",
          "description": "Morning coffee",
          "datetime": "2025-09-07T10:30:00.000Z",
          "price": -50
        }
      ]
  
2. POST route
  Use Postman or frontend fetch/axios to send a POST request:
  URL: http://localhost:3001/api/transaction
  Headers: Content-Type: application/json
  Body (raw JSON):
  {
    "name": "Book",
    "description": "Bought a book",
    "datetime": "2025-09-07T13:30:00Z",
    "price": -200
  }

➡️ If successful, response will be the newly created transaction JSON.
*/


// Start the Express server on defined port (3001)
const PORT = 3001;  // Define the port on which the backend server will run
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
