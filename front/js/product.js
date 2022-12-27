/**
 * Affichage du produit selectionné sur la page d'accueil ==> page produit
 *1-) je récupère l'id de la page pour créer une nouvelle URL pour la requete API correspondant au produit visé
*/

let str = window.location.href;
let url = new URL(str);
let id = url.searchParams.get("id");
let base = "http://localhost:3000/api/products/";
let newUrl = base + id;
 
/**
 * 2-) je fais ma requête à l'API pour récupérer les détails du produit
*/
 
function getProduct(){
  fetch(newUrl)
      .then(function(res) {
          if (res.ok) {
              return res.json();
          }
      })
      .then(function(product){
    // voir étape 4-)	
          insertElements(product);
      })
      .catch(function(err) {
          console.log(err);
        })
}
 
/**
 * 3-) j'appelle la fonction getProduct jj
 *
*/
 
getProduct()
 
/** 
 * 4-) j'écris la fonction qui me permet d'insérer les détails du produit sur ma page.
*/
function insertImage(imageUrl, altText){
  let img = document.querySelector(".item__img");
  img.innerHTML = `<img src=${imageUrl} alt=${altText}/>`
}

function insertOtherProduct(fieldId, textContent){
  let field = document.getElementById(fieldId);
  field.textContent = textContent;
}

function insertProductColors(colors){
  let colorChoice = document.getElementById(colors);
  for(let i=0; i<colors.length; i++){
    colorChoice.innerHTML +=    `<option value="${colors[i]}">${colors[i]}</option>`;
  }
}
function insertElements(product){
  insertImage(product.imageUrl, product.altTxt);
  insertOtherProduct("title",product.name);
  insertOtherProduct("price",product.price);
  insertOtherProduct("description",product.description);
  insertProductColors(product.colors);
}