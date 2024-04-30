/* Partie modal */
/*
Récupération des balises du dialog 
des icones/ des bouttons
*/

const boutonModifierProjet = document.getElementById('boutonModifierProjet');
const dialog = document.querySelector('dialog');
const token = localStorage.getItem('token');

/* 
Lorsque l'utilisateur est connecté, le boutton modifié s'affiche et lorsqu'il 
clique la boite dialogue s'affiche 
*/

/*Evenement au clique de la modal*/

boutonModifierProjet.addEventListener('click', () => {
  dialog.showModal();
});

const closeIcon = document.getElementById('closeIcon');
closeIcon.addEventListener('click', () => {
  dialog.close();
});


/* Faire appel au fetch pour récupérer la promesse via l'API */
export async function getWorks() {
  const response = await fetch("http://localhost:5678/api/works");
  return await response.json();
}

/* Affichages des images dans la modale */
async function affichageWorks() {
  const arrayWorks = await getWorks();
 
  const gallery = document.querySelector('.galerieModal');

  arrayWorks.forEach((work) => {
    // Create container for the image and trash icon
    const container = document.createElement("div");
    container.className = "image-container";

    const img = document.createElement("img");         
    img.src = work.imageUrl;
    img.alt = work.title;

    const trashIcon = document.createElement("i");
    trashIcon.className = "fa-solid fa-trash-can trash-icon";

    container.appendChild(trashIcon);      
    container.appendChild(img);
    gallery.appendChild(container);

    /* suppression des images en cliquant sur l'icone trash */

    trashIcon.addEventListener('click', async () => {
      gallery.removeChild(container); 
     
      await deleteWorksData(work.id);
    });
  });
}affichageWorks();

/*Suppression des works de l'API
*/
// Mettre à jour la fonction deleteWorksData pour actualiser l'affichage après la suppression d'une image
async function deleteWorksData(id) {
  try {
    const response = await fetch(`http://localhost:5678/api/works/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to delete image');
    }

    // Actualiser l'affichage des images après la suppression
    await affichageWorks();
  } catch (error) {
    console.error(error);
  }
}

/* Evénement pour exécuter l'ouverture de la modale 
avec la fonction d'écoute 
*/

const dialogModal = document.querySelector(".dialogModal");
const fileEditForm = document.querySelector(".fileEdit");

const sendImgButton = document.getElementById("sendImg");
const containerIcon = document.querySelector(".iconModal");
const iconLeft = document.getElementById('left');

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

/* 
Ajout image via la dialogue modal
*/

/* Ajout image via la dialogue modal*/

const fileInput = document.getElementById('file');
    const galerieModal = document.querySelector('.galerieModal');
    const validButton = document.querySelector('.valid');

    // Charger les images du localStorage au démarrage
    loadImages();

    // Écouter le bouton "Ajouter une photo"
    sendImgButton.addEventListener('click', () => {
        document.querySelector('dialog').showModal();
    });

    // Écouter le bouton "Valider"
    validButton.addEventListener('click', (e) => {
        e.preventDefault();
        const file = fileInput.files[0];
        const textInput = document.getElementById('text').value;
        const categoryInput = document.querySelector('.categorieInput select').value;

        // Vérifier si une image a été sélectionnée
        if (file) {
            const formData = new FormData();
            formData.append('image', file);
            formData.append('text', textInput);
            formData.append('category', categoryInput);

            // Envoyer l'image via POST (simulation pour cet exemple)
            fetch(`http://localhost:5678/api/works/${workId}`, {
                method: 'POST',
                body: formData,
            })
            .then(response => response.json())
            .then(data => {
                // Sauvegarder l'image dans le localStorage
                saveImage(data);
            })
            .catch(error => console.error('Error:', error));
        } else {
            alert('Veuillez sélectionner une image.');
        }
    });

    // Fonction pour générer les catégories dynamiquement
function generateCategories(categories) {
  const categorySelect = document.getElementById('category');
  categories.forEach(category => {
      const option = document.createElement('option');
      option.value = category;
      option.textContent = category;
      categorySelect.appendChild(option);
  });
}

// Appeler une API ou utiliser des catégories prédéfinies
const categories = ['Objets', 'Appartements', 'Hotels & restaurants']; // Exemple de catégories
generateCategories(categories);

const baseApiUrl = 'http://localhost:5678/api/works/'; // Adresse de base de l'API

// Utilisation de la baseApiUrl avec l'identifiant du travail pour construire l'URL complète
const workId = `${baseApiUrl}${yourWorkId}`; // Remplacez `yourWorkId` par l'identifiant spécifique du travai

// Mettre à jour la fonction saveImage
function saveImage(data) {
  let images = JSON.parse(localStorage.getItem('images')) || [];
  images.push(data);
  localStorage.setItem('images', JSON.stringify(images));
  // Ajouter l'image à la galerie modal
  const imgElement = document.createElement('img');
  imgElement.src = data.url; // Assuming 'url' is the property containing the image URL
  galerieModal.appendChild(imgElement);
  // Fermer la boîte de dialogue après avoir ajouté l'image
  document.querySelector('dialog').close();
}

// Mettre à jour la fonction loadImages pour qu'elle affiche toutes les images
function loadImages() {
  const images = JSON.parse(localStorage.getItem('images')) || [];
  galerieModal.innerHTML = ''; // Réinitialiser le contenu
  images.forEach(image => {
      const imgElement = document.createElement('img');
      imgElement.src = image.url; 
      galerieModal.appendChild(imgElement);
  });
}