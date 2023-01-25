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
getProduct();
 

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

//retourne la quantité et les couleurs 
function quantityValue() {
  return Number(document.getElementById("quantity").value);
}

function colorValue() {
  return document.getElementById("colors").value;
}

function messageAlert(message){
  alert(message)
}

//enrgistre le panier dans le localstorage au clic sur le bouton "ajouter au panier"
let button = document.querySelector("#addToCart");
let alertAddButton = document.querySelector('.item__content__addButton')

button.addEventListener("click", function() {
  let quantity = quantityValue();
  let color = colorValue();
  let product = {id, quantity, color}

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
   addToCart(id, quantity, color)
   
  }
})

//ajouter les produits au panier
function addToCart(id, quantity, color){
  console.log(addToCart)
  let cart = getCart();
  let product = {id, quantity, color};
  if (isProductInCart(cart, product)){
      changeProductQuantity(product, quantity);
  } else {
      cart.push(product);
      let message = "Produit ajouté au panier";
      messageAlert(message);
      saveCart(cart);
  }
}

//permet de changer la quantité depuis la page produit
function changeProductQuantity(product, quantity) {
  console.log(changeProductQuantity)
  let cart = getCart();
  let foundProduct = cart.find(p => p.id == product.id && p.color == product.color);
  if (foundProduct != undefined) {
      foundProduct.quantity += quantity;
      if (foundProduct.quantity <= 0 || foundProduct.quantity >= 101){
          removeProductFromCart(foundProduct);
          let messageAlert = "La quantité totale de produits doit être comprise entre 1 et 100";
          createAlertMessage(messageAlert);
      }else {
          let message = "Produit ajouté au panier";
      messageAlert(message);
      saveCart(cart);
      }   
  } 
}

//Récupérer les produits du panier
function getCart() {
  console.log(getCart)
  let cart = localStorage.getItem("cart");
  if (cart == null) {
      return [];
  } else {
      return JSON.parse(cart);
  }
}

//vérifier si le même produit existe déjà dans le panier
function isProductInCart(cart, product){
  console.log(isProductInCart)
  return cart.some((p) => p.id === product.id && p.color === product.color);
}

//enregistrer le panier sur localStorage
function saveCart(cart) {
    console.log(saveCart)
    localStorage.setItem("cart", JSON.stringify(cart));
}


 

