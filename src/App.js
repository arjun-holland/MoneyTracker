// Import the global stylesheet for this component
import "./App.css";
// Import React hooks: useState (for state variables) and useEffect (for running code on component lifecycle)
import { useEffect, useState } from "react";

//uses of useState(), useEffect()
/*
🟢 useState
-Think of it as a special variable for React components.
-Normal variables in a component reset every time the component re-renders, 
 but useState remembers the value between renders.
-When you update a state variable → React automatically re-renders the component so the UI updates.

✅ When to use:
When you want to store and update values that affect the UI.
Examples: Input field text (name, description),Counter values,Boolean flags (like isLoading, isDarkMode)
  const [count, setCount] = useState(0);
// count = current value is 0 , we put initial cvalue in the useState(initial_value)
// setCount = function to update value

🔵 useEffect
-Think of it as a function that runs in the background after render.
-It’s used for side effects → things outside of rendering HTML.
Examples:
-Fetching data from backend when the component loads
-Subscribing to events (like scroll or resize)
-Updating the page title
-Running cleanup code when a component is removed

✅ When to use:
Anytime your component needs to do something after it renders or when certain variables change.
    useEffect(() => {
      console.log("This runs once when component mounts!");
    }, []); // empty [] → only run once
    //The code inside runs only once, right after React puts your component into the DOM for the first time.

    useEffect(() => {
      console.log("This runs whenever 'count' changes:", count);
    }, [count]); // dependency [count] → runs when 'count' updates

🌟 Easy analogy
useState = like a box where you keep data for your component.
useEffect = like a worker that React hires to do tasks in the background (fetching data, listening to changes).
*/



function App() {
  
  // -------------------- State Variables -------------------- //
  const [name, setName] = useState("");    // Store input for transaction "name" (e.g., "2000 rent")
  const [description, setDescription] = useState("");    // Store input for transaction description
  const [dateTime, setDateTime] = useState("");    // Store input for transaction date and time
  const [transactions, setTransactions] = useState([]);     // Store the list of all transactions fetched from backend


  // -------------------- Lifecycle Hook -------------------- //
  // useEffect runs when the component first mounts (empty dependency array [])
  // It fetches the list of transactions from backend API
  useEffect(() => {
    getTransactions().then(setTransactions); // Fetch transactions and update state
  }, []);

  /*
  const [transactions, setTransactions] = useState([]);
    transactions → the current state (array of transactions).
    setTransactions → a function to update that state.
  ⚠️ But setTransactions cannot magically fetch data from your backend.
  It only updates the state with whatever data you pass to it.

  2. Why getTransactions is needed
  Your backend has the actual data. To bring it into React: 
  You fetch it with fetch(url) → this gives you a Response object.
  You convert it to JSON with .json(). You update state with that JSON using setTransactions.
  That’s why we write a helper function like getTransactions().
  */

  // -------------------- API Functions -------------------- //
  // Fetch all transactions from backend
  async function getTransactions() {
    const url = process.env.REACT_APP_API_URL + "/transaction"; // Construct API URL from .env variable
    const response = await fetch(url); // Make GET request
    return await response.json();      // Parse and return JSON data
  }

  // Function to add a new transaction (called when form is submitted)
  function addNewTransaction(event) {
    event.preventDefault(); // Prevent page reload on form submit
    const url = process.env.REACT_APP_API_URL + "/transaction";    // API endpoint
    const price = name.split(" ")[0];       // Extract first word as price (e.g., "2000 rent" → price = 2000)

    //console.log(url); // Debug: log the API URL being used

    // Make POST request to backend with transaction data
    fetch(url, {
      method: "POST", // HTTP method
      headers: { "content-type": "application/json" }, // Tell backend we are sending JSON
      body: JSON.stringify({
        price,
        name: name.substring(price.length + 1), //name = "20000 mobile",👉 price.length = 5 (because "20000" has 5 characters) : Rest of string after price = transaction name
        description,
        dateTime, 
      }),
    }).then((response) => {
      response.json().then((json) => {
        // Clear input fields after successful submission
        setName("");
        setDateTime("");
        setDescription("");

        // Debug: log the response from backend
        console.log("result", json);
      });
    });
  }

  // -------------------- Balance Calculation -------------------- //
  // Calculate the balance by summing all transaction prices
  let balance = 0;
  for (const transaction of transactions) {
    balance = balance + transaction.price;
  }

  // -------------------- JSX Rendering -------------------- //
  return (
    <main>
      {/* Display the total balance */}
      <h1 style={{marginTop: '20px'}}> Total You Spent :{" "}
        <span style={{ color: balance < 0 ? "red" : "green", fontWeight: "bold" }}>
          {balance}₹
        </span>
      </h1>

      {/* Transaction Form */}
      <form onSubmit={addNewTransaction}>
        <div className="basic">
          <input
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="20000 mobile"
            required   // ✅ price + name required
          />
          
          {/* Input for date and time */}
          <input
            type="datetime-local"
            value={dateTime}
            onChange={(event) => setDateTime(event.target.value)}
            required   // ✅ date required
          />
        </div>

        {/* Input for description */}
        <div className="description">
          <input
            type="text"
            placeholder="description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            required   // ✅ description required
          />
        </div>
        
        <button type="submit">Add new transaction</button>
      </form>

       {/* List of transactions */}
      <div className="transactions">
        {transactions.length > 0 &&
          transactions.map((transaction) => (
            <div key={transaction._id}>
              <div className="transaction">
                <div className="left">
                  <div className="name">{transaction.name}</div>
                  <div className="description">{transaction.description}</div>
                </div>
                <div className="right">
                  <div
                    className={
                      "price " + (transaction.price < 0 ? "red" : "green")
                    }
                  >
                    {transaction.price}₹
                  </div>
                  <div className="datetime">  
                    {transaction.dateTime ? new Date(transaction.dateTime).toLocaleString() : "No date"}</div>
                  </div>
              </div>
            </div>
          ))}
      </div>

    </main>
  );
}

export default App;
