let str = window.location.href;
let url = new URL(str);
let id = url.searchParams.get("order");
let orderId = document.getElementById('orderId');
orderId.innerText = id;