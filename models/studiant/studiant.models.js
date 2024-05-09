const mongoose = require("mongoose");

const schema = mongoose.Schema;

const studiantSchema = new schema(
  {
    email: {
      required: true,
      type: String,
      unique: true,
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
    type: {
      default: "",
      type: String,
    },

    password: {
      required: true,
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Studiant", studiantSchema);
