import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./homepage.css";

const fetchUserData = async () => {
  // Replace with actual fetch logic
  return {
    savings: 1000,
    checking: 500,
    investment: 2000,
    transactions: [
      { date: '2024-08-01', type: 'Deposit', account: 'savings', amount: 100 },
      { date: '2024-08-02', type: 'Withdraw', account: 'checking', amount: 50 },
    ],
  };
};

const Dashboard = () => {
  const [userData, setUserData] = useState({
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
  const navigate = useNavigate();

  useEffect(() => {
    async function getUserData() {
      const data = await fetchUserData();
      setUserData(data);
    }

    getUserData();
  }, []);

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
      <h3 className="m-3">Customer Dashboard</h3>
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
        <br/>
        <br/>
        <Link to="/transactions" className="submit-button">View Transaction History</Link>
      </div>
    </div>
  );
};

export default Dashboard;