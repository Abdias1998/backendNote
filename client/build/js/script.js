document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.getElementById("loginForm");
  const errorMessage = document.getElementById("errorMessage");

  loginForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const email = loginForm.email.value;
    const password = loginForm.password.value;

    try {
      const response = await fetch("http://localhost:7200/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erreur lors de la connexion");
      }

      errorMessage.textContent = "";
      alert("Connexion réussie !");
    } catch (error) {
      errorMessage.textContent = error.message;
    }
  });
});
