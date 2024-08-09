const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapasync.js")
const {listingSchema} = require("../schema.js");
const ExpressError = require("../utils/Expresserror.js");
const Listing = require("../models/listing.js")




const validateListing = (req,res,next)=>{
    let {error} =listingSchema.validate(req.body);
    
    if(error){
        //all the error details is stored  in obj where key name is details so we are extracting and map to pring t indually
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400,errMsg);
    }
    next();
};

//our first listing route
router.get("/",
    wrapAsync(async(req,res)=>{
  const allListings =  await Listing.find({});
  res.render("listings/index.ejs",{allListings});
}));
//add in new route
router.get("/new",(req,res)=>{
    res.render("listings/new.ejs")
}
);

//show route 
router.get("/:id",
    wrapAsync(async(req,res)=>{
    let {id} = req.params;
   const listing = await Listing.findById(id).populate("reviews");
   if(!listing){
    req.flash("error","page not found")
    res.redirect("/listings");

   }
   res.render("listings/show.ejs",{listing})
}));

//create route
router.post("/",validateListing,
    wrapAsync( async(req,res,next)=>{
    
    const newlisting = new Listing(req.body.listing);
    await newlisting.save();
    req.flash("success","new listing created")
    res.redirect("/listings");
    
}));
//edit route
router.get("/:id/edit",
    wrapAsync(async(req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","page not found")
        res.redirect("/listings");
    
       }
    res.render("listings/edit.ejs",{listing});
}));

//update route
router.put("/:id",validateListing,
    wrapAsync(async(req,res)=>{
        
    let {id} =req.params;
    // deconstructing the body and 
   await  Listing.findByIdAndUpdate(id,{ ...req.body.listing});
   req.flash("success","listing updated")

   res.redirect(`/listings/${id}`);
}));
//delete route
router.delete("/:id",
    wrapAsync(async(req,res)=>{
    let {id} = req.params;
   let deletedListing =  await Listing.findByIdAndDelete(id);
   console.log(deletedListing);
   req.flash("success","listing is deleted")

   res.redirect("/listings")
}));


module.exports = router;