const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../../models/admin/admin.models");

// Inscription d'un utilisateur
module.exports.signup = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Cet utilisateur existe déjà" });
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Créer un nouvel utilisateur
    const newUser = await User.create({
      email,
      password: hashedPassword,
      // Autres champs utilisateur
    });
    await newUser.save();
    res.status(201).json({ message: "Inscription réussie" });
  } catch (error) {
    console.error("Erreur lors de l'inscription :", error);
    res.status(500).json({ message: "Erreur lors de l'inscription" });
  }
};

// Connexion d'un utilisateur
module.exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Vérifier si l'utilisateur existe
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    // Vérifier si le mot de passe est correct
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Mot de passe incorrect" });
    }

    // Générer un token JWT
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    /* 5 - Envoyer la réponse dans le cookie */

    res.cookie(String("noteHook"), token, {
      path: `/`, // Path cookie
      expires: new Date(
        Date.now() + 24 * 60 * 60 * 1000 * 7
      ) /**Durée de vie du cookie qui est de 7 jours */,
      httpOnly: true, //Only server
      sameSite: `lax`, //cross site, empêcher les réquêtes d'autres domaines
      secure: true, // https
    });

    /**Réponse finale quand il est authentifié */
    return res.status(200).json({ message: `Connection réussie` });
  } catch (error) {
    console.error("Erreur lors de la connexion :", error);
    res.status(500).json({ message: "Erreur lors de la connexion" });
  }
};
