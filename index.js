const express = require("express");
const path = require("path");
const collection = require("./config");

const app = express();

// Convert data into JSON format
app.use(express.json());

// Static file
app.use(express.static("public"));

// Parse URL-encoded data
app.use(express.urlencoded({ extended: false }));

// Use EJS as the view engine
app.set("view engine", "ejs");

// Routes
app.get("/", (req, res) => {
    res.render("login");
});

app.get("/signup", (req, res) => {
    res.render("signup");
});
app.get("/login", (req, res) => {
    res.render("login");
});
// Register User
app.post("/signup", async (req, res) => {
    const data = {
        name: req.body.username,
        password: req.body.password // Storing plain text (NOT RECOMMENDED)
    };

    // Check if the username already exists in the database
    const existingUser = await collection.findOne({ name: data.name });

    if (existingUser) {
        res.send('User already exists. Please choose a different username.');
    } else {
        // Save the user data directly to the database (plain text password)
        const userdata = await collection.insertMany(data);
        console.log(userdata);
        res.send('User registered successfully!');
    }
});

// Login User
app.post("/login", async (req, res) => {
    try {
        const check = await collection.findOne({ name: req.body.username });

        if (!check) {
            res.send("Username not found");
        } else if (req.body.password !== check.password) {
            // Plain text password comparison (NOT SECURE)
            res.send("Wrong password");
        } else {
            res.render("home");
        }
    } catch (err) {
        console.error(err);
        res.send("Error logging in. Please try again.");
    }
});

// Define Port for Application
const port = 5000;
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});