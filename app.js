// Import libraries by creating variables and require their libraries
const express = require('express');
const app = express(); // Creating a new variable called 'app' that creates a new instance of express
const morgan = require('morgan');
const mysql = require('mysql');
const bodyParser = require('body-parser'); 
const path = require('path'); // The path module provides utilities for working with file and directory paths

// Using morgan to log info of the requests
app.use(morgan('common'))

// Application server is now serving all files in the "./public" directory. 
app.use(express.static('./public'))

// A piece of middleware that helps process requests easier. Example: Get data passed into a form 
app.use(bodyParser.urlencoded({extended: false}))

// Creating a connection to the mysql database
function getConnection(){
    return mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '1234',
        database: 'dbproject'
    }); 
}

// Specifies the routes

/* In the callback function: 
1. "/" is the root, 
2. "req" is the request from the browser, 
3. "res" is the respons you want to give the get request */

// The landing page (root page)
app.get("/", (req, res) => {
    console.log("Responding to root route")
    res.sendFile(path.join(__dirname + '/public/index.html'));
});

// Creating a route to handle post requests (creating new users)
app.post('/user_create', (req, res) => {
    console.log("Trying to create a new user...")
    const firstName = req.body.create_first_name
    const lastName = req.body.create_last_name

    const queryString = "INSERT INTO users (firstName, lastName) VALUES (?, ?)"
    getConnection().query(queryString, [firstName, lastName], (err, results, fields) => {
        if (err) {
            console.log("Failed to insert new user: " + err)
            res.sendStatus(500)
            return
        }

        console.log("Inserted a new user with id: ", results.insertedId)
        res.end()
    });
});

// Creating a get request that fetch specific users identified by id
app.get('/users/:id', (req, res) => {
    console.log("Fetching user with id: " + req.params.id)

    const connection = getConnection()

    const userId = req.params.id
    const queryString = "SELECT * FROM users WHERE id = ?"
    connection.query(queryString, [userId], (err, rows, fields) => {
        if (err) {
            console.log("Failed to query for users: " + err)
            res.sendStatus(500)
            return
        }
        console.log('We fetched user successfully')
        res.json(rows)
    });
});

// Returning JSON to the route "/users"
app.get("/users", (req, res) => {

    const connection = getConnection()

    const userId = req.params.id
    const queryString = "SELECT * FROM users"
    connection.query(queryString, [userId], (err, rows, fields) => {
        if (err) {
            console.log("Failed to query for users: " + err)
            res.sendStatus(500)
            return
        }
        console.log('We fetched users successfully')
        res.json(rows)
    });
});

    app.get('/brugere', (req, res) => {
        const userId = req.params.id
        const queryString = "SELECT firstName FROM users"
        const bruger = "";
        getConnection().query(queryString, [userId], (err, rows, fields) => {
            console.log("brugere: " + userId)
            res.json(rows)
        })
    });

// Making the server running on port 3000 and specifies a callbackback function
app.listen(3000, () => {
    console.log("Server is up and listening on port 3000")
});
