const express = require("express")

const router = express.Router()

const ctrl = require("../../controllers/users");
const { validateBody, auth, upload } = require("../../middlewares");
const { registerSchema, loginSchema } = require("../../schemas/users");


router.post("/register", validateBody(registerSchema), ctrl.register);

router.post("/login", validateBody(loginSchema), ctrl.login);

router.post("/logout", auth, ctrl.logout);

router.get("/current", auth, ctrl.getCurrent);

router.patch("/", auth, ctrl.updateSubscription);

router.patch("/avatars", auth, upload.single("avatar"), ctrl.updateAvatar);

module.exports = router;