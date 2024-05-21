const User = require("../../models/professor/professor.models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const mongoose = require("mongoose");
module.exports.createProfessor = async (req, res) => {
  const { etat, firstName, lastName, classe, sexe, serie, bio, type, cours } =
    req.body;
  function toUpperCase(str) {
    // Utiliser la méthode toUpperCase() pour convertir la chaîne en majuscules
    return str.toUpperCase();
  }
  // Enregistrer l'utilisateur dans la base de données
  try {
    const newUser = new User({
      etat,
      firstName,
      name: `${toUpperCase(firstName)} ${lastName}`,
      lastName,
      classe,
      serie,
      bio,
      type,
      sexe,
      cours,
      rating: [],
      comments: [],
    });
    await newUser.save();

    return res.status(201).json({ message: "Professuer créé avec succès." });
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la création de l'utilisateur." + error,
    });
  }
};

module.exports.getProfesseur = async (req, res) => {
  try {
    // Récupérer les paramètres de la requête
    const { etat, classe, type, serie, userId } = req.body;

    // Rechercher les professeurs correspondants
    const professors = await User.find({ etat, classe, type, serie });

    // Pour chaque professeur, calculer le nombre total de votes et la note moyenne
    const professorsWithStats = await Promise.all(
      professors.map(async (professor) => {
        const totalVotes = professor.rating.length;
        let sum = 0;
        professor.rating.forEach((rating) => {
          sum += rating.valueNote;
        });

        // Calculer l'averageRating comme la somme des notes divisée par 5
        // S'assurer que l'averageRating est limité entre 0 et 5
        const averageRating = Math.min(Math.max(sum / totalVotes, 0), 5);

        // Récupérer la note de l'étudiant
        let userRating = null;
        const userRatingData = professor.rating.find(
          (rating) => rating.studiantId === userId
        );
        if (userRatingData) {
          userRating = userRatingData.valueNote;
        }

        // Ajouter les informations de notation au professeur
        return {
          ...professor.toObject(),
          totalVotes,
          averageRating,
          userRating,
        };
      })
    );

    // Trier les professeurs par ordre décroissant de la note moyenne
    professorsWithStats.sort((a, b) => b.averageRating - a.averageRating);

    // Renvoyer les professeurs avec les informations de notation calculées
    res.status(200).json(professorsWithStats);
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
    const { studiantId, valueNote } = req.body;

    // Vérifier si les identifiants sont au format mongoose
    if (
      !mongoose.Types.ObjectId.isValid(professorId) ||
      !mongoose.Types.ObjectId.isValid(studiantId)
    ) {
      return res.status(400).json({ message: "Identifiants invalides." });
    }

    // Vérifier si le professeur existe
    const professor = await User.findById(professorId);
    if (!professor) {
      return res.status(404).json({ message: "Professeur non trouvé." });
    }

    // Vérifier si l'étudiant a déjà noté
    const alreadyVoted = professor.rating.some(
      (vote) => vote.studiantId === studiantId
    );
    if (alreadyVoted) {
      return res.status(400).json({
        message: `Vous aviez déjà noté pour le professeur ${professor.name}`,
      });
    }

    // Ajouter la note au tableau rating
    professor.rating.push({ studiantId, valueNote, timestamp: Date.now() });
    await professor.save();

    res.json({
      message: `Note de ${valueNote} ajoutée avec succès.`,
      professor,
    });
  } catch (error) {
    console.error("Erreur lors de l'ajout de la note au professeur :", error);
    res.status(500).json({ message: "Erreur lors de l'ajout de la note." });
  }
};

// Contrôleur pour récupérer la note d'un étudiant pour un professeur spécifique
module.exports.getStudentRating = async (req, res) => {
  try {
    // Récupérer l'ID du professeur depuis les paramètres de la requête
    const { professorId, studiantId } = req.params;
    // Vérifier si les identifiants sont au format mongoose
    if (
      !mongoose.Types.ObjectId.isValid(professorId) ||
      !mongoose.Types.ObjectId.isValid(studiantId)
    ) {
      return res.status(400).json({ message: "Identifiants invalides." });
    }
    // Trouver le professeur dans la base de données par son ID
    const professor = await User.findById(professorId);

    // Vérifier si le professeur existe dans la base de données
    if (!professor) {
      return res
        .status(404)
        .json({ message: "Le professeur n'a pas été trouvé" });
    }

    // Trouver la note de l'étudiant pour ce professeur
    const rating = professor.rating.find(
      (rating) => rating.studiantId === studiantId
    );

    // Vérifier si la note a été trouvée
    if (!rating) {
      return res.status(404).json({
        message: "La note de l'étudiant n'a pas été trouvée pour ce professeur",
      });
    }

    // Renvoyer la noteValue si elle a été trouvée
    res.status(200).json({ noteValue: rating.noteValue });
  } catch (error) {
    // Gérer les erreurs
    console.error(
      "Erreur lors de la récupération de la note de l'étudiant :",
      error
    );
    res.status(500).json({
      message:
        "Une erreur est survenue lors de la récupération de la note de l'étudiant",
    });
  }
};

module.exports.commentPost = async (req, res) => {
  // Vérifier si l'ID est valide
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: "ID inconnue " + req.params.id });
  }

  try {
    // Mettre à jour l'utilisateur avec le nouveau commentaire
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $push: {
          comments: {
            commentId: req.body.commentId,
            text: req.body.text,
            anonyme: req.body.anonyme,
          },
        },
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    return res.status(200).json(updatedUser);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Erreur interne du serveur, réessayez plus tard" });
  }
};
