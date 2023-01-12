/**
 * Affichage du produit selectionné sur la page d'accueil ==> page produit
*/


//récupération de l'id de la page pour créer une nouvelle URL pour la requete API correspondant au produit visé
let str = window.location.href;
let url = new URL(str);
let id = url.searchParams.get("id");
let base = "http://localhost:3000/api/products/";
let newUrl = base + id;
 
//requête à l'API pour récupérer les détails du produit
function getProduct(){
  fetch(newUrl)
      .then(function(res) {
          if (res.ok) {
              return res.json();
          }
      })
      .then(function(product){
          insertElements(product);
      })
      .catch(function(err) {
          console.log(err);
        })
}
 

//appel de la fonction getProduct 
getProduct()
 

//insére les détails du produit sur ma page
function insertImage(imageUrl, altText){
  let img = document.querySelector(".item__img");
  img.innerHTML = `<img src=${imageUrl} alt=${altText}/>`
}

function insertOtherProduct(fieldId, textContent){
  let field = document.getElementById(fieldId);
  field.textContent = textContent;
}

function insertProductColors(colors){
  let colorChoice = document.querySelector("#colors");
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

//action bouton ajouter au panier
const button = document.querySelector("#addToCart");
console.log(button);


function quantityValue() {
  return Number(document.getElementById("quantity").value);
}

function colorValue() {
  return document.getElementById("colors").value;
}

function messageAlert(message){
  alert(message)
}

//enrgistre le panier dans le localstorage
function saveCart(color, quantity) {
  let product = {
    id, quantity, color
  }
  localStorage.setItem("cart", JSON.stringify(product));
}

button.addEventListener("click", function() {
  let quantity = quantityValue();
  let color = colorValue();

  if (quantity == 0 && color == ""){
    let message = "veuillez saisir une quantité et une couleur"
    messageAlert(message)
  } else if (quantity == 0) {
    let message = "veuillez saisir une quantité"
    messageAlert(message)
  } else if (color =="") {
    let message = "veuillez saisir une couleur"
    messageAlert(message)
  } else if (quantity < 0 || quantity >100) {
    let message = "veuillez saisir une quantité entre 1 et 100"
    messageAlert(message)
  } else {
   saveCart(color, quantity)
   window.location.href = "cart.html"
  }
})

