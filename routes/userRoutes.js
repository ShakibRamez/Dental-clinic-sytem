const express = require("express")
const router = express.Router()

const userController = require("../controllers/userController")
    

router.get("/", userController.getUsers);

router.post("/login", userController.login);

router.get("/:id", userController.getUserById);


router.put("/:id", userController.updateUsers);


router.delete("/:id", userController.deleteUsers);


router.post("/", userController.addUsers);


module.exports = router;