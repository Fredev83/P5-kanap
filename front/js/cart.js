function getAllProduct(){
   let jsonListProducts = fetch("http://localhost:3000/api/products")
    .then( data => data.json())
}