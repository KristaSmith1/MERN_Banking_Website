import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./homepage.css";

const fetchTransactionHistory = async () => {
  // Replace with actual fetch logic
  return [
    { date: '2024-08-01', account: 'savings', type: 'Deposit', amount: 100 },
    { date: '2024-08-02', account: 'checking', type: 'Withdraw', amount: 50 },
    { date: '2024-08-03', account: 'investment', type: 'Transfer', amount: 200, fromAccount: 'checking', toAccount: 'investment' },
  ];
};

const TransactionPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState('all');

  useEffect(() => {
    async function getTransactions() {
      const data = await fetchTransactionHistory();
      setTransactions(data);
    }

    getTransactions();
  }, []);

  const handleAccountChange = (e) => {
    setSelectedAccount(e.target.value);
  };

  const filteredTransactions = selectedAccount === 'all'
    ? transactions
    : transactions.filter(tx => tx.account === selectedAccount || tx.fromAccount === selectedAccount || tx.toAccount === selectedAccount);

  return (
    <div>
      <h3 className="m-3">Transaction History</h3>
      <div>
        <label htmlFor="account-select">Filter by account:</label>
        <select id="account-select" value={selectedAccount} onChange={handleAccountChange}>
          <option value="all">All Accounts</option>
          <option value="savings">Savings</option>
          <option value="checking">Checking</option>
          <option value="investment">Investment</option>
        </select>
      </div>
      
      <div>
        <h4>Transaction Details</h4>
        <table className="transaction-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Type</th>
              <th>From Account</th>
              <th>To Account</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.map((tx, index) => (
              <tr key={index}>
                <td>{tx.date}</td>
                <td>{tx.type}</td>
                <td>{tx.fromAccount || '-'}</td>
                <td>{tx.toAccount || '-'}</td>
                <td>${tx.amount.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <br/>
        <Link to="/customer" className="submit-button">Back to Dashboard</Link>
      </div>
    </div>
  );
};

export default TransactionPage;