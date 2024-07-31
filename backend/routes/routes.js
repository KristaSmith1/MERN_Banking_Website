const express = require("express");
 
// recordRoutes is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /record.
const accountRoutes = express.Router();
 
// This will help us connect to the database
const dbo = require("../db/connection");
 
// This helps convert the id from string to ObjectId for the _id.
const ObjectId = require("mongodb").ObjectId;
 
 
// // This section will help you get a list of all the records.
accountRoutes.route("/accounts").get(async (req, res) => {
    try{
        let db_connect = dbo.getDb("bank_accounts");
        const result = await db_connect.collection("users").find({}).toArray();
        res.json(result);
    } catch (err) {
        throw err;
    }
 
});
 
// This section will help you get a single record by id
accountRoutes.route("/accounts/:id").get(async (req, res) => {
    try{
        let db_connect = dbo.getDb();
        let myquery = { _id: new ObjectId(req.params.id) };
        const result = await db_connect.collection("users").findOne(myquery);
        res.json(result);
    } catch (err) {
        throw err;
    }
});
 
// This section will help you create a new record.
accountRoutes.route("/accounts/add").post(async (req, res) => {
    try{
        let db_connect = dbo.getDb();
        let myobj = {
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email,
            phone: req.body.phone,
            password: req.body.password,
            savings: "0",
            checking: "0",
            roles: "",
        };
        //See if email already exists
        const checkEmail = await db_connect.collection("users").findOne({ email: myobj.email });
        if (checkEmail) {
            message = {message: "Error: Email already used."};
            res.json(message);
            //console.log(message);
        } else {
            // Insert new user
            const result = await db_connect.collection("users").insertOne(myobj);
            message = {message: "Success"};
            //console.log(message);
            res.json(result);
        }
    } catch (err) {
        throw err;
    }
});

// This section will help you login.
accountRoutes.route("/accounts/login").post(async (req, res) => {
    try{
        let db_connect = dbo.getDb();
        let myobj = {
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email,
            phone: req.body.phone,
            password: req.body.password,
            savings: "",
            checking: "",
            roles: "",
        };
        //See if email already exists
        const checkEmailAndPassword = await db_connect.collection("users").findOne({ email: myobj.email, password: myobj.password });
        if (!checkEmailAndPassword) {
            console.log("Error!!! Wrong!!");
            message = {message: "Error: No user"};
            res.json(message);
        } else {
            // Login user
            console.log("New: " + myobj.email + ", " + typeof(myobj.email));
            message = {message: "Success"};
            res.json(checkEmailAndPassword);
        }
    } catch (err) {
        throw err;
    }
});
 
// This section will help you update a record by id.
accountRoutes.route("/update/:id").put(async (req, res) => {
    console.log("Made it too backend account update...");
    try{
        let db_connect = dbo.getDb();
        let myquery = { _id: new ObjectId(req.params.id) };
        let newvalues = {
        $set: {
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email,
            phone: req.body.phone,
            password: req.body.password,
            roles: "",
        },
        };
        const result = await db_connect.collection("users").updateOne(myquery, newvalues); 
        console.log("1 document updated");
        res.json(result);
    } catch (err) {
        throw err;
    }
});

// This section will help you update a record by id.
accountRoutes.route("/update-balance/:id").put(async (req, res) => {
    console.log("Made it too backend account update...");
    try{
        let db_connect = dbo.getDb();
        let myquery = { _id: new ObjectId(req.params.id) };
        let newvalues = {
        $set: {
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email,
            phone: req.body.phone,
            password: req.body.password,
            savings: req.body.savings,
            checking: req.body.checking,
            roles: "",
        },
        };
        const result = await db_connect.collection("users").updateOne(myquery, newvalues); 
        console.log("1 document updated");
        res.json(result);
    } catch (err) {
        throw err;
    }
});
 
// This section will help you delete a record
accountRoutes.route("/:id").delete(async (req, res) => {
    try{
        let db_connect = dbo.getDb();
        let myquery = { _id: new ObjectId(req.params.id) };
        const result = await db_connect.collection("users").deleteOne(myquery);
        console.log("1 document deleted");
        res.json(result);
    } catch (err) {
        throw err;
    }
});
 
module.exports = accountRoutes;