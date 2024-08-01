import React from "react";
 
// We use Route in order to define the different routes of our application
import { Route, Routes } from "react-router-dom";
 
// We import all the components we need in our app
//import Navbar from "./components/navbar";
import Login from "./components/homepage";
import Account from "./components/account";
import AccountList from "./components/accountList";
import CustomerList from "./components/customerList";
import Edit from "./components/accountEdit";
import Add from "./components/accountAdd";
 
const App = () => {
 return (
   <div>
     {/* <Navbar /> */}
     <Routes>
        <Route exact path="/" element={<Login />} />
        <Route path="/account" element={<Account />} />
        <Route path="/account-list" element={<AccountList />} />
        <Route path="/customer-list" element={<CustomerList />} />
        <Route path="/edit" element={<Edit />} />
        <Route path="/add" element={<Add />} />
     </Routes>
   </div>
 );
};
 
export default App;