const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  // Droits possibles pour une application de vote pour les professeurs
  rights: {
    addProfessor: {
      type: Boolean,
      default: false,
    },
    deleteProfessor: {
      type: Boolean,
      default: false,
    },
    editProfessor: {
      type: Boolean,
      default: false,
    },
    viewStatistics: {
      type: Boolean,
      default: false,
    },
    manageUsers: {
      type: Boolean,
      default: false,
    },
    // Ajoutez d'autres droits selon les besoins de votre application
  },
});

module.exports = mongoose.model("Admin", adminSchema);
