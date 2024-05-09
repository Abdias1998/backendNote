const User = require("../../models/studiant/studiant.models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

module.exports.createStudiant = async (req, res) => {
  const { email, etat, firstName, lastName, classe, serie, type } = req.body;

  // Vérifier si etat, classe et password existent déjà

  const existingUser = await User.findOne({
    email: email,
  });
  if (existingUser) {
    return res
      .status(400)
      .json({ message: "Utilisateur existant avec ces informations." });
  }

  // Chiffrer le mot de passe avec bcrypt

  // Décomposer la date actuelle en un élément de 5 mots composés de chiffres et de lettres
  const currentDate = new Date();
  const dateElements = crypto.randomBytes(2).toString("hex");
  const hashedPassword = await bcrypt.hash(dateElements, 10);

  // Enregistrer l'utilisateur dans la base de données
  try {
    const newUser = new User({
      email,
      etat,
      firstName,
      lastName,
      serie,
      type,
      classe,
      password: hashedPassword, // Ajouter les éléments de date à l'utilisateur
    });
    await newUser.save();

    res
      .status(201)
      .json({ message: "Utilisateur créé avec succès.", dateElements });
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la création de l'utilisateur." + error,
    });
  }
};

module.exports.loginStudiant = async (req, res, next) => {
  const { email, password } = req.body;

  let existingUser;

  try {
    existingUser = await User.findOne({ email: email });
  } catch (error) {
    return res.status(500).json({
      message: `Erreur interne du serveur ${error}, veuillez vérifiez votre connexion internet" `,
    });
  }
  if (!existingUser) {
    return res.status(401).json({
      message: "L'élève avec cet   identifiant n'existe pas !",
    });
  }

  // comparer le mot de la bd au mot de passe saisie lors de la connexion
  const isPasswordCorrect = bcrypt.compareSync(password, existingUser.password);
  if (!isPasswordCorrect) {
    return res.status(401).json({
      message:
        "Le mot de passe n'es pas correcte, veuillez bien saisir vos cordonnées",
    });
  }

  return res.status(200).json({
    message: "Connection réussie",
    userId: existingUser._id,
  });
};

module.exports.infoStudiant = async (req, res) => {
  const { userId } = req.params; // Récupérer l'ID de l'utilisateur à partir des paramètres de la requête
  try {
    // Recherche de l'utilisateur dans la base de données par son ID,en excluant son mot de passe
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }
    // Renvoyer les informations de l'utilisateur
    res.status(200).json({ user });
  } catch (error) {
    console.error("Erreur lors de la recherche de l'utilisateur :", error);
    res.status(500).json({
      message: "Erreur serveur lors de la recherche de l'utilisateur",
    });
  }
};

// Supprimer un eleve
module.exports.deleteStudiant = () => {};
// Mettre a jour les infos d'un eleve
module.exports.updateStudiant = () => {};
// Voter un professur
module.exports.ratingStudiant = () => {};
