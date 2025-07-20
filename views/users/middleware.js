module.exports.isLoggedin = (req , res , next)=>{
    if(!req.isAuthenticated()){
        req.flash("error" , "You Must be logged in to create listings")
  return  res.redirect("/login")
    }
}