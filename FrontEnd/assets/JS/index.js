console.log("hey!");

export const test = 'test'

/*variable*/
const gallery = document.querySelector(".gallery");
const filters = document.querySelector(".categories");

//verifier que le json fonctione
export async function getWorks() {
  const response = await fetch("http://localhost:5678/api/works");
  return await response.json();
  
}

/*affichage works => galleries*/
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

/*affichage bouton par catégorie*/
//recupereration des catégorie//

const categoryContainer = document.querySelector(".categories");

async function getCategorys() {
  const response = await fetch("http://localhost:5678/api/categories/");
  return await response.json();
}

/*creation du boutton tous*/

const allBtn = document.createElement("button");
allBtn.textContent = "Tous";
allBtn.id = "all";
filters.appendChild(allBtn); // Localisation categories

//affiche tous les images
allBtn.addEventListener("click", async () => {
  // faire appel a affichage works
  await affichageWorks();
});


/* Affichage des boutons par catégorie */
async function displayCategorysButtons() {
  const categorys = await getCategorys();
  console.log(categorys);
  categorys.forEach(category => {
    const btn = document.createElement("button");
    btn.textContent = category.name.toUpperCase();
    btn.id = category.id;
    filters.appendChild(btn); //localisation categories
  });
}
displayCategorysButtons();

// Filtrer au clic par catégorie

async function filterCategory() {
  const works = await getWorks();
  console.log(works);
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
      console.log(btnId);
    });
  });
}
filterCategory();

