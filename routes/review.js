const express = require("express");
const router = express.Router({mergeParams : true});
const wrapAsync = require("../utils/wrapasync.js")
const {reviewSchema} = require("../schema.js");
const ExpressError = require("../utils/Expresserror.js");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");




const validateReview = (req,res,next)=>{
    let {error} =reviewSchema.validate(req.body);
    
    if(error){
        //all the error details is stored  in obj where key name is details so we are extracting and map to pring t indually
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400,errMsg);
    } 
    next();
}


//review route
router.post("/",validateReview,wrapAsync(async(req,res)=>{
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    console.log("new review saved")
    req.flash("success","new review added")

    res.redirect(`/listings/${listing._id}`);
 
 }));
 // delete review route
 // to delete the review which is inside listing model and also in review model we use pull
 
 router.delete("/:reviewId",wrapAsync(async (req,res)=>{
 let {id,reviewId} = req.params;
 await Listing.findByIdAndUpdate(id,{$pull : {reviews : reviewId}})
 await Review.findByIdAndDelete(reviewId);
 req.flash("success","review deleted")

 
 res.redirect(`/listings/${id}`)
 }));


 module.exports = router;