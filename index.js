require("dotenv").config({ path: "./config/.env" });
const path = require("path");
const bodyParser = require("body-parser");
// const cookieParser = require("cookie-parser");
const express = require("express");
const StudiantRoutes = require("./routes/studiant/studiant.routes");
const ProfessorRoutes = require("./routes/professor/professor.routes");
// const csrf = require("csurf");
require("./config/db");
const cors = require("cors");

const app = express();

app.use(cors({ credentials: true, origin: process.env.CLIENT_URL }));
app.use(bodyParser.json()); // Transformer les body en json
app.use(bodyParser.urlencoded({ extended: true }));
// Middleware;
// app.use(csrf());
// app.use(
//   session({
//     secret: process.env.TOKEN_SECRETE,
//     resave: false,
//     saveUninitialized: false,
//     cookie: {
//       maxAge: 60 * 60 * 1000 * 168, // Durée de vie du cookie de session en millisecondes (ici, 30 minutes)
//     },
//   })
// );
// app.use(helmet());
// app.use(express.json());
// app.use(firewall.init());

// /*Configuration de firewall pour bloquer les requètes provénant d'Ip spécifiques */
// firewall.addRule("block", "ip", "deny", "1.2;3.4");

// Starting the server
// if (require.index === module) {
//   app.listen(process.env.PORT, () =>
//     console.log(`Example app listening on port ${process.env.PORT}!`)
//   );
// }
// require("./utils/test");
app.use(express.static(path.join(__dirname, "./client/build")));

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "./client/build", "index.html"));
});

// routes
app.use("/api/user", StudiantRoutes);
app.use("/api/prof", ProfessorRoutes);
const crypto = require("crypto");
const dateElements = crypto.randomBytes(2).toString("hex");

console.log(dateElements);
app.use(express.static(path.join(__dirname, "./client")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build/index.html"));
});

app.listen(process.env.PORT || 7500, () => console.log(`Back is running`));
