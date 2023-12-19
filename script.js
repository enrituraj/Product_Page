// loder
document.addEventListener('DOMContentLoaded', function () {
    const loader = document.querySelector('.loader');
    setTimeout(function () {
        loader.classList.remove('active');
    }, 1000);
});

// common function
function showMsg(msg,msg_type){
    let body = document.querySelector('body');
    let alert = `
        <div class="alert alert-${msg_type} active">
            ${msg}
        </div>
    `;
    body.innerHTML += alert;
    setTimeout(() => {
        document.querySelector('.alert').remove();
    }, 3000);
}

function removeFromCart(id) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const productIndex = cart.findIndex(product => product.id === id);
    if (productIndex !== -1) {
        cart.splice(productIndex, 1);
        localStorage.setItem('cart', JSON.stringify(cart));
        location.reload()
    } else {
        console.log(`Product with ID ${id} not found in the cart.`);
    }
}

async function IncreaseQuantity(id){
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingProduct = cart.find(product => product.id === id);

    if (existingProduct) {
        existingProduct.quantity++;
        document.querySelector(`#input${id}`).value=existingProduct.quantity;
        let price = await getPrice(existingProduct.id);
        console.log(price);
        cart_details( existingProduct.id,price,existingProduct.quantity);
    }

    localStorage.setItem('cart', JSON.stringify(cart));
}

function DecreaseQuantity(id){
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingProduct = cart.find(product => product.id === id);

    if (existingProduct) {
        if(existingProduct.quantity > 1){
            existingProduct.quantity--;
            document.querySelector(`#input${id}`).value=existingProduct.quantity;
            let price = parseInt(getPrice(existingProduct.id));
            cart_details( existingProduct.id,price,existingProduct.quantity);
        }else{
            showMsg('Minimun cart item to be 1','danger')
        }
    }
    localStorage.setItem('cart', JSON.stringify(cart));
}

function getPrice(id){
    fetch(`https://fakestoreapi.com/products/${id}`)
        .then(res=>res.json())
        .then(data =>  {
            const price = data.price;
            const integerPrice = parseInt(price, 10);
            return integerPrice;
        })
}


// for index page
let product__row = document.getElementById("products__row");

function Load__Product(data){
    console.log(data);
    data.forEach(product => {
        let product__card = `
            <div class="product__card">
                <img src="${product.image}" alt="">
                <h2 class="product__name">${product.title}</h2>
                <h3 class="product__price"><i class='bx bx-rupee'></i> ${product.price}</h3>
                <div class="product__btn">
                    <button class="btn btn__add__to__cart" onclick="add_to_cart(${product.id})"><i class='bx bxs-cart-add'></i></button>
                    <a  href="product.html?product_id=${product.id}" class="btn btn__view__product">View Product</a>
                </div>
            </div>
    `;
    product__row.innerHTML += product__card;
    });
}

function Show__Product(){
    fetch('https://fakestoreapi.com/products')
        .then(res=>res.json())
        .then(data=>Load__Product(data))
}

function add_to_cart(id,quantity=1){

    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingProduct = cart.find(product => product.id === id);

    if (existingProduct) {
        existingProduct.quantity += quantity;
    } else {
        // If the product is not in the cart, add a new entry
        cart.push({ id: id, quantity: quantity });
    }    
    localStorage.setItem('cart', JSON.stringify(cart));
    showMsg('Item added to cart successfully','success')
    console.log(`Product with ID ${id} added to cart with quantity ${quantity}.`);
}

// for product page
function viewProductDetails(product_id){
    fetch(`https://fakestoreapi.com/products/${product_id}`)
        .then(res=>res.json())
        .then(data=>showProductDetails(data))
}

function showProductDetails(data){
    console.log(data);
    let title = document.getElementById('title');
    let price = document.getElementById('price');
    let description = document.getElementById('description');
    let category = document.getElementById('category');
    let product_img = document.getElementById('product_img');
    let rating = document.getElementById('rating');
    let total_item = document.getElementById('total_item');

    product_img.src = data.image;
    title.innerText = data.title;
    price.innerHTML += data.price;
    description.innerText = data.description;
    category.innerText = data.category;
    rating.innerText += data.rating.rate;
    total_item.innerText += data.rating.count;
}

// for cart page 

let cart_detail = {
    total_product:0,
    total_price: 0,
    discount:0,
    total_amount:0,
    total_save:0
}
function cart_details(id,product_price,quantity){
    let price = product_price * quantity;
    cart_detail.total_product++;
    cart_detail.total_price += price;
    cart_detail.total_amount = cart_detail.total_price;
    document.getElementById("total_product").innerHTML = cart_detail.total_product; 
    document.getElementById("total_price").innerHTML = cart_detail.total_price; 
    document.getElementById("total_amount").innerHTML = cart_detail.total_amount; 
    document.getElementById("discount").innerHTML = cart_detail.discount;
    document.getElementById(`cart_price${id}`).innerHTML =price; 
    

}

function Load_Cart_Product(product,quantity){


    let product__card = `
        <div class="cart_card">
            <div class="img">
                <img src="${product.image}" alt="">
            </div>
            <div class="product_details">
                <button onclick="removeFromCart(${product.id})" class="btn__remove"><i class='bx bx-trash'></i></button>
                <h2 class="product__name">${product.title}</h2>
                <h3 class="product__price" id="cart_price${product.id}"><i class='bx bx-rupee'></i></h3>
            
                <div class="input_group">
                    <button onclick="DecreaseQuantity(${product.id})">-</button>
                    <input type="number" id="input${product.id}" value="${quantity}" min="1" name="" id="">
                    <button onclick="IncreaseQuantity(${product.id})">+</button>
                </div>
            </div>
        </div>
    `;
    cart_item.innerHTML += product__card;
    
    cart_details(product.id,product.price,quantity);
}

function Show_Cart_Product(cart){
    cart.map((product)=>{        
        console.log(product.id);
        viewCartProductDetails(product.id,product.quantity)
    })

}

function viewCartProductDetails(product_id,quantity){
    fetch(`https://fakestoreapi.com/products/${product_id}`)
        .then(res=>res.json())
        .then(data=>Load_Cart_Product(data,quantity))
}






