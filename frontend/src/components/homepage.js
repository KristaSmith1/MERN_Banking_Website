// This file was created to make the frontend folder
// the Login function will allow users to login

import React, { useState } from "react";
//import { NavLink } from "react-router-dom";
import { useParams, useNavigate } from "react-router";
import { ReactSession } from "react-client-session";

import "./homepage.css";

export default function Login() {
    const [form, setForm] = useState({
        // set form to blanks as default
        email: "",
        password: "",
        message: ""
    });

    const [invalidMessage, setInvalidMessage] = useState(''); // message to show incorrect username/password

    const navigate = useNavigate(); // allow user to navigate to other pages

    function updateForm(value) {
        // update variables
        return setForm((prev) => {
            return { ...prev, ...value };
        });
    }

    async function onSubmit(e) {
        // when form is submitted, send info to db
        e.preventDefault();

        const existingPerson = { ...form };

        const response = await fetch("http://localhost:5000/accounts/login",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(existingPerson),
            })
            .catch(error => {
                console.log("ERROR - UNABLE TO FETCH");
                // display error message if unable to fetch info
                window.alert(error);
                return;
            });

        const user = await response.json();

        console.log("User: " + user);
        console.log("email: " + user.email);
        console.log("password: " + user.password);
        console.log("message: " + user.message);

        // reset form to blank, set message to username
        setForm({ email: "", password: "", message: user.message });



        if (user.message == null) {
            ReactSession.setStoreType("sessionStorage");
            ReactSession.set("username", user._id);

            // check to see if username stored correctly
            console.log("From login: " + ReactSession.get("username"));


            // navigate to user account
            //console.log("About to navigate to account");
            navigate("/account");
        }

        setInvalidMessage("Invalid email or password. Please correct and try again.");

    }

    return (
        <div>
            <h3>Welcome to Gecko Banking!</h3>
            <div className="content">
                <img src="https://images.unsplash.com/photo-1634207138281-3321b35e9662?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" class="card-img-top" alt="A gecko"
                />
                <div className="card-body">
                    <form onSubmit={onSubmit}>

                        <label htmlFor="email" className="form-label">Email</label>
                        <input type="text" id="email"
                            // class="form-control border-success"
                            placeholder="Please enter your email"
                            value={form.email}
                            onChange={(e) => updateForm({ email: e.target.value })}
                        />

                        <div>
                            <label htmlFor="password" className="form-label">Password</label>
                            <input type="text" id="password" placeholder="Please enter your password"
                                value={form.password}
                                onChange={(e) => updateForm({ password: e.target.value })}
                            />
                        </div>
                        <div className="invalidMessage">{invalidMessage}</div>
                        <div>
                            <input type="submit" value="Login" className="submit-button" />
                        </div>
                    </form>
                </div>
            </div>
            {/* end of card */}
            <div className="footer">
                <p>Copyright &copy; 2024 Team Gecko</p>
                <p>Photo by David Clode</p>
            </div>
        </div>
    );
}

