const router = require("express").Router();
const adminControler = require("../../controller/admin/admin.controller");
router.post("/login", adminControler.login);
router.post("/register", adminControler.signup);

module.exports = router;
