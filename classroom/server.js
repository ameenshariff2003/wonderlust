const express = require("express");
const app = express();
// const cookieParse = require("cookie-parser");
const session = require("express-session");
const flash = require("connect-flash");
const path =require("path");
// const { ClientRequest } = require("http");


//implement express-session


app.set("view engine", "ejs");
app.set("views", path.join(__dirname,"views"));

const sessionOption = {
    secret : "mysupersecretstring",
    resave:false,
    saveUninitialized:true};



    app.use(session(sessionOption));
    app.use(flash());

app.get("/register",(req,res)=>{
    let {name = "anonymous"} = req.query;
    req.session.name = name;
    console.log(req.session.name);
    req.flash("success","user registerd");
    res.redirect("/hello");
})


app.get("/hello", (req, res) => {
    const messages = req.flash("success");
    res.locals.messages = messages;
    res.render("page.ejs", { name: req.session.name });
});








// Even there is zero changes in session the reserve saves again the session data
// the session which is uninitialize tht also gets save 

// app.get("/test",(req,res)=>{
//     res.send("test success");
// })

//counting how mqny time the req is sent
app.get("/reqcount",(req,res)=>{
    if(req.session.count){
        req.session.count++;
    }else{
        req.session.count=1;
    }
    
    res.send(`you sent ${req.session.count} tmes`)

})

// app.use(cookieparse());

// app.get("/getcokie",(req,res)=>{
//     res.cookie("greet","hello ji");
//     res.send("hello heee")
// });
// app.get("/",(req,res)=>{
//     res.send("hi  iam root");
//     console.dir(req.cookies)
// });


app.listen(3000,()=>{
    console.log("server is listening to 3000");
})