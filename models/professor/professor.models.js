const mongoose = require("mongoose");

const schema = mongoose.Schema;

const ProfessorSchema = new schema(
  {
    name: {
      // Ajout de l'objet name
      type: String,
      required: true,
      default: function () {
        return `${this.firstName} ${this.lastName}`;
      },
    },
    firstName: {
      required: true,
      type: String,
    },
    lastName: {
      required: true,
      type: String,
    },
    etat: {
      required: true,
      type: String,
    },
    classe: {
      required: true,
      type: String,
    },
    serie: {
      default: "",
      type: String,
    },
    cours: {
      required: true,
      type: String,
    },
    type: {
      default: "",
      type: String,
    },
    sexe: {
      type: String,
      required: true,
    },
    rating: {
      type: [
        {
          studiantId: String,
          valueNote: Number,
          timestamp: Number,
        },
      ],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Professor", ProfessorSchema);
