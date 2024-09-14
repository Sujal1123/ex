const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const passport = require("passport");
const session = require('express-session');
const LocalStorage = require("passport-local");
const plm = require("passport-local-mongoose");
const User = require("./models/user.js");
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://sujaldandhale:PgBoh6l72RNS5x9q@cluster1.tkzjs.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1";
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);


const MONGO_URL = "mongodb://127.0.0.1:27017/exp";

main().then(() => {
    console.log("connected to db");
}).catch(err => {
    console.log(err);
});

async function main() {
    await mongoose.connect(MONGO_URL);
}

app.set("views engine", "ejs");
app.set("views",path.join(__dirname, "views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

app.use(session({
    secret: 'happy',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
  }));

  app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStorage(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/", (req,res) => {
    res.send("Hi I am Root");
});

app.get("/login", (req,res) => {
    res.render("users/login.ejs");
});

app.post("/login", passport.authenticate('local', { failureRedirect: '/login', failureMessage: true }), async(req,res) => {
    res.redirect("/");
  });


  app.get("/signup", (req,res) => {
    res.render("users/signup.ejs");
});

app.post("/signup", async(req,res) => {
  let {username, email, password} = req.body;
  const newUser = new User({email, username});
  const registeredUser = await User.register(newUser, password);
  console.log(registeredUser);
  res.redirect("/");
});
 
app.listen(8080, () => {
    console.log("server is listening to port 8080");
});
