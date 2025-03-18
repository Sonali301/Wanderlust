const Listing = require("./models/listing");
const Review = require("./models/review"); 


// requiring expresserror
const ExpressError = require("./utils/expressError.js");

// requiring schema for server validation
const {listingSchema,reviewSchema} = require("./schema.js");


module.exports.isLoggedIn = (req,res,next)=>{
    // console.log(req.user);
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;  // redirect to original url
        req.flash("error","you must be logged in to create listing!");
        return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

// to prevent from making changes to other users
module.exports.isOwner = async(req,res,next) =>{
    let {id} =req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currUser._id)){
        req.flash("error","You are not the owner of this listing");
        return res.redirect(`/listings/${id}`);
    }

    next();
}

// validate listing method
module.exports.validateListing = (req,res,next) =>{
    let {error} = listingSchema.validate(req.body);  // error for the individual field
    
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
}

// validate review method
module.exports.validateReview = (req,res,next) =>{
    let {error} = reviewSchema.validate(req.body);  // error for the individual field
    
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
}

// to check whether the user is the author or not of the review that he/she want to delete
module.exports.isReviewAuthor = async(req,res,next) =>{
    let {id,reviewId} = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error","You are not the author of this review");
        return res.redirect(`/listings/${id}`);
    }

    next();
}