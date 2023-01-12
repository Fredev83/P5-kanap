const cart = []
getCart()
cart.forEach((item) => displayItem(item))


//récupère l'item avec la clé "cart"
function getCart() {
    console.log(getCart);
    let numberOfItems = localStorage.length
    for(let i = 0; i < numberOfItems; i++) { 
        let item = localStorage.getItem(localStorage.key(i))
        let itemObject = JSON.parse(item)
        cart.push(itemObject)
    }  
}



//affichage sur page panier
function displayItem(item) {
    console.log(displayItem)
    let article = makeArticle(item);
    displayArticle(article)
    let div = makeImageDiv(item);
    article.appendChild(div)
    
}

function displayArticle(article) {
    document.querySelector("#cart__items").appendChild(article)
}

function makeArticle(item) {
    let article = document.createElement("article");
    article.classList.add("cart__item")
    article.dataset.id = item.id
    article.dataset.color = item.color
    return article
}

function makeImageDiv(item) {
    let div = document.createElement("div");
    div.classList.add("cart__item__img")
    let image = document.createElement("img");
    image.src = item.imageUrl
    image.alt = item.altTxt
    div.appendChild(image)
    return div
}

/*
//ajouter un produit en plus dans le tableau
function addCart(product) {
    console.log(addCart);
    let cart = getCart();
    let newProduct = cart.find(p => p.id == product.id);
    if (newProduct != undefined) {
        newProduct.quantity++;
    } else {
        product.quantity;
        cart.push(product); 
    }
    saveCart(cart);
}



//retire un produit du panier
function removeFromCart (product) {
    let cart = getCart();
    cart = cart.filter(p => p.id != product.id);
    saveCart(cart);
}


//change la quantité d'un produit
function changeQuantity (product,quantity) {
    let cart = getCart();
    let newProduct = cart.find(p => p.id == product.id);
    if (newProduct != undefined) {
        newProduct.quantity += quantity;
        if(newProduct.quantity <= 0) {
            removeFromCart(newProduct);
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
*/
