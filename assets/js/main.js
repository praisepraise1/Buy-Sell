/* ==========================================
   FootStyle E-commerce JavaScript
   Cart Management Using LocalStorage
========================================== */


// Get cart from localStorage

let cart = JSON.parse(localStorage.getItem("cart")) || [];


// Update cart badge

function updateCartCount() {

    const cartCount = document.getElementById("cart-count");

    if (!cartCount) return;


    const totalItems = cart.reduce(
        (total, item) => total + item.quantity,
        0
    );


    cartCount.textContent = totalItems;

}



// Save cart

function saveCart() {

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );

    updateCartCount();

}



// Add product to cart

function addToCart(product) {


    const existingProduct = cart.find(
        item => item.id === product.id
    );


    if (existingProduct) {

        existingProduct.quantity++;

    } else {


        cart.push({

            ...product,

            quantity:1

        });

    }


    saveCart();


    showCartAnimation();

}



// Add button event listeners

function setupAddToCartButtons() {


    const buttons = document.querySelectorAll(".cart-btn");


    buttons.forEach(button => {


        button.addEventListener("click",()=>{


            const product = {


                id: button.dataset.id,

                name: button.dataset.name,

                price: Number(button.dataset.price),

                image: button.dataset.image


            };


            addToCart(product);



            button.classList.add("cart-added");


            setTimeout(()=>{

                button.classList.remove("cart-added");

            },400);



        });


    });


}



// Cart animation

function showCartAnimation(){


    const cartIcon = document.querySelector(".cart-icon");


    if(!cartIcon) return;


    cartIcon.classList.add("cart-added");


    setTimeout(()=>{

        cartIcon.classList.remove("cart-added");

    },400);


}




// Display cart items

function displayCart(){


    const cartItemsContainer =
    document.getElementById("cart-items");


    if(!cartItemsContainer) return;



    cartItemsContainer.innerHTML = "";



    if(cart.length === 0){


        cartItemsContainer.innerHTML = `

        <div class="empty-cart">

            <i class="fas fa-shopping-basket"></i>

            <h2>Your cart is empty.</h2>

            <p>Add some premium footwear to continue shopping.</p>

            <a href="index.html" class="continue-btn">
                Continue Shopping
            </a>

        </div>

        `;


        updateTotal();


        return;

    }



    cart.forEach(item=>{


        const cartItem = document.createElement("div");


        cartItem.className="cart-item fade-item";



        cartItem.innerHTML = `


        <img src="${item.image}" alt="${item.name}">


        <div>

            <h3>${item.name}</h3>

            <p>₦${item.price.toLocaleString()}</p>

        </div>


        <div class="quantity-box">


            <button class="quantity-btn decrease"
            data-id="${item.id}">
                -
            </button>


            <span class="quantity">
                ${item.quantity}
            </span>


            <button class="quantity-btn increase"
            data-id="${item.id}">
                +
            </button>


        </div>



        <div class="item-price">

            ₦${(item.price * item.quantity)
            .toLocaleString()}

        </div>



        <button class="remove-btn"
        data-id="${item.id}">

            Remove

        </button>



        `;



        cartItemsContainer.appendChild(cartItem);



    });



    setupCartButtons();


    updateTotal();


}



// Quantity and remove buttons

function setupCartButtons(){


    document.querySelectorAll(".increase")
    .forEach(button=>{


        button.addEventListener("click",()=>{


            const product =
            cart.find(item =>
            item.id === button.dataset.id);



            product.quantity++;


            saveCart();

            displayCart();


        });


    });



    document.querySelectorAll(".decrease")
    .forEach(button=>{


        button.addEventListener("click",()=>{


            const product =
            cart.find(item =>
            item.id === button.dataset.id);



            if(product.quantity > 1){

                product.quantity--;

            }


            saveCart();

            displayCart();


        });


    });



    document.querySelectorAll(".remove-btn")
    .forEach(button=>{


        button.addEventListener("click",()=>{


            cart = cart.filter(
                item =>
                item.id !== button.dataset.id
            );


            saveCart();

            displayCart();


        });


    });


}



// Update total price

function updateTotal(){


    const totalElement =
    document.getElementById("cart-total");


    if(!totalElement) return;



    const total = cart.reduce(

        (sum,item)=>

        sum + (item.price * item.quantity),

        0

    );



    totalElement.textContent =
    `₦${total.toLocaleString()}`;


}




// Clear cart

function setupClearCart(){


    const clearButton =
    document.getElementById("clear-cart");



    if(!clearButton) return;



    clearButton.addEventListener("click",()=>{


        cart=[];


        saveCart();


        displayCart();


    });


}



// Initialize website

document.addEventListener(
"DOMContentLoaded",
()=>{


    updateCartCount();


    setupAddToCartButtons();


    displayCart();


    setupClearCart();


});