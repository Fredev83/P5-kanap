

//enrgistre le panier dans le localstorage
function saveCart (cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
   
    console.log(saveCart)
}

//récupère l'item avec la clé "cart"
function getCart() {
    let cart = localStorage.getItem("cart");
    if(cart == null){
        return[];
    }else {
        return JSON.parse(cart);
    }
}

//ajoute le produit dans le tableau
function addCart(product) {
    let cart = getCart();
    let foundProduct = cart.find(p => p.id == product.id);
    if (foundProduct != undefined) {
        foundProduct.quantity++;
    } else {
        product.quantity = 1;
        cart.push(product); 
    }
    saveCart(cart);
}

//retire un produit du panier
function removeFromCart (product) {
    let cart = getCart();
    cart = cart.filter(p => p.id == product.id);
    saveCart(cart);
}

//change la quantité d'un produit
function changeQuantity (product, quantity) {
    let cart = getCart();
    let foundProduct = cart.find(p => p.id == product.id);
    if (foundProduct != undefined) {
        foundProduct.quantity += quantity;
        if(foundProduct.quantity <= 0) {
            removeFromCart(foundProduct)
        }else{
            saveCart(cart); 
        }
    }
}

//total de produits dans le panier
function getNumberProduct() {
    let cart = getCart();
    let number = 0;
    for (let product of cart) {
        number += product.quantity;
    }
    return number;
}

//total prix
function getTotalPrice() {
    let cart = getCart();
    let total = 0;
    for (let product of cart) {
        total += product.quantity * product.price;
    }
    return total;
}
