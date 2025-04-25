const express = require("express");
const router = express.Router();
const subscribersController = require("../controllers/subscribersController");

router.get("/", subscribersController.getAllSubscribers);
router.get("/new", subscribersController.getSubscriptionPage);
router.post("/create", subscribersController.saveSubscriber);
router.get("/search", subscribersController.searchSubscribers);
router.get("/:id", subscribersController.show);
router.post("/:id/delete", subscribersController.deleteSubscriber);
router.get("/:id/edit", subscribersController.editSubscriber);
router.post("/:id/update", subscribersController.updateSubscriber);

module.exports = router;
