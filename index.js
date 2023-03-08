const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

const app = express()
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cors())
app.use(cookieParser())

mongoose.connect("mongodb://localhost:27017/myLoginRegisterDB").then(()=>{
    console.log("db is connected")
}).catch((err)=>{
    console.log("db connection failed", err)
})


const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String
})

const User = new mongoose.model("User", userSchema)

//Routes

app.post("/login", (req, res)=> {
    const { email, password} = req.body
    User.findOne({ email: email})
        .then((user) => {
            if(user){
                if(password === user.password ) {
                    const token = jwt.sign({ id: user.id, email: user.email }, 'secret-key', { expiresIn: '15d' });

                    res.cookie('token', token, { maxAge: 3600000, httpOnly: true });
                    const decodedToken = jwt.verify(token, 'secret-key');
                    res.json({message: "Login Successfull", user: user, token: decodedToken})
                } else {
                    res.json({ message: "Password didn't match"})
                }
            } else {
                res.json({message: "User not registered"})
            }
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({ message: "Internal Server Error" });
        })
})


app.post("/register", async (req, res)=> {
    const { name, email, password} = req.body
    try {
        const user = await User.findOne({email: email});
        if(user){
            res.json({message: "User already registered"})
        } else {
            const newUser = new User({
                name,
                email,
                password
            })
            await newUser.save();
            res.json({ message: "Successfully Registered, Please login now." })
        }
    } catch(err) {
        console.log(err);
        res.status(500).json({ message: "Internal Server Error" });
    } 
})



app.get("/reminderUser", (req, res) => {
    const authHeader = req.headers["authorization"];
    const tokenString = authHeader.replace("Bearer ", "");
    const tokenObj= JSON.parse(tokenString)
    
    console.log("authHeader:", authHeader);
    console.log("tokenString:", tokenString);
  
    User.findOne({ email: tokenObj.email })
    .then(user => {
      if (!user) {
        console.log("User not found for email:", tokenObj.email);
        return res.status(401).json({ message: "Unauthorized" });
      }
      console.log("User found:", user);
      res.json({ user });
    })
    .catch(err => {
      console.log("Error:", err);
      return res.status(500).json({ message: "Server Error" });
    });
  
  });
  



  
      
  
  

app.post("/logout", (req, res) => {
    res.clearCookie('token')
    res.json({ message: "Logged out successfully" })
})

app.listen(9002,() => {
    console.log("BE started at port 9002")
})
