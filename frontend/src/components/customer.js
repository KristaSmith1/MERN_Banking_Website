import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./homepage.css";

const fetchUserData = async (customerID) => {
  // Replace with actual fetch logic
  const response = await axios.get(`http://localhost:4000/accounts/${customerID}`);
  return response.data;
};

const Customer = () => {
  const [userData, setUserData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    savings: 0,
    checking: 0,
    investment: 0,
    transactions: [],
  });
  const [transaction, setTransaction] = useState({
    type: 'Deposit',
    account: 'savings',
    amount: '',
  });
  const { id } = useParams(); // Moved useParams inside the component
  const navigate = useNavigate();

  useEffect(() => {
    async function getUserData() {
      try {
        const data = await fetchUserData(id);
        setUserData(data);
      } catch (error) {
        console.error("Failed to fetch customer data:", error);
        window.alert("Failed to fetch customer data");
        navigate("/customer/:id");
      }
    }

    getUserData();
  }, [id, navigate]);

  const handleTransactionChange = (e) => {
    setTransaction({ ...transaction, [e.target.name]: e.target.value });
  };

  const handleTransactionSubmit = async (e) => {
    e.preventDefault();
    // Simulate API call
    const newTransaction = {
      date: new Date().toISOString().split('T')[0],
      ...transaction,
    };

    // Update local state (you'd normally make an API call here)
    setUserData({
      ...userData,
      [transaction.account]: transaction.type === 'Deposit'
        ? userData[transaction.account] + parseFloat(transaction.amount)
        : userData[transaction.account] - parseFloat(transaction.amount),
      transactions: [...userData.transactions, newTransaction],
    });

    setTransaction({ type: 'Deposit', account: 'savings', amount: '' });
  };

  return (
    <div>
      <h3 className="m-3">{userData.firstname} {userData.lastname}'s Account</h3>
      <div>
        <h4>Account Balances</h4>
        <p>Savings: ${userData.savings.toFixed(2)}</p>
        <p>Checking: ${userData.checking.toFixed(2)}</p>
        <p>Investment: ${userData.investment.toFixed(2)}</p>
      </div>

      <div>
        <h4>Make a Transaction</h4>
        <form onSubmit={handleTransactionSubmit} className="transaction-form">
          <select
            name="type"
            value={transaction.type}
            onChange={handleTransactionChange}
          >
            <option value="Deposit">Deposit</option>
            <option value="Withdraw">Withdraw</option>
          </select>
          <select
            name="account"
            value={transaction.account}
            onChange={handleTransactionChange}
          >
            <option value="savings">Savings</option>
            <option value="checking">Checking</option>
            <option value="investment">Investment</option>
          </select>
          <input
            type="number"
            name="amount"
            value={transaction.amount}
            onChange={handleTransactionChange}
            placeholder="Amount"
            className="transaction-amount"
          />
          <button type="submit" className="submit-button">Submit</button>
        </form>
      </div>

      <div>
        <br />
        <br />
        <Link to={`/transactions/${id}`} className="submit-button">View Transaction History</Link>
      </div>
    </div>
  );
};

export default Customer;
