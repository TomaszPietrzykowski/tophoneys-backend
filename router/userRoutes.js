const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const userController = require("../controller/userController");

router
  .route("/")
  .post(userController.registerUser)
  .get(authMiddleware.protect, authMiddleware.admin, userController.getUsers);

router.post("/login", userController.authUser);

router
  .route("/profile")
  .get(authMiddleware.protect, userController.getUserProfile)
  .put(authMiddleware.protect, userController.updateUserProfile);

router
  .route("/:id")
  .delete(
    authMiddleware.protect,
    authMiddleware.admin,
    userController.deleteUser
  );

module.exports = router;
