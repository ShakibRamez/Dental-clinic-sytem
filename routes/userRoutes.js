const express = require("express")
const router = express.Router()

const userController = require("../controllers/userController")
    

// Get 
router.get("/", userController.getUsers);
router.get("/logout", userController.logout);
router.get("/checkLogin", userController.checkLogin)
router.get("/:id", userController.getUserById);


// PUT
router.put("/:id", userController.updateUsers);


// DELETE
router.delete("/:id", userController.deleteUsers);


// Post
router.post("/login", userController.login);
router.post("/", userController.addUsers);


module.exports = router;