/* Partie modal */

/*importation de la fontion works et categorys*/

export async function getWorks() {
  const response = await fetch("http://localhost:5678/api/works");
  return await response.json(); 
}

async function getCategorys() {
  const response = await fetch("http://localhost:5678/api/categories/");
  return await response.json();
}

/*
Récupération des balises du dialog 
des icones/ des bouttons
*/

const boutonModifierProjet = document.getElementById('boutonModifierProjet');
const dialog = document.querySelector('dialog');
const token = localStorage.getItem('token');

/* 
Lorsque l'utilisateur est connecté, il peut modifier les images en cliquant sur modifier
, une boite de dialogue s'affiche. Il peut supprimer et ajouter des images grace à
la modale.
*/

/*Evenement au clique de la modal*/

boutonModifierProjet.addEventListener('click', () => {
  dialog.showModal();
});

const closeIcon = document.getElementById('closeIcon');
closeIcon.addEventListener('click', () => {
  dialog.close();
});


/* Affichages des images dans la modale */
async function affichageWorks() {
  const arrayWorks = await getWorks();
  const gallery = document.querySelector('.galerieModal');

  arrayWorks.forEach(async (work) => {
    /*Création des éléments pour chaque image */
    const container = document.createElement("div");
    container.className = "image-container";

    const figure = document.createElement("figure");  
    const img = document.createElement("img");
    const figcaption = document.createElement("figcaption");

    img.src = work.imageUrl;
    figcaption.textContent = work.title;

    /* Ajout des éléments à la galerie */
    figure.appendChild(img);
    container.appendChild(figure);
    gallery.appendChild(container);

    /* Création de l'icône de la corbeille et ajout à la figure */
    const trashIcon = document.createElement("i");
    trashIcon.className = "fa-solid fa-trash-can trash-icon";
    figure.appendChild(trashIcon);

    /* Ajout d'un gestionnaire d'événements pour la suppression de l'image */
    trashIcon.addEventListener('click', async () => {
      try {
        await deleteWorksData(work.id); 
        container.remove(); 
      } catch (error) {
        console.error('Erreur lors de la suppression de l\'image :', error);
        alert('Une erreur est survenue lors de la suppression de l\'image');
      }
    });
  });
}

async function deleteWorksData(id) {
  try {
    const url = `http://localhost:5678/api/works/${id}`;
    const options = {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    };

    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error('Failed to delete image');
    }
  } catch (error) {
    throw new Error('Failed to delete image');
  }
}

affichageWorks();

/* Récuperation des balises dans la boite de dialogue du modale 
*/

const dialogModal = document.querySelector(".dialogModal");
const fileEditForm = document.querySelector(".fileEdit");
const sendImgButton = document.getElementById("sendImg");
const containerIcon = document.querySelector(".iconModal");
const iconLeft = document.getElementById('left');

/* Evenement au clic lorsqu'on ouvre la modale*/

containerIcon.addEventListener("click", function() {
  dialogModal.style.display = "";
  fileEditForm.style.display = "none";
  iconLeft.style.display = "none";
});


sendImgButton.addEventListener("click", function() {
  dialogModal.style.display = "none";
  fileEditForm.style.display = "block";
  iconLeft.style.display = "block";
});

closeIcon.addEventListener("click", function() {
  dialogModal.style.display = "block";
  fileEditForm.style.display = "none";
});

/* Prévisualisez l'image sur la modale*/

const previewImg = document.querySelector(".containerFile img");
const inputFile = document.querySelector(".containerFile input");
const labelFile = document.querySelector(".containerFile label");
const icon = document.querySelector(".containerFile .fa-image");
const pFile = document.querySelector(".containerFile p");

inputFile.addEventListener("change", function() {
  const file = inputFile.files[0];
  
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      previewImg.src = e.target.result;
      previewImg.style.display = "block"; 
      labelFile.style.display = "none";
      icon.style.display = "none"; 
      pFile.style.display = "none";
    };
    reader.readAsDataURL(file);
  }
});

/* Creation de la liste categorie sur l'input select name*/

async function displayCategoryModal() {

  const select = document.querySelector("dialog select");
  const categorys = await getCategorys();

  categorys.forEach(category => {
      const option = document.createElement("option");
      option.value = category.id;
      option.textContent = category.name;
      select.appendChild(option);
  });
} 
displayCategoryModal();

/* Faire un POST pour ajouter une image depuis la modal */

const form = document.querySelector("dialog form");
const title = document.getElementById("text");
const category = document.getElementById("category");
const valid = document.querySelector(".valid");
const image = document.getElementById('fileInput');

// Ajouter un projet

valid.addEventListener('click', addWork);

async function addWork(event) {
  event.preventDefault();

  if (title.value.trim() === "" || category.value === "" || !image.files.length) {
    alert("Merci de remplir tous les champs");
    return;
  }

  try {
    const formData = new FormData();
    formData.append("title", title.value);
    formData.append("category", category.value);
    formData.append("image", image.files[0]);

    /* remplace le Fetch */

    const url = "http://localhost:5678/api/works/";
    const response = await fetch(url, {
      method: "POST",
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: formData,
    });

      /* Réinitialiser les champs après l'ajout réussi */
      title.value = "";
      category.value = "";
      image.value = "";


     if (response.status === 201) {
      alert("Projet ajouté avec succès :)");

    } else if (response.status === 400) {
      alert("Merci de remplir tous les champs");
    } else if (response.status === 500) {
      alert("Erreur serveur");
    } else if (response.status === 401) {
      alert("Vous n'êtes pas autorisé à ajouter un projet");
      window.location.href = "login.html";
    } else {
      /* Gérer d'autres codes d'erreur ici si nécessaire */
      alert(`Erreur inattendue: ${response.status}`);
    }

  } catch (error) {
    console.error('Erreur lors de l\'ajout du projet :', error);
    alert('Une erreur est survenue lors de l\'ajout du projet');
  }
}