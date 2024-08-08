import React from "react";
// We import NavLink to utilize the react router.
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router";


// Here, we display our Navbar
export default function Navbar() {

  const navigate = useNavigate();

  function showNav() {
    let sessionName = localStorage.getItem("username")
    if (sessionName !== "" && sessionName !== null) {
      return (
        <div className="nav-button-div">
          <NavLink className="submit-button account-button nav-button" to={"/account/" + sessionName}>
            My Account
          </NavLink>
          <button onClick={logout} className="submit-button account-button nav-button" type="button">
              Logout
          </button>
        </div>
      )
    }
  }

  // Remove session name
  function logout() {
    console.log("Logout pushed")
    localStorage.removeItem("username")
    navigate("/")
  }

  return (
    <div className="nav-div">
        {showNav()}
    </div>
  );
}
