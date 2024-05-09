//Connect to db

const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
mongoose
  .connect(`${process.env.MONGO_URI}`)
  .then(() => console.log(`Connected to Data base`))
  .catch((error) => console.log(`Error to connected to Database : ${error}`));
