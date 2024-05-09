const router = require("express").Router();
const studiantControler = require("../../controller/studiant/studiant.controller");
router.post("/register", studiantControler.createStudiant);
router.post("/login", studiantControler.loginStudiant);
router.get("/:userId", studiantControler.infoStudiant);
module.exports = router;
