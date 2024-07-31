import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
// We import NavLink to utilize the react router.
import { NavLink } from "react-router-dom";
// Session data
import { ReactSession } from 'react-client-session';

import "./homepage.css";

export default function Account() {


    const [form, setForm] = useState({
        firstname: "Harry",
        lastname: "Potter",
        email: "harrypotter@hogwarts.com",
        phone: "1111111111",
        password: "",
        savings: "24",
        checking: "12",
        role: "Administrator",
        //role: "Employee",
        //role: "Customer",
        checkingWithdraw: 0.0,
        checkingDeposit: 0.0,
        checkingTransfer: 0.0,
        savingsWithdraw: 0.0,
        savingsDeposit: 0.0,
        savingsTransfer: 0.0,
    });
    const params = useParams();
    const navigate = useNavigate();

    function showOptions(role) {
        if (role == "Administrator") {
            return (
                <div>
                    <a href="/" className="submit-button account-button">Homepage</a>
                    <a href="/account" className="submit-button account-button">Transfer Money</a>
                    <a href="/account-list" className="submit-button account-button">Account List</a>
                </div>
            )
        }
        else if (role == "Employee") {
            return (
                <div>
                    <a href="/" className="submit-button account-button">Homepage</a>
                    <a href="/account" className="submit-button account-button">Transfer Money</a>
                </div>
            )
        }
        else {
            return(
                <div>
                    <a href="/" className="submit-button account-button">Homepage</a>
                </div>
            )
        }
    }
    
    return (
        <div>
            <div className="content account">

                <h3 className="">
                    {form.firstname} {form.lastname}'s Account
                    <br />
                    {form.role}
                </h3>
                <div className="account-info">
                    <h3>Account Info</h3>
                    <h4 className="m-3">Email: {form.email}</h4>
                    <h4 className="m-3">Phone: {form.phone}</h4>
                    <h4 className="m-3">Savings Balance: ${form.savings}</h4>
                    <h4 className="m-3">Checking Balance: ${form.checking}</h4>
                    <h5 className="m-5"></h5>
                    <a href="/edit" className="submit-button account-button">Edit</a>
                </div>

                <div className="account-options">
                    <h3>{form.role} Options</h3>
                    <div className="account-buttons">
                        {showOptions(form.role)}
                    </div>
                </div>

            </div>

            {/* end of card */}
            <div className="footer">
                <p>Copyright &copy; 2024 Team Gecko</p>
            </div>

        </div>
    );
}