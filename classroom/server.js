const express = require("express");
const app = express();
const users = require("./routs/user.js")
const posts = require("./routs/post.js")
const session = require("express-session")
const flash = require("connect-flash")
const path = require("path")

app.set("view engine" , "ejs" );
app.set("views" , path.join(__dirname , "views"));


const sessionOption ={
    secret:"mysupersecretestring",
    resave:false,
    saveUninitialized:true
}
app.use(session(sessionOption))
app.use(flash())
 
app.get("/resister" , (req , res)=>{
    let {name  = "an"} = req.query;
  req.session.name= name;
      
      if(name==="an"){
        req.flash("err" , "user not resisterd" )
      }
     else{
        req.flash("SUCCESS" , "user resistred successfully" )
     }
      res.redirect("/hello")
})
 
app.get("/hello" , (req , res)=>{
    console.log("Hello")
    res.locals.messages = req.flash("SUCCESS");
    res.locals.errmsg = req.flash("err");
    // res.send(`Hello ${req.session.name}`)
    res.render("page.ejs" , {name: req.session.name})
})
// app.use(session({secret : "mysupersecretestring" ,resave:false , saveUninitialized:true}))
// app.get("/test" , (req ,res)=>{
//     if(req.session.count){
//         req.session.count++;
//     }
//     else{
//         req.session.count =1;
//     }
   
//     res.send(`you send request ${req.session.count} times`)
// })
// const cookieParser = require("cookie-parser")
// app.use(cookieParser("secretcode"));
// app.get("/getsignedcookie" , (req , res)=>{
//     res.cookie("made-in" , "India" , {signed:true});
//     res.send("Signed cookie Sent");
// })
// app.get("/verify" , (req , res)=>{
//     console.log(req.signedCookies);
//     res.send("Verifieds")
// })
// app.get("/getc" , (req ,res)=>{
//     res.cookie("greet" , "hello")
//     console.log(req.cookies)
//     res.send("Sent you some coockies")
// })
// app.get("/greet" , (req , res)=>{
//     let {name="anoymous"} = req.cookies;
//     res.send(`HI ${name}`)
// })
// app.get("/" , (req , res)=>{
//     res.send("heyy i am root ")
// })

// app.use("/users" , users)
// app.use("/posts" ,posts)
// //INDEX - USERS
// app.get("/users" , (req , res)=>{
//     res.send("GET for users")
// })

// //Show-Routs
// app.get("/users/:id" , (req , res)=>{
//     res.send("GET for  show users")
// })
// //POST - USERS 
// app.post("/users" , (req , res)=>{
//     res.send("POST for users")
// })
// //DELETE - USERS
// app.delete("/users/:id" , (req , res)=>{
//     res.send("Delete for users");
// })

// // ==================POST===================




// //INDEX 
// app.get("/posts" , (req , res)=>{
//     res.send("GET for posts")
// })

// //Show
// app.get("/posts/:id" , (req , res)=>{
//     res.send("GET for  show posts")
// })
// //POST
// app.post("/posts" , (req , res)=>{
//     res.send("POST for posts")
// })
// //DELETE
// app.delete("/posts/:id" , (req , res)=>{
//     res.send("Delete for post");
// })

app.listen(3000 , ()=>{
    console.log("Server is listening on port 3000")
})