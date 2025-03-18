if(process.env.NODE_ENV != "production"){
    // Requiring dotenv
    require('dotenv').config();
}

// BASIC SETUP
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const session = require ("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");

// passport
const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const User = require("./models/user.js");

// requiring expresserror
const ExpressError = require("./utils/expressError.js");

// requiring listing and review separate file route
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

// EJS SETUP
const path = require("path");
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
// const ejs = require("ejs");
app.use(express.urlencoded({extended:true}));

// REQUIRING AND SETUP FOR EJS-MATE
const ejsMate = require("ejs-mate");
app.engine("ejs",ejsMate);

// TO USE PUBLIC FOLDER like static files
app.use(express.static(path.join(__dirname,"/public")));


// TO CONVERT POST TO PUT REQUEST
const methodOverride=require("method-override");
const user = require("./models/user.js");
app.use(methodOverride("_method"));


const dbUrl = process.env.ATLASDB_URL;
main ()
    .then(()=>{
        console.log("connected to DB");
    })
    .catch((err)=>{
        console.log(err);
    });
async function main(){
    await mongoose.connect(dbUrl);
}

// MONGO STORE
const store = MongoStore.create({
    mongoUrl : dbUrl,
    crypto :{
        secret: process.env.SECRET,
    },
    touchAfter : 24 * 3600,
});

store.on("error",()=>{
    console.log("ERROR in MONGO SESSION STORE",err);
})

// Express-session
const sessionOptions = {
    store, // mongo store related information
    secret : process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires: Date.now() + 7 *24 *60 * 60 * 1000,
        maxAge: 7 *24 *60 * 60 * 1000,
        httpOnly : true,  // to prevent from cross scripting attack
    },
};

// app.get("/",(req,res)=>{
//     res.send("Hi! I am root");
// });



app.use(session (sessionOptions));
// connect-flash
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// FLASH MIDDLEWARE
app.use((req,res,next)=>{
    res.locals.msgSuccess = req.flash("success");
    res.locals.msgError = req.flash("error");
    res.locals.currUser = req.user;
    next();
})

// Demo
// app.get("/demoUser",async(req,res)=>{
//     let fakeUser = new User({
//         email:"student@gmail.com",
//         username:"delta-student",
//     });
//     let registeredUser = await User.register(fakeUser,"helloworld");
//     res.send(registeredUser);
// })

app.use("/listings",listingRouter);  // to use listing route have common path
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);

// Listing.findByIdAndUpdate(id, { ...req.body.listing }):
// Finds a listing in the database by its id.
// Updates it with the data sent in req.body.listing.
// { ...req.body.listing } spreads the listing object inside req.body, ensuring all fields are updated.

// for wrong route
app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page Not Found!"));
})

// Middlewares
app.use((err,req,res,next)=>{
    let {statusCode = 500,message = "Something went wrong!"} = err;
    res.status(statusCode).render("error.ejs",{message});
    // res.status(statusCode).send(message);
})

app.listen(8080,()=>{
    console.log("server is listening to port 8080");
    
});

