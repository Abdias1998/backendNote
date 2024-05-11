function toggleNavbar() {
  var navbar = document.getElementById("navbar");
  var navLinks = document.querySelector(".nav-links");

  if (navLinks.style.maxHeight) {
    navLinks.style.maxHeight = null;
  } else {
    navLinks.style.maxHeight = navLinks.scrollHeight + "px";
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const form1 = document.getElementById("form1");
  const form2 = document.getElementById("form2");
  const form3 = document.getElementById("form3");

  form1.addEventListener("submit", function (event) {
    event.preventDefault();
    const etat = document.getElementById("etat").value;
    const firstName = document.getElementById("firstName").value;
    const lastName = document.getElementById("lastName").value;
    // Récupérez les autres valeurs des champs de formulaire
    console.log(
      "Formulaire 1 soumis avec les valeurs :",
      etat,
      firstName,
      lastName
    );
    // Effectuez les actions nécessaires avec les valeurs du formulaire
  });

  form2.addEventListener("submit", function (event) {
    event.preventDefault();
    const email = document.getElementById("email").value;
    const etat = document.getElementById("etat").value;
    const firstName = document.getElementById("firstName").value;
    const lastName = document.getElementById("lastName").value;
    // Récupérez les autres valeurs des champs de formulaire
    console.log(
      "Formulaire 2 soumis avec les valeurs :",
      email,
      etat,
      firstName,
      lastName
    );
    // Effectuez les actions nécessaires avec les valeurs du formulaire
  });

  form3.addEventListener("submit", function (event) {
    event.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    console.log("Formulaire 3 soumis avec les valeurs :", email, password);
    // Effectuez les actions nécessaires avec les valeurs du formulaire
  });
});
