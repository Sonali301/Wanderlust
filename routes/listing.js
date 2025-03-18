const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js"); // requiring listing model
const {isLoggedIn,isOwner,validateListing} = require("../middleware.js");

// requiring wrapfunction
const wrapAsync = require("../utils/wrapAsync.js");

// requiring controller
const listingController = require("../controllers/listings.js");

// REQUIRING MULTER AND INITIALIZE MULTER ALSO
const multer  = require('multer')
const {storage} = require("../cloudConfig.js"); // requiring storage from cloudconfig.js file
const upload = multer({storage});

// INDEX AND CREATE ROUTE
router.route("/")
    .get(wrapAsync(listingController.index))
    .post(
        isLoggedIn,
        upload.single("listing[image]"),  // multer will process the image in the listing and bring that image to req.file  
        validateListing,
        wrapAsync(listingController.createListing)
    );  

// NEW ROUTE
router.get("/new",isLoggedIn,listingController.renderNewForm);

// SHOW , UPDATE AND DELETE ROUTE
router.route("/:id")
    .get(wrapAsync(listingController.showListing))
    .put(
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.updateListing)
    )
    .delete(
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.destroyListing)
    );

// EDIT ROUTE
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm));

module.exports = router;
    