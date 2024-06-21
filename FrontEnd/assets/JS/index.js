/* Sélection des éléments HTML et de faire un stockage dans les variables */
const gallery = document.querySelector(".gallery");
const filters = document.querySelector(".categories");

/* 
Vérifier que le json fonctione en utilisant une fonction asynchrone et 
de faire un fetch pour récuperer la promesse
*/
export async function getWorks() {
  const response = await fetch("http://localhost:5678/api/works");
  return await response.json(); 
}

/* Utilisation de la fonction createElement 
pour crée et affiché des images dans la gallerie en fessant appel à GetWorks (fetch)
imbrication du forEach pour filtrer chaque image dans élément
*/
async function affichageWorks() {
 const arrayWorks = await getWorks();
 arrayWorks.forEach((work) => {
    const figure = document.createElement("figure");  
    const img = document.createElement("img");
    const figcaption = document.createElement("figcaption");
    img.src = work.imageUrl;
    figcaption.textContent = work.title;
    
    figure.appendChild(img)
    figure.appendChild(figcaption)
    gallery.appendChild(figure)
 });
 
}
affichageWorks();

/*Sélection de la balise categories pour affichée les bouttons*/
//recupereration des catégorie//

const categoryContainer = document.querySelector(".categories");

async function getCategorys() {
  const response = await fetch("http://localhost:5678/api/categories/");
  return await response.json();
}

/*Crée un bouton spécifique par rapport aux autres pour filtrer les images
avec un id
*/

const allBtn = document.createElement("button");
allBtn.textContent = "Tous";
allBtn.id = "all";
filters.appendChild(allBtn); // Localisation categories

//affiche tous les images en utilisant une fonction addEventlister pour écouter 
allBtn.addEventListener("click", async () => {
  // faire appel a affichage works
  await affichageWorks();
});

/* Création via avec un promesse et afficher les boutons par catégorie */

async function displayCategorysButtons() {
  const categorys = await getCategorys();
  
  categorys.forEach(category => {
    const btn = document.createElement("button");
    btn.textContent = category.name;
    btn.id = category.id;
    filters.appendChild(btn); //localisation categories
  });
}
displayCategorysButtons();

/* filtrage au clic en utilisant un forEach avec une fonction d'écoute */

async function filterCategory() {
  const works = await getWorks();
  
  const buttons = document.querySelectorAll(".categories button"); // Sélectionnez les boutons de catégorie
  buttons.forEach(button => {
    button.addEventListener("click", (e) => {
      const btnId = e.target.id;
      gallery.innerHTML = "";
      if (btnId !== "0") {
        const worksTriCategory = works.filter((work) => {
          return work.categoryId == btnId;
        });
        worksTriCategory.forEach(work => {
          // Créez les éléments à afficher (vous devez implémenter createWorks())
          // createWorks(work);
          const figure = document.createElement("figure");
          const img = document.createElement("img");
          const figcaption = document.createElement("figcaption");
          img.src = work.imageUrl;
          figcaption.textContent = work.title;
          figure.appendChild(img);
          figure.appendChild(figcaption);
          gallery.appendChild(figure);
        });
      }
     
    });
  });
}
filterCategory();