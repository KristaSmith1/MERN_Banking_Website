import React from "react";
 
// We use Route in order to define the different routes of our application
import { Route, Routes } from "react-router-dom";
 
// We import all the components we need in our app
//import Navbar from "./components/navbar";
import Login from "./components/homepage";
import Account from "./components/account";
import Accounts from "./components/accountList";
import Edit from "./components/accountEdit";
 
const App = () => {
 return (
   <div>
     {/* <Navbar /> */}
     <Routes>
        <Route exact path="/" element={<Login />} />
        <Route path="/account" element={<Account />} />
        <Route path="/account-list" element={<Accounts />} />
        <Route path="/edit" element={<Edit />} />
     </Routes>
   </div>
 );
};
 
export default App;