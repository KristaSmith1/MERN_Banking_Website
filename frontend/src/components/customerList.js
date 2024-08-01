import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
// Session data
import { ReactSession } from 'react-client-session';

import "./homepage.css";
 
const Account = (props) => (
 <tr>
  <td>{props.account.firstname}</td>
  <td>{props.account.lastname}</td>
  <td>{props.account.email}</td>
  <td>{props.account.phone}</td>
  <td>$ {props.account.savings}</td>
  <td>$ {props.account.checking}</td>
  <td>{props.account.role}</td>
  <td>
    <Link className="submit-button account-button" to={`/account`}>View</Link>
  </td>
 </tr>
);
 
export default function CustomerList() {
 const [account, setAccounts] = useState([]);
 
 // This method fetches the records from the database.
 useEffect(() => {
   async function getAccounts() {
     const response = await fetch(`http://localhost:5000/customers/`);
 
     if (!response.ok) {
       const message = `An error occurred: ${response.statusText}`;
       window.alert(message);
       return;
     }
 
     const accounts = await response.json();
     setAccounts(accounts);
   }
 
   getAccounts();

   console.log("From accountList: " + ReactSession.get("username"))
   //ReactSession.remove("username")
   //console.log(ReactSession.get("username"))
 
   return;
 }, [account.length]);
 
 
 // This method will map out the records on the table
 function accountList() {
   return account.map((account) => {
     return (
       <Account
          account={account}
          key={account._id}
       />
     );
   });
 }
 
 // This following section will display the table with the records of individuals.
 return (
    <div>
      <h3 className="m-3">Customer List</h3>
      <a href="/account" className="submit-button account-button">My Account</a>
      <table className="account-table" style={{ marginTop: 20 }}>
        <thead>
          <tr className="account-tr">
            <th>First</th>
            <th>Last</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Savings</th>
            <th>Checking</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>{accountList()}</tbody>
      </table>
    </div>
 );
}