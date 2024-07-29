// This file was created to make the frontend folder
// the Login function will allow users to login

import React, { useState, useEffect } from "react";
//import { NavLink } from "react-router-dom";
//import { useNavigate } from "react-router";
import { ReactSession } from "react-client-session";

import "./homepage.css";

export default function Login() {
    const [form, setForm] = useState({
        // set form to blanks as default
        username: "",
        password: "",
        message: ""
    });

    //const navigate = useNavigate(); // allow user to navigate to other pages

    function updateForm(value) {
        // update variables
        return setForm((prev) => {
            return { ...prev, ...value };
        });
    }

    async function onSubmit(e) {
        // when form is submitted, send info to db
        e.preventDefault();

        const formData = { ...form };

        const response = await fetch("http://localhost:5000/bankAccounts", {
            // send form data to the db
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
        }
        )
            .catch(error => {
                // display error message if unable to fetch info
                window.alert(error);
                return;
            });

        const user = await response.json();
        // reset form to blank, set message to username
        setForm({ username: "", password: "", message: user.message });

        if (user.message == null) {
            // if no
            ReactSession.setStoreType("sessionStorage");
            ReactSession.set("username", user._id);

            // check to see if username stored correctly
            console.log("From login: " + ReactSession.get("username"));


            // navigate to user account
            //navigate("/userAccount/" + user._id);
        }



    }

    return (
        <div>
            <h3>Welcome to Gecko Banking!</h3>
            <div class="card">
                <img src="https://images.unsplash.com/photo-1634207138281-3321b35e9662?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" class="card-img-top" alt="A gecko"
                />
                <div class="card-body">
                    <form onSubmit={onSubmit}>

                        <label for="username" class="form-label">Username</label>
                        <input type="text" id="usernameInput" class="form-control border-success" placeholder="Please enter your username"
                            value={form.username}
                            onChange={(e) => updateForm({ username: e.target.value })}
                        />

                        <div>
                            <label htmlFor="password" className="form-label">Password</label>
                            <input type="text" id="password" placeholder="Please enter your password"
                                value={form.password}
                                onChange={(e) => updateForm({ password: e.target.value })}
                            />
                        </div>
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

