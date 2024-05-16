const PdfPrinter = require("pdfmake");
const axios = require("axios");
const path = require("path");

const fonts = {
  Roboto: {
    normal: path.join(__dirname, "..", "fonts", "Roboto-Regular.ttf"),
    bold: path.join(__dirname, "..", "fonts", "Roboto-Medium.ttf"),
    italics: path.join(__dirname, "..", "fonts", "Roboto-Italic.ttf"),
    bolditalics: path.join(__dirname, "..", "fonts", "Roboto-MediumItalic.ttf"),
  },
};

const printer = new PdfPrinter(fonts);

const fetchProfsData = async () => {
  try {
    const response = await axios.get(`${process.env.API_URL}/profs`);
    return response.data;
  } catch (error) {
    throw new Error(
      "Erreur lors de la récupération des données des professeurs"
    );
  }
};

const generatePdf = (profs) => {
  const docDefinition = {
    content: [
      { text: "Tableau des Professeurs", style: "header" },
      {
        table: {
          headerRows: 1,
          widths: ["*", "*", "*", "*"],
          body: [
            ["Nom", "Cours enseigné", "Nombre de votes", "Moyenne obtenue"],
            ...profs.map((prof) => [
              `${prof.sexe === "M" ? "Mr" : "Mme"} ${prof.name}`,
              prof.cours,
              prof.votesCount,
              prof.averageRating.toFixed(2),
            ]),
          ],
        },
      },
    ],
    styles: {
      header: {
        fontSize: 18,
        bold: true,
        margin: [0, 0, 0, 10],
      },
    },
  };

  const pdfDoc = printer.createPdfKitDocument(docDefinition);
  return pdfDoc;
};

exports.getProfsPdf = async (req, res) => {
  try {
    const profs = await fetchProfsData();
    const pdfDoc = generatePdf(profs);
    res.setHeader("Content-Type", "application/pdf");
    pdfDoc.pipe(res);
    pdfDoc.end();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
