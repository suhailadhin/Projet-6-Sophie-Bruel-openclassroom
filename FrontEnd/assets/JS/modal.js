const boutonModifierProjet = document.getElementById('boutonModifierProjet');
const dialog = document.querySelector('dialog');
const token = localStorage.getItem('token');


boutonModifierProjet.addEventListener('click', () => {
  dialog.showModal();
});

const closeIcon = document.getElementById('closeIcon');
closeIcon.addEventListener('click', () => {
  dialog.close();
});


/* Fetch works from the API */
export async function getWorks() {
  const response = await fetch("http://localhost:5678/api/works");
  return await response.json();
}

/* Display works in the modal */
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

    // Delete image by icon
    trashIcon.addEventListener('click', async () => {
      gallery.removeChild(container); // Remove the image container from the gallery

      // Remove the image from the database
      await deleteWork(work.id);
    });
  });
}affichageWorks();

/* Delete a work by its ID */
async function deleteWork(workId) {
  await fetch('http://localhost:5678/api/works/', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    }
  });
}


/* Delete all works */
function deleteWorks() {
  const trashAll = document.querySelectorAll(".fa-trash-can");
  trashAll.forEach((trashIcon) => {
    trashIcon.addEventListener('click', async () => {
      const container = trashIcon.parentElement;
      const img = container.querySelector('img');
      const workId = getWorkIdFromImageUrl(img.src);

      container.remove(); // Remove the image container from the gallery

      // Remove the image from the database
      await deleteWork(workId);
    });
  });
}deleteWorks();

/*ouverture de la modale pour l'edit image*/


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
            fetch('/upload', {
                method: 'POST',
                body: {'Content-Type': 'application/json',
                'Accept': 'application/json',}
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

    function saveImage(data) {
        let images = JSON.parse(localStorage.getItem('images')) || [];
        images.push(data);
        localStorage.setItem('images', JSON.stringify(images));
        loadImages();
        document.querySelector('dialog').close();
    }

    function loadImages() {
        const images = JSON.parse(localStorage.getItem('images')) || [];
        galerieModal.innerHTML = '';
        images.forEach(image => {
            const imgElement = document.createElement('img');
            imgElement.src = image.url; // Supposons que 'url' est l'URL de l'image après l'upload
            galerieModal.appendChild(imgElement);
        });
    }