const express = require("express");
const router = express.Router();
const habitController = require("../controllers/habitController");
const auth = require("../middleware/auth");

router.get("/", auth, habitController.getHabits);
router.post("/", auth, habitController.createHabit);
router.post("/:id/check", auth, habitController.checkHabit);
router.delete("/:id", auth, habitController.deleteHabit);
router.get("/stats", auth, habitController.getStats);

module.exports = router;
