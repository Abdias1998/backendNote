const mongoose = require("mongoose");

const schema = mongoose.Schema;

const ProfessorSchema = new schema(
  {
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

          value: String,
          timestamp: Number,
        },
      ],
      required: true,

      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Professor", ProfessorSchema);
