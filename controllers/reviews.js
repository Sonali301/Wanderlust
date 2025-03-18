const Listing = require("../models/listing"); // requiring listing model
// requiring review model
const Review = require("../models/review");

module.exports.createReview = async(req,res) => {
    let listing = await Listing.findById(req.params.id); //accessing the same listing id
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    req.flash("success","New Review Created!");
    res.redirect(`/listings/${req.params.id}`);  // redirect to same page
};

module.exports.destroyReview = async(req,res)=>{
    let {id,reviewId} = req.params;

    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review Deleted!");
    res.redirect(`/listings/${id}`);
};
