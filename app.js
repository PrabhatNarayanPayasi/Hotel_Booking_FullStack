const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
 
 
require('dotenv').config();
// const dbUrl = process.env.Atlas_Url;
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

const  path = require("path");
const methodOverride = require("method-override");
const wrapAsync = require("./utils/wrappasync.js");
const ExpressError = require("./utils/ExpressError.js")
const ejsMate = require("ejs-mate");
const { Route } = require("@mui/icons-material");
const listingRouter = require("./routs/listing.js")
const Review = require("./models/review.js");
const reviewRouter = require("./routs/review.js")
const session = require("express-session");
const MongoStore = require("connect-mongo")
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js")
const userRouter = require("./routs/user.js")
// const {isLoggedIn} = require("../middleware.js")
console.log("Hello")
main().then(()=>{
    console.log("Connected to DB");
}).catch((err)=>{
    console.log(err);
})

// const sessionOption = {
//     secret:"mysupersecret",
//     resave:false,
//     saveUninitalized:true,
//     cookie:{
//         expires:Date.now() + 7 * 24 * 60 * 60 * 1000,
//         maxAge:7 * 24 * 60 * 60 * 1000,
//         httpOnly:true,
//     }
// }
// app.get("/", (req, res) => {
//     res.send("teri  root");
// });
// app.use(session(sessionOption));
// app.use(flash());
// app.use((req , res ,next)=>{
//     res.locals.success = req.flash("success")
//     next();
// })
// app.use("/listings"  ,listings)
// app.use("/listings/:id/reviews" , reviews);
async function main(){
   await mongoose.connect(MONGO_URL);
}
app.set("view engine" , "ejs" );
app.set("views" , path.join(__dirname , "views"));
app.use (express.urlencoded({extended : true}));
app.use(methodOverride("_method"));
app.engine("ejs" , ejsMate);
app.use(express.static(path.join(__dirname , "/public")))


// const store = MongoStore.create({
//     mongoUrl: dbUrl,
//     crypto:{
//         secret: "mysupersecretcode"
//     },
//     touchAfter: 24 * 3600 ,
// });

// store.on("error" , ()=>{
//     console.log("Error in mongo session store.",err)
// })
const sessionOption = {
    // store, 
    secret:"mysupersecret",
    resave:false,
    saveUninitalized:true,
    cookie:{
        expires:Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge:7 * 24 * 60 * 60 * 1000,
        httpOnly:true,
    },
};
// app.get("/", (req, res) => {
//     res.send("teri  root");
// });


app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize())
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req , res ,next)=>{
    res.locals.success = req.flash("success")
   res.locals.error = req.flash("error")
   res.locals.currUser =req.user;
    next();
})

// app.get("/demouser" , async(req , res)=>{
//     let fakeUser= new User({
//         email:"student@gmail.com",
//         username:"delta-student"
//     });
//   let resisterdUser = await  User.register(fakeUser , "helloworld")
// res.send(resisterdUser);
// })
app.use("/listings"  ,listingRouter)
app.use("/listings/:id/reviews" , reviewRouter);
app.use("/" , userRouter);







// ============================================================NEW Route===========================================================================
app.get("/listings/new" , (req , res , next)=>{
res.render("listings/new.ejs")
})
// ====================================CREATE Route====================================================
app.post("/listings" ,  async(req, res)=>{

    let listing = req.body.listing;
const newListing = new Listing(listing);
 await newListing.save();
res.redirect("/listings");

console.log(listing);
})
 
// ---------------------------------------------------------------------Index Route--------------------------------------------------------------------
app.get("/listings" ,  async (req , res)=>{ 
    const  allListings = await Listing.find({});
      res.render("listings/index.ejs" , {allListings});
      
    })
// --------------------------------------------------------Show Route--------------------------------------------------------------

app.get("/listings/:id" , wrapAsync(async(req, res)=>{
    let {id}  = req.params;
   const listing =  await Listing.findById(id).populate("reviews");
   res.render("listings/show.ejs" ,{listing} )

   
})
);

 
// ============================================Edit Route============================================================================
app.get("/listings/:id/edit" , wrapAsync(async (req , res)=>{
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs" , {listing});
})
)
// =================================================UPDATE ROUTE==========================================================

app.put("/listings/:id" , wrapAsync(async(req , res)=>{
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id , {...req.body.listing});
    res.redirect(`/listings/${id}`);
})
)

// =======================================================DELETE ROUTE=========================================================
app.delete("/listings/:id" , wrapAsync(async(req ,res) =>{
    let {id} = req.params;
     let deleted = await Listing.findByIdAndDelete(id);
     console.log(deleted);
     res.redirect("/listings");

})
);
// ===================================reviews ka post Route=================
app.post("/listings/:id/reviews" , async(req , res)=>{
 let listing = await Listing.findById(req.params.id);
 let newReview = new Review(req.body.review);
 listing.reviews.push(newReview);
await newReview.save();
await listing.save();
res.redirect(`/listings/${listing._id}`);
})
// ============================================reviews delete route===================================================

app.delete("/listings/:id/reviews/:reviewId" , wrapAsync(async(req , res)=>{
    let{id , reviewId}= req.params;
   await  Listing.findByIdAndUpdate(id , {$pull :{reviews:reviewId}})
  await  Review.findByIdAndDelete(reviewId);
  res.redirect(`/listings/${id}`)
}))
 
app.all("*" , (req , res , next) => {
    next(new ExpressError(400 , "Page not found"));
})
app.use((err , req , res , next)=>{
    let {statusCode = 500 , message="Something went wrong"} = err;
    // res.status(statusCode).send(message);
    // res.send("Something went wrong");
    
    res.render("error.ejs" , {message })
})

app.listen(8081 , ()=>{
    console.log("Server is listening to port 8080}");
})

