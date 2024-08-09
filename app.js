const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/Expresserror.js");
const session = require("express-session");
const flash = require("connect-flash");



const listings = require("./routes/listing.js")
const reviews = require("./routes/review.js")


const MONGO_URL = "mongodb://127.0.0.1:27017/wonderlust";

//calling the main fn 

main().then(()=>{
    console.log("connected to DB");
}).catch((err)=>{
    console.log(err);
})

//connecting to the db
async function main(){
    await mongoose.connect(MONGO_URL);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate)
app.use(express.static(path.join(__dirname,"/public")));


const sessionOption = {
    secret : "mysupersecratecode",
    resave : false,
    saveUninitialized : true,
    //setting expiry dateof cookie
    Cookie : {
        //suppose we want sessin to expir after seven days we hve to give in millisecond
        expires : Date.now() + 7 * 24 * 60 * 60 *1000,
        maxAge : 7 * 24 * 60 * 60 *1000,
        httpOnly : true,

    },

};
//basic root api
app.get("/",(req,res)=>{
    res.send("hi iam base root");
});

app.use(session(sessionOption));
app.use(flash());

app.use((req,res,next)=>{
    const success = req.flash("success");
    const error = req.flash("error");
    res.locals.success = success;
    res.locals.error = error;
    next();
})




app.use("/listings",listings)
app.use("/listings/:id/reviews/",reviews)





//this is set  for the all unauthorize routes
app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"page not found"));
});
//this send the actual err as response
app.use((err,req,res,next)=>{
    let {statusCode=500,message="something went wrong"}=err;
  //  res.status(statusCode).send(message);
  res.status(statusCode).render("error.ejs",{err})
});


app.listen(8080,()=>{
    console.log("server is listening to port 8080");

});
