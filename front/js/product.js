/**
 * Affichage du produit selectionné sur la page d'accueil ==> page produit
 *1-) je récupère l'id de la page pour créer une nouvelle URL pour la requete API correspondant au produit visé
*/

 let str = window.location.href;
 let url = new URL(str);
 let id = url.searchParams.get("id");
 let base = "http://localhost:3000/api/products";
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
  let img = documentQuerySelector("item__img");
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


  /*document.querySelector(".item").innerHTML +=
    `<article>
        <div class="item__img">
          <img src="${product.imageUrl}" alt="${product.altTxt}">
        </div>
        <div class="item__content">

          <div class="item__content__titlePrice">
            <h1 id="title">${product.name}</h1>
            <p>Prix : <span id="price">${product.price}/span>€</p>
          </div>

          <div class="item__content__description">
            <p class="item__content__description__title">Description :</p>
            <p id="description">${product.description}</p>
          </div>

          <div class="item__content__settings">
            <div class="item__content__settings__color">
              <label for="color-select">Choisir une couleur :</label>
              <select name="color-select" id="colors">
                  <option value="insertProductColorChoices(colors)">--SVP, choisissez une couleur --</option>
                  <option value="${colors[i]}">${colors[i]}</option>
              </select>
            </div>

            <div class="item__content__settings__quantity">
              <label for="itemQuantity">Nombre d'article(s) (1-100) :</label>
              <input type="number" name="itemQuantity" min="1" max="100" value="0" id="quantity">
            </div>
          </div>

          <div class="item__content__addButton">
            <button id="addToCart">Ajouter au panier</button>
          </div>

        </div>
   </article>`;*/
 }
 /**
  * a-) j'insère l'image et le Al avec les valeurs product.imageUrl, product.altTxt
    b-) j'insère le titre avec la valeur product.name
    c-) j'insère le prix avec la valeur product.price
    d-) j'insère la description avec la valeur product.description
    e-) j'insère les couleurs vec la valeur product.colors : exemple insertProductColorChoices(product.colors); // voire fonction insertProductColorChoices sur létape 5-)
*/

 
 
/**
  * 5-) fonction qui permet de boucler sur les couleurs du produit et de les inésrer sur la page.
*/


