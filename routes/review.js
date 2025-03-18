const express = require("express");
const router = express.Router({mergeParams: true});
const {isLoggedIn,validateListing,isReviewAuthor} = require("../middleware.js");
// requiring wrapfunction
const wrapAsync = require("../utils/wrapAsync.js");

// requiring expresserror
const ExpressError = require("../utils/expressError.js");

// requiring validate review
const {validateReview} = require("../middleware.js");

const Listing = require("../models/listing.js"); // requiring listing model

// requiring review model
const Review = require("../models/review.js");

// requiring controller
const reviewController = require("../controllers/reviews.js");

// Post review route
router.post("/",isLoggedIn,validateReview,wrapAsync(reviewController.createReview));


// Delete review route
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(reviewController.destroyReview));

module.exports = router;