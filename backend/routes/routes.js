const express = require("express");
const crypto = require("crypto");

// recordRoutes is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /record.
const accountRoutes = express.Router();
 
// This will help us connect to the database
const dbo = require("../db/connection");
 
// This helps convert the id from string to ObjectId for the _id.
const ObjectId = require("mongodb").ObjectId;
 
function generateCustomerId() {
    return 'C' + Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
}

accountRoutes.route("/accounts/add").post(async (req, res) => {
    try {
        let db_connect = dbo.getDb();
        let hashedPassword = crypto.createHash('sha256').update(req.body.password).digest('hex');
        let customerId = generateCustomerId();
        let myobj = {
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email,
            phone: req.body.phone,
            password: hashedPassword,
            savings: 0,
            checking: 0,
            investment: 0,
            role: "customer",
            customerId: customerId,
        };
        const checkEmail = await db_connect.collection("users").findOne({ email: myobj.email });
        if (checkEmail) {
            res.status(400).json({ message: "Error: Email already used." });
        } else {
            const result = await db_connect.collection("users").insertOne(myobj);
            res.status(201).json({ message: "Success", user: result.ops[0] });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Deposit Route
accountRoutes.route("/accounts/deposit").post(async (req, res) => {
    try {
        let db_connect = dbo.getDb();
        const { customerId, amount, accountType } = req.body;
        const user = await db_connect.collection("users").findOne({ customerId });

        if (user) {
            let newBalance = user[accountType] + parseFloat(amount);
            await db_connect.collection("users").updateOne({ customerId }, { $set: { [accountType]: newBalance } });

            const transaction = {
                customerId: customerId,
                type: "deposit",
                amount: amount,
                date: new Date(),
                description: `Deposited ${amount} to ${accountType}`,
            };
            await db_connect.collection("transactions").insertOne(transaction);
            res.json({ message: "Deposit successful", newBalance });
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Withdraw Route
accountRoutes.route("/accounts/withdraw").post(async (req, res) => {
    try {
        let db_connect = dbo.getDb();
        const { customerId, amount, accountType } = req.body;
        const user = await db_connect.collection("users").findOne({ customerId });

        if (user) {
            let newBalance = user[accountType] - parseFloat(amount);
            if (newBalance < 0) {
                res.status(400).json({ message: "Insufficient funds" });
                return;
            }
            await db_connect.collection("users").updateOne({ customerId }, { $set: { [accountType]: newBalance } });

            const transaction = {
                customerId: customerId,
                type: "withdraw",
                amount: amount,
                date: new Date(),
                description: `Withdrew ${amount} from ${accountType}`,
            };
            await db_connect.collection("transactions").insertOne(transaction);
            res.json({ message: "Withdrawal successful", newBalance });
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Transfer Route
accountRoutes.route("/accounts/transfer").post(async (req, res) => {
    try {
        let db_connect = dbo.getDb();
        const { customerId, fromAccountType, toAccountType, amount } = req.body;
        const user = await db_connect.collection("users").findOne({ customerId });

        if (user) {
            let newFromBalance = user[fromAccountType] - parseFloat(amount);
            if (newFromBalance < 0) {
                res.status(400).json({ message: "Insufficient funds" });
                return;
            }
            let newToBalance = user[toAccountType] + parseFloat(amount);

            await db_connect.collection("users").updateOne({ customerId }, { $set: { [fromAccountType]: newFromBalance, [toAccountType]: newToBalance } });

            const transaction = {
                customerId: customerId,
                type: "transfer",
                amount: amount,
                date: new Date(),
                description: `Transferred ${amount} from ${fromAccountType} to ${toAccountType}`,
            };
            await db_connect.collection("transactions").insertOne(transaction);
            res.json({ message: "Transfer successful", newFromBalance, newToBalance });
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Fetch individual account transaction history
accountRoutes.route("/transactions/:customerId/:accountType").get(async (req, res) => {
    try {
        let db_connect = dbo.getDb();
        const transactions = await db_connect.collection("transactions").find({ customerId: req.params.customerId, description: { $regex: req.params.accountType, $options: "i" } }).toArray();
        res.json(transactions);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Fetch full transaction history
accountRoutes.route("/transactions/:customerId").get(async (req, res) => {
    try {
        let db_connect = dbo.getDb();
        const transactions = await db_connect.collection("transactions").find({ customerId: req.params.customerId }).toArray();
        res.json(transactions);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

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

// // This section will help you get a list of all the records.
accountRoutes.route("/customers").get(async (req, res) => {
    try{
        let db_connect = dbo.getDb("bank_accounts");
        const result = await db_connect.collection("users").find({ "role": { $eq: "Customer" }}).toArray();
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
            role: req.body.role,
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