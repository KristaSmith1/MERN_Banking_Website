import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
// We import NavLink to utilize the react router.
import { Link } from "react-router-dom";

import "./homepage.css";

export default function Account() {

    const [form, setForm] = useState({
        firstname: "",
        lastname: "",
        email: "",
        phone: "",
        password: "",
        savings: "",
        checking: "",
        role: "",
        checkingWithdraw: 0.0,
        checkingDeposit: 0.0,
        checkingTransfer: 0.0,
        savingsWithdraw: 0.0,
        savingsDeposit: 0.0,
        savingsTransfer: 0.0,
    });
    const params = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchData() {
            const id = params.id.toString();
            const response = await fetch(`http://localhost:4000/accounts/${params.id}`);
        
            if (!response.ok) {
                const message = `An error has occurred: ${response.statusText}`;
                window.alert(message);
                return;
            }
        
            const account = await response.json();
            if (!account) {
                window.alert(`Account with id ${id} not found`);
                navigate("/");
                return;
            }
        
            setForm(account);
            console.log(account);
        }
      
        fetchData();
      
        return;
      }, [params.id, navigate]);

    function showOptions(role) {
        if (role == "Administrator") {
            return (
                <div>
                    <a href="/" className="submit-button account-button">Homepage</a>
                    <a href="/transactions" className="submit-button account-button">Transfer Money</a>
                    <a href="/account-list" className="submit-button account-button">Account List</a>
                    <a href="/add" className="submit-button account-button">Register New Account</a>
                </div>
            )
        }
        else if (role == "Employee") {
            return (
                <div>
                    <a href="/" className="submit-button account-button">Homepage</a>
                    <a href="/transactions" className="submit-button account-button">Transfer Money</a>
                    <a href="/customer-list" className="submit-button account-button">Customer List</a>
                    <a href="/add" className="submit-button account-button">Register New Account</a>
                </div>
            )
        }
        else {
            return(
                <div>
                    <a href="/" className="submit-button account-button">Homepage</a>
                    <a href="/transactions" className="submit-button account-button">Transfer Money</a>
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
                    <Link className="submit-button account-button" to={`/edit/${params.id}`}>Edit</Link>
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