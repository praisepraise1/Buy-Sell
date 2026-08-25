/* ==========================================
    Praise Joshua E-commerce JavaScript
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
    updateCheckoutButtonState();
    renderCheckoutSummary();

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


// Checkout modal

function updateCheckoutButtonState(){

    const checkoutButton =
    document.getElementById("checkout-btn");


    if(!checkoutButton) return;


    checkoutButton.disabled = cart.length === 0;
    checkoutButton.classList.toggle("disabled", cart.length === 0);

}


function renderCheckoutSummary(){

    const summary = document.getElementById("checkout-summary");


    if(!summary) return;


    const subtotal = cart.reduce(
        (sum,item)=> sum + item.price * item.quantity,
        0
    );

    const shipping = cart.length > 0 ? 2500 : 0;
    const total = subtotal + shipping;


    summary.innerHTML = `

        <h3>Order Summary</h3>

        <ul class="checkout-items">
            ${cart.map(item => `
                <li>
                    <span>${item.name} × ${item.quantity}</span>
                    <strong>₦${(item.price * item.quantity).toLocaleString()}</strong>
                </li>
            `).join("")}
        </ul>

        <div class="checkout-totals">
            <div><span>Subtotal</span><strong>₦${subtotal.toLocaleString()}</strong></div>
            <div><span>Shipping</span><strong>₦${shipping.toLocaleString()}</strong></div>
            <div class="checkout-total"><span>Total</span><strong>₦${total.toLocaleString()}</strong></div>
        </div>

    `;

}


function showCheckoutMessage(message, type = "success"){

    const status = document.getElementById("checkout-status");


    if(!status) return;


    status.innerHTML = `
        <div class="checkout-message ${type}">
            ${message}
        </div>
    `;

}

function generatePdfReceipt(customerName, email, address) {
    if (!window.jspdf?.jsPDF) return;

    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF();

    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shipping = cart.length > 0 ? 2500 : 0;
    const total = subtotal + shipping;
    const orderId = `FS-${Date.now().toString().slice(-6)}`;

    pdf.setFontSize(18);
    pdf.text("Praise Joshua Receipt", 14, 22);
    pdf.setFontSize(11);
    pdf.text(`Order ID: ${orderId}`, 14, 34);
    pdf.text(`Date: ${new Date().toLocaleString()}`, 14, 42);
    pdf.text(`Customer: ${customerName}`, 14, 50);
    pdf.text(`Email: ${email}`, 14, 58);
    pdf.text(`Address: ${address}`, 14, 66);

    pdf.setFontSize(13);
    pdf.text("Items", 14, 82);
    let y = 92;

    cart.forEach(item => {
        pdf.setFontSize(10);
        pdf.text(`${item.name} × ${item.quantity}`, 14, y);
        pdf.text(`₦${(item.price * item.quantity).toLocaleString()}`, 170, y, { align: "right" });
        y += 8;
    });

    pdf.setFontSize(12);
    pdf.text("Subtotal:", 14, y + 12);
    pdf.text(`₦${subtotal.toLocaleString()}`, 170, y + 12, { align: "right" });
    pdf.text("Shipping:", 14, y + 20);
    pdf.text(`₦${shipping.toLocaleString()}`, 170, y + 20, { align: "right" });
    pdf.setFontSize(14);
    pdf.text("Total:", 14, y + 32);
    pdf.text(`₦${total.toLocaleString()}`, 170, y + 32, { align: "right" });

    pdf.save(`praise-joshua-receipt-${orderId}.pdf`);
}

function showSuccessAlert(customerName, email, address, reference = null) {
    const referenceText = reference ? `<br><small>Ref: ${reference}</small>` : "";
    Swal.fire({
        icon: 'success',
        title: 'Order Successful',
        html: `Thanks, <strong>${customerName}</strong>. Your test order has been placed.${referenceText}`,
        confirmButtonText: 'Download Receipt',
        customClass: {
            popup: 'swal2-rounded',
        }
    }).then(() => {
        generatePdfReceipt(customerName, email, address);
    });
}

function setupCheckoutModal(){

    const checkoutButton = document.getElementById("checkout-btn");
    const modal = document.getElementById("checkout-modal");
    const closeButton = document.getElementById("checkout-close");
    const overlay = modal?.querySelector(".modal-overlay");
    const form = document.getElementById("checkout-form");


    if(!checkoutButton || !modal || !form) return;


    const openModal = ()=>{

        if(cart.length === 0) return;

        renderCheckoutSummary();
        form.reset();

        const status = document.getElementById("checkout-status");
        if(status) status.innerHTML = "";

        modal.classList.add("open");
        document.body.style.overflow = "hidden";

    };


    const closeModal = ()=>{

        modal.classList.remove("open");
        document.body.style.overflow = "";

        const status = document.getElementById("checkout-status");
        if(status) status.innerHTML = "";

    };


    checkoutButton.addEventListener("click", openModal);
    closeButton?.addEventListener("click", closeModal);
    overlay?.addEventListener("click", closeModal);


    form.addEventListener("submit", (event)=>{

        event.preventDefault();


        const customerName =
        document.getElementById("customer-name").value.trim();

        const email =
        document.getElementById("customer-email").value.trim();

        const address =
        document.getElementById("shipping-address").value.trim();

        const cardholderName =
        document.getElementById("cardholder-name").value.trim();

        const cardNumber =
        document.getElementById("card-number").value.trim();

        const cardExpiry =
        document.getElementById("card-expiry").value.trim();

        const cardCvv =
        document.getElementById("card-cvv").value.trim();


        if(!customerName || !email || !address || !cardholderName || !cardNumber || !cardExpiry || !cardCvv){

            showCheckoutMessage("Please complete all checkout fields, including your demo card details.", "error");
            return;

        }


        const status = document.getElementById("checkout-status");

        if(status){

            status.innerHTML = `
                <div class="checkout-processing">
                    <div class="checkout-spinner"></div>
                    <p>Processing your test payment...</p>
                </div>
            `;

        }


        const paystackKey = "pk_test_your_paystack_public_key_here";


        if(paystackKey.includes("your_paystack_public_key_here")){

            setTimeout(()=>{

                cart = [];
                saveCart();
                displayCart();
                updateCheckoutButtonState();
                closeModal();
                showSuccessAlert(customerName, email, address);

            }, 2000);

            return;

        }


        if(window.PaystackPop){

            const handler = window.PaystackPop.setup({

                key: paystackKey,
                email: email,
                amount: cart.reduce(
                    (sum,item)=> sum + item.price * item.quantity,
                    0
                ) * 100,
                currency: "NGN",
                ref: `praise-joshua-${Date.now()}`,
                label: customerName,
                callback: function(response){

                            setTimeout(()=>{

                            cart = [];
                            saveCart();
                            displayCart();
                            updateCheckoutButtonState();
                            closeModal();
                            showSuccessAlert(customerName, email, address, response.reference);

                        }, 2000);

                },
                onClose: function(){

                    showCheckoutMessage("Payment window closed. No charge was made.", "error");

                }

            });

            handler.openIframe();

        } else {

            showCheckoutMessage("Paystack could not be loaded. Please replace the placeholder test key.", "error");

        }

    });


    updateCheckoutButtonState();

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

    setupCheckoutModal();


});