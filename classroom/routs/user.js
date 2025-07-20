const express = require("express");
const router = express.Router();
 
router.get("/" , (req , res)=>{
    res.send("GET for users")
})

//Show-Routs
router.get("/:id" , (req , res)=>{
    res.send("GET for  show users")
})
//POST - USERS 
router.post("users" , (req , res)=>{
    res.send("POST for users")
})
//DELETE - USERS
router.delete("/:id" , (req , res)=>{
    res.send("Delete for users");
})


module.exports = router;
