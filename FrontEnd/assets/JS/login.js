/*Récuperation des éléments du HTML pour déclarer la variable*/

const emailInput = document.querySelector("#email");
const passwordInput = document.querySelector("#password");
const form = document.querySelector("form");
const errorMessage = document.querySelector(".login p");

/* Création de la fonction login pour que l'utilisateur puisse se connecter via la methode
POST. 
La fonction Token permet de communiqué avec l'API 
*/
async function login(email, password) {
  try {
    const response = await fetch("http://localhost:5678/api/users/login", {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: email, password: password })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Échec de la connexion. Veuillez vérifier vos identifiants.");
    }

    const token = data.token;

    // Stocker le token dans le localStorage
    localStorage.setItem('token', token);

    return token; // Retourne le token
  } catch (error) {
    throw new Error("Échec de la connexion. Veuillez vérifier vos identifiants.");
  }
}

/* Fonction pour gérer la soumission du formulaire */
form.addEventListener("submit", async (event) => {
  event.preventDefault(); // Empêche la soumission par défaut du formulaire

  const email = emailInput.value;
  const password = passwordInput.value;

  try {
    /* Appeler la fonction login avec les identifiants de l'utilisateur */
    const token = await login(email, password);

    /* Connexion réussie */
    handleLoginSuccess(token);
  } catch (error) {
    /* Les erreurs de connexion */
    handleLoginError(error);
  }
});

/* Fonction pour gérer la connexion réussie */
function handleLoginSuccess(token) {
  console.log("Connexion réussie. Token :", token);
  errorMessage.textContent = ""; // Effacer les éventuels messages d'erreur précédents
  window.location.href = "index.html"; // Rediriger l'utilisateur vers la page d'accueil
}

/* Changement lorsque je me connecte */
function toggleLogin() {
  const button = document.getElementById("loginButton");
  const token = localStorage.getItem('token');

  if (button) {
    if (token !== null) {
      button.innerHTML = "logout";
      button.onclick = handleLogout;
    } else {
      button.innerHTML = "login";
    }
  }
}

/* Fonction pour gérer les erreurs de connexion et utilisation du message d'erreur */
function handleLoginError(error) {
  console.error(error.message);
  errorMessage.textContent = error.message; // Afficher le message d'erreur dans l'élément errorMessage
}

/* Fonction pour gérer la déconnexion avec une fonction HandLogout */
function handleLogout() {
  console.log("Déconnexion réussie.");

  localStorage.removeItem('token');

  /* Rediriger l'utilisateur vers la page d'accueil */
  window.location.href = "index.html";
  toggleLogin();
}
/* Appeler toggleLogin() pour définir l'état initial du bouton */
toggleLogin();

// Fonction pour gérer l'affichage du bouton "Modifier" en fonction de l'état de connexion
function gererBoutonModifierProjet() {
  // Sélectionner le bouton "Modifier"
  const boutonModifierProjet = document.getElementById("boutonModifierProjet");
  
  // Vérifier si l'utilisateur est connecté
  const token = localStorage.getItem('token'); // Récupérer le token depuis le localStorage ou toute autre méthode de stockage
  
  if (boutonModifierProjet) {
    if (token) {
      boutonModifierProjet.style.display = "block";
    } else {
      boutonModifierProjet.style.display = "none"; 
    }
  }
}
gererBoutonModifierProjet();

function bannerEdit() {
  const bannerElement = document.querySelector(".banner-connexion");

  const token = localStorage.getItem('token');

  if (bannerElement) {
    if (token) {
      bannerElement.style.display = "block";
    } else {
      bannerElement.style.display = "none";
    }
  }
}
bannerEdit();

/* Fonction pour cacher les boutons lorsque l'utilisateur se connect */
function hideButtons() {
  const btns = document.querySelectorAll(".categories");

  const token = localStorage.getItem('token');
  
  if (!token) { // Vérifier si l'utilisateur est déconnecté
    btns.forEach(btn => {
      btn.style.display = "flex"; // Afficher les boutons
    });
    return; // Sortir de la fonction si l'utilisateur est déconnecté
  }

  btns.forEach(btn => {
    if (btn.id !== "all") {
      btn.style.display = "none";
    }
  });
}

/* Si l'utilisateur se connecte le modal dialog s'affiche pour qu'il puisse filtrer
les images {supprimer et ajouter les img} */

function myModal () {
  const dialog = document.querySelector('dialog');

  const token = localStorage.getItem('token');

  if(dialog) {
    if(token) {
      dialog.style.display = "";
    } else {
      dialog.style.display = "none";
    }
  }
}
myModal();

hideButtons();