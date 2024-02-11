const express = require('express');
const paths = require('path');
const bcrypt = require('bcrypt');
const userCollection = require('./src/db');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
const port = 3000;

app.set('view engine', 'ejs');

app.get("/", function(req, res) {
    res.redirect("/login");
});

app.get("/login", function(req, res) {
    res.render("login");
});

app.get("/signup", function(req, res) {
    res.render("signup"); 
});

//Sign up
app.post("/signup", async function(req, res) {
    try {
        const data = {
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
        };

        //If Exist
        const existingUser = await userCollection.findOne({username: req.body.username});
        if(existingUser){
            console.lof(existingUser)
            res.send("USER IS ALREADY EXIST!!!!!")
        }else{
            const userData = await userCollection.insertMany([data]);
            console.log(userData)
            res.status(201).send("User created successfully");
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});


// Login
app.post("/login", async function(req, res) {
    try{
        const user = await userCollection.findOne({username: req.body.username, password: req.body.password});
            if(!user){
            res.send("Invalid Password of Username");
        }else{
                if (user.username === "Dayana" && user.password === "123abc") {
                    res.render("admin");
                } else {
                    res.render("user");
                }
        }
    }catch(error){
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});