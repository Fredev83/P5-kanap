            /******************GESTION DES ARTICLES DU PANIER*********************/

//appeler les fonction uniquement si la page panier est active sinon prise en compte lors de l'import de la fonction addToCart
addEventListener('DOMContentLoaded', (event) => {
    let str = window.location.href;
    if (str.endsWith('cart.html')) {
        displayCart();
        getNumberOfProducts();
        getTotalPrice();
        addEventsListeners();
    }
})
 /*   
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
}*/

//vérifier si le même produit existe déjà dans le panier
function isProductInCart(cart, product){
    console.log(isProductInCart)
    return cart.some((p) => p.id === product.id && p.color === product.color);
}


    
//supprimer le produit du panier
function removeProductFromCart(product) {
    console.log(removeProductFromCart)
    let cart = getCart();
    cart = cart.filter(p=> p != product);
    saveCart(cart);
}

//enregistrer le panier sur localStorage
function saveCart(cart) {
    console.log(saveCart)
    localStorage.setItem("cart", JSON.stringify(cart));
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

//Afficher un message tant que le panier est vide 
function displayEmptyCart() {
    console.log(displayEmptyCart)
    let title = document.querySelector("h1");
    title.innerText = "Votre panier est vide...";
    displayForm();
}

//afficher message panier vide ou les produits du panier sélectionnés et appeler les listeners 
function displayCart() {
    console.log(displayCart)
    let cart = getCart();
    if (cart.length == 0){
        displayEmptyCart();
    } else {
        addProductElementsToCartSection(cart).then(function() {
            buttonChangeItemQuantityAddEventListeners();
            buttonDeleteItemOnCartPageAddEventListeners();
        })
    }
}

//prendre en compte l'id du produit que l'on veut récupérer et retourner une promesse de la requête pour le produit
function getProduct(id){
    console.log(getProduct)
    return fetch("http://localhost:3000/api/products/" + id)
        .then(function(res) {
            if (res.ok) {
                return res.json();
            }
        })
        .catch(error => {
            console.log(error);
        });
}

//Récupèrer les informations de chaque produit dans le panier et les afficher
function addProductElementsToCartSection(products){
    let cartProductPromises =[];
    for (let i of products){
        cartProductPromises.push(getProduct(i.id)
        .then(function(value) {
            return {
                id: i.id,
                color: i.color,
                imageUrl: value.imageUrl,
                altTxt: value.altTxt,
                name: value.name,
                price: value.price,
                quantity: i.quantity
            }
        })
        .catch(function(err) {
            console.log(err);
        }))
    }
    // Récupèrer les résultats des promesses
    return Promise.all(cartProductPromises)
    .then((values) => {
        let cartSection = document.getElementById("cart__items");
        let cartSectionHTML = "";
        //j'insère les informations
        for (let value of values) {
            cartSectionHTML += `
            <article class="cart__item" data-id="${value.id}" data-color="${value.color}">
                <div class="cart__item__img">
                    <img src=${value.imageUrl} alt=${value.altTxt}>
                </div>
                <div class="cart__item__content">
                    <div class="cart__item__content__description">
                        <h2>${value.name}</h2>
                        <p>${value.color}</p>
                        <p>${value.price}€</p>
                    </div>
                    <div class="cart__item__content__settings">
                        <div class="cart__item__content__settings__quantity">
                            <p>Qté :</p>
                            <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value=${value.quantity}>
                        </div>
                        <div class="cart__item__content__settings__delete">
                            <p class="deleteItem">Supprimer</p>
                        </div>
                    </div>
                </div>
            </article>`;
        }
        //Afficher les infos
        cartSection.innerHTML = cartSectionHTML;
    })
}

//calculer le nombre d'articles dans le panier et afficher le total
function getNumberOfProducts() {
    console.log(getNumberOfProducts)
    let cart = getCart();
    let number = 0;
    for (let product in cart) {
        number += product.quantity;
    }
    let totalProducts = document.getElementById("totalQuantity");
    totalProducts.innerText = number;
}


//calculer le prix total du panier et l'afficher
function getTotalPrice() {
    console.log(getTotalPrice)
    let cart = getCart();
    let cartProductPromises = [];
    for (let product of cart) {
        cartProductPromises.push(getProduct(product.id)
        .then(function(value){
            return product.quantity * value.price;
        }))
    }
    Promise.all(cartProductPromises)
    .then(function(results){
        let total = results.reduce((a,b) => a + b, 0);
        let totalPrice = document.getElementById("totalPrice");
        totalPrice.innerText = total;
    })
}


//Champs de sélection pour modifier quantité du produit
function buttonChangeItemQuantityAddEventListeners(){
    console.log(buttonChangeItemQuantityAddEventListeners)
    let allButtonQuantity = Array.from(document.getElementsByClassName("itemQuantity")); //Pour éviter que le "HTML collection" change pendant que l'on est entrain de l'utiliser
    for (let btn of allButtonQuantity) {
        let productToChange = btn.closest(".cart__item");
        let productToChangeId = productToChange.dataset.id;
        let productToChangeColor = productToChange.dataset.color;
        btn.addEventListener('change', function(){
            let cart = getCart();
            let newQuantity = Number(btn.value);
            let foundProduct = cart.find(p => p.id == productToChangeId && p.color == productToChangeColor);
            if (newQuantity <= 0 || newQuantity > 100){                   
                btn.insertAdjacentHTML('afterend', `<div id = "alert" style= "text-align: center; font-weight: bold; color: #af3327">&nbsp;La quantité doit être comprise entre 1 et 100</div>`);
                deleteAlert();
            } else {
                foundProduct.quantity = newQuantity;
                saveCart(cart);
                getNumberOfProducts();
                getTotalPrice();
            }
        })
    }
}

//Faire disparaitre le message d'alerte 
function deleteAlert(){
    console.log(deleteAlert) 
    let alert = document.getElementById("alert");
    setTimeout(function(){
        alert.remove();
    }, 1500);
}

//Bouton supprimer l'article
function buttonDeleteItemOnCartPageAddEventListeners(){
    console.log(buttonDeleteItemOnCartPageAddEventListeners) 
    let allButtonDelete = Array.from(document.getElementsByClassName("deleteItem"));
    for (let btn of allButtonDelete) {
            let productToChange = btn.closest(".cart__item");
            let productToChangeId = productToChange.dataset.id;
            let productToChangeColor = productToChange.dataset.color;
            btn.addEventListener('click', function(){
                let cart = getCart();
                let foundProduct = cart.find(p => p.id == productToChangeId && p.color == productToChangeColor);
                cart = cart.filter(p=> p != foundProduct);
                saveCart(cart);
                getNumberOfProducts();
                getTotalPrice();
                productToChange.remove();
                displayCart();
        })
    }
}

                         /******************GESTION DE LA COMMANDE*********************/



// Ne pas afficher le formulaire de commande tant que le panier est vide
function displayForm(){
    console.log(displayForm) 
    let orderSection = document.querySelector(".cart__order");
    let cart = getCart();
    if (cart.length == 0){
        orderSection.style.visibility = "hidden";
    } else {
        orderSection.style.visibility = "visible";
    }
}

// Création du regex suivant le type d'input et retourner le resultat de test
function validateInput(inputText, inputType = "") {
    console.log(validateInput)
    let regex;
    switch(inputType) {
        case "address":
            regex = /(([\wÀ-ÖÙ-íñ-öù-ýîÎïÏ]\'[\wÀ-ÖÙ-íñ-öù-ýîÎïÏ]*)|(-[\wÀ-ÖÙ-íñ-öù-ýîÎïÏ]{2,}|[\wÀ-ÖÙ-íñ-öù-ýîÎïÏ]{2,}-)|([\wÀ-ÖÙ-íñ-öù-ýîÎïÏ]*\s?))*/;
            break;
        case "email":
            regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/;
            break;
        case "firstName":
        case "lastName":
        case "city":
        default:
            regex = new RegExp('^(([A-Za-zÀ-ÖÙ-íñ-öù-ýîÎïÏ]\'[A-Za-zÀ-ÖÙ-íñ-öù-ýîÎïÏ]*)|(-[A-Za-zÀ-ÖÙ-íñ-öù-ýîÎïÏ]{2,}|[A-Za-zÀ-ÖÙ-íñ-öù-ýîÎïÏ]{2,}-)|([A-Za-zÀ-ÖÙ-íñ-öù-ýîÎïÏ]*\s?))*$');
    }
    return regex.test(inputText);
}

// Validation pour les champs du formulaire et renvoi le message d'erreur si nécessaire
function getInputValidationMessage(inputText, inputType) {
    console.log(getInputValidationMessage)
    let isValid = validateInput(inputText, inputType);
    if (isValid) {
        return "";
    } else {
        return "Champ invalide";
    }
}

// Récupèrer mon formulaire dans une variable
let form = document.querySelector(".cart__order__form");

// Regrouper les listeners du formulaire dans une fonction
function addEventsListeners(){
    // Ecouter la modification du formulaire Prénom
    form.firstName.addEventListener('change', function() {
    let errorMessage = document.getElementById('firstNameErrorMsg');
    errorMessage.innerText = getInputValidationMessage(this.value, "firstName");
    })

    // Ecouter la modification du formulaire Nom
    form.lastName.addEventListener('change', function() {
        let errorMessage = document.getElementById('lastNameErrorMsg');
        errorMessage.innerText = getInputValidationMessage(this.value, "lastName");
    })

    // Ecouter la modification du formulaire Adresse
    form.address.addEventListener('change', function() {
        let errorMessage = document.getElementById('addressErrorMsg');
        errorMessage.innerText = getInputValidationMessage(this.value, "address");
    })


    // Ecouter la modification du formulaire Ville
    form.city.addEventListener('change', function() {
        let errorMessage = document.getElementById('cityErrorMsg');
        errorMessage.innerText = getInputValidationMessage(this.value, "city");
    })

    // Ecouter la modification du formulaire Email
    form.email.addEventListener('change', function() {
        let errorMessage = document.getElementById('emailErrorMsg');
        errorMessage.innerText = getInputValidationMessage(this.value, "email");
    })

    // Ecouter la soumission du formulaire et enregistrer les données du formulaire dans le local storage
    form.order.addEventListener('click', function(e) {
        e.preventDefault();
    if (validateInput(form.firstName.value) && validateInput(form.lastName.value) && validateInput(form.address.value, "address") && validateInput(form.city.value) && validateInput(form.email.value, "email")) {
        let contact = new Contacts(form.firstName.value, form.lastName.value, form.address.value, form.city.value, form.email.value);
        localStorage.setItem("contact", JSON.stringify(contact));
        submitOrder();
    } else {
        let errorMessageField = document.querySelector(".cart__order__form__submit")
        errorMessageField.insertAdjacentHTML('afterend', `<div id = "alert" style= "text-align: center; font-weight: bold; color: #af3327"><br>Merci de remplir tous les champs du formulaire</div>`);
        deleteAlert();
    }
    })
}

// creation de l'objet contact
class Contacts {
    constructor(firstName, lastName, address, city, email){
        this.firstName = firstName;
        this.lastName = lastName;
        this.address = address; 
        this.city = city;
        this.email = email;
    }
}

// Récupèrer les id de tous les produits du tableau
function getCartProductsIds(){
    let cart = getCart();
    let products = [];
    for (let i of cart){
        products.push(i.id);
    }
    return products;
}

// Récupèrer les données du formulaire sur le local storage
function getFormData() {
    let form = localStorage.getItem("contact");
        return JSON.parse(form);
} 

// Envoyer ma requête à l'API et recupèrer le numéro de commande pour rediriger vers la page confirmation
function submitOrder(){
    let contact = getFormData();
    let products = getCartProductsIds();
    fetch("http://localhost:3000/api/products/order", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'  
        },
        body: JSON.stringify({contact, products})
    })
    .then(function(res) {
        if (res.ok) {
            return res.json();
        } 
      })
      .then(function(value){
        document.location.href ="./confirmation.html?order=" + value.orderId;
        localStorage.clear()
    })
    .catch(function(err) {
        console.log(err);
      });
}



