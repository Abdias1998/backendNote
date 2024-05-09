const User = require("../../models/professor/professor.models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

module.exports.createProfessor = async (req, res) => {
  const { etat, firstName, lastName, classe, sexe, serie, type, cours } =
    req.body;

  // Enregistrer l'utilisateur dans la base de données
  try {
    const newUser = new User({
      etat,
      firstName,
      lastName,
      classe,
      serie,
      type,
      sexe,
      cours,
      rating: [],
    });
    await newUser.save();

    res.status(201).json({ message: "Utilisateur créé avec succès." });
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la création de l'utilisateur." + error,
    });
  }
};

module.exports.getProfesseur = async (req, res) => {
  try {
    // Récupérer les paramètres de la requête
    const { etat, classe, type, serie } = req.body;

    // Rechercher les professeurs correspondants
    const professors = await User.find({ etat, classe, type, serie });

    // Renvoyer les professeurs trouvés
    res.json(professors);
  } catch (err) {
    // Gérer les erreurs
    console.error(err);
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération des professeurs." });
  }
};

module.exports.addRatingToProfessor = async (req, res) => {
  try {
    const { professorId } = req.params;
    const { studentId, value } = req.body;

    // Vérifier si le professeur existe
    const professor = await User.findById(professorId);
    if (!professor) {
      return res.status(404).json({ message: "Professeur non trouvé." });
    }

    // Vérifier si l'étudiant a déjà voté
    const alreadyVoted = professor.rating.some(
      (vote) => vote.studentId === studentId
    );
    if (alreadyVoted) {
      return res
        .status(400)
        .json({ message: "L'étudiant a déjà voté pour ce professeur." });
    }

    // Ajouter la note au tableau rating
    professor.rating.push({ studentId, value, timestamp: Date.now() });
    await professor.save();

    res.json({ message: "Note ajoutée avec succès.", professor });
  } catch (error) {
    console.error("Erreur lors de l'ajout de la note au professeur :", error);
    res.status(500).json({ message: "Erreur lors de l'ajout de la note." });
  }
};
// Creer un professeur

// Supprimer un professur

// Mettre a jour un professeur

// Recuperer les professeur

// Renvoyer les professeurs selon la classe et l"etablissement
