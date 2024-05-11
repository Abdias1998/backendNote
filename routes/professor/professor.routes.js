const router = require("express").Router();
const professorControler = require("../../controller/professor/prof.controller");
router.post("/register", professorControler.createProfessor);
router.post("/find", professorControler.getProfesseur);
router.post(
  "/addRatingToProfessor/:professorId",
  professorControler.addRatingToProfessor
);
router.get(
  "/getNoteStudant/:professorId/:studiantId",
  professorControler.getStudentRating
);

module.exports = router;
