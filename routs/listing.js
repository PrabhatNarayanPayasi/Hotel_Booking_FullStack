const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrappasync.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner } = require("../middleware.js")
// const listingController = require("../controler/listings.js")
// const multer = require("multer");
// const upload = multer({dest : "upload/"})
// ===================NEW Route===========================================================================
router.get("/new", isLoggedIn, (req, res, next) => {

    res.render("listings/new.ejs");

})
// ========CREATE Route====================================================
router.post("/", isLoggedIn, wrapAsync(async (req, res, next) => {

    let listing = req.body.listing;
    const newListing = new Listing(listing);
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success", "New Listing Created")
    res.redirect("/listings");


    // console.log(listing);
})
    //    router.post(upload.single("listing[Image]") , (req , res)=>{
    // res.send(req.file)
);

// --------------------Index Route--------------------------------------------------------------------


router.get("/", async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });

}

)
// -----Show Route--------------------------------------------------------------

router.get("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate({ path: "reviews", populate: { path: "author" } }).populate("owner");
    if (!listing) {
        req.flash("error", "Listing not exist")
        res.redirect("/listings");
    }
    console.log(listing)
    res.render("listings/show.ejs", { listing })
})
);
// =======Edit Route============================================================================
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing not exist")
        res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { listing });
})
)
// ============UPDATE ROUTE==========================================================

router.put("/:id", isLoggedIn, isOwner, wrapAsync(async (req, res) => {
    let { id } = req.params;
    // let listing = await Listing.findById(id);
    // if (!listing.owner.equals(res.locals.currUser._id)) {
    //     req.flash("error", "You dont have permission to edit ")
    //     return res.redirect(`/listings/${id}`);
    // }
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success", " Listing Updated")
    res.redirect(`/listings/${id}`);
})
)
// =======================================================DELETE ROUTE=========================================================
router.delete("/:id", isLoggedIn, isOwner, wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deleted = await Listing.findByIdAndDelete(id);
    console.log(deleted);
    req.flash("success", "Listing Deleted")
    res.redirect("/listings");

})
);
module.exports = router;