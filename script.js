document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.btn');
    const cartItems = document.querySelector('.cart-items');
    const totalElement = document.getElementById('total');
    const cartCount = document.querySelector('.cart h5');
    const cartImage = document.querySelector('.cart > img');
    const cartEmptyMessage = document.querySelector('.cart h6');
    const footElement = document.querySelector('.foot');
    const tickElement = document.querySelector('.tick');
    const checkoutOverlay = document.querySelector('.checkout-overlay');
    const checkoutContent = document.querySelector('.checkout-content');
    let cart = [];

    buttons.forEach(btn => {
        const quantity = btn.querySelector('.quantity');
        const newContent = btn.querySelector('.new-content');
        const originalContent = btn.querySelector('.original-content');
        let count = 0;

        originalContent.addEventListener('click', (e) => {
            e.stopPropagation();
            btn.classList.add('show');
            count = 1;
            quantity.textContent = count;
            updateCart(btn, count);
            updateCartVisibility();
        });

        newContent.addEventListener('click', (e) => {
            e.stopPropagation();
            // This prevents the button from toggling when clicking inside it
        });

        btn.querySelector('.increment').addEventListener('click', (e) => {
            e.stopPropagation();
            count++;
            quantity.textContent = count;
            updateCart(btn, count);
            updateCartVisibility();
        });

        btn.querySelector('.decrement').addEventListener('click', (e) => {
            e.stopPropagation();
            if (count > 0) {
                count--;
                quantity.textContent = count;
                updateCart(btn, count);
                updateCartVisibility();
            }
            if (count === 0) {
                btn.classList.remove('show');
            }
        });
    });

    function updateCart(btn, count) {
        const item = btn.closest('.img > div');
        const name = item.querySelector('h3').textContent;
        const price = parseFloat(item.querySelector('h4').textContent);
        const imgSrc = item.querySelector('img').src;


        const existingItem = cart.find(i => i.name === name);
        if (existingItem) {
            existingItem.count = count;
            if (count === 0) {
                cart = cart.filter(i => i.name !== name);
            }
        } else if (count > 0) {
            cart.push({ name, price, count, imgSrc });
        }

        updateCartDisplay();
    }

    function updateCartDisplay() {
        cartItems.innerHTML = '';
        let total = 0;

        cart.forEach(item => {
            const itemTotal = item.price * item.count;
            total += itemTotal;

            const itemElement = document.createElement('div');
            itemElement.innerHTML = `
                <p>${item.name} x${item.count}</p>
                <p>$${itemTotal.toFixed(2)}</p>
            `;
            cartItems.appendChild(itemElement);
        });

        totalElement.textContent = `$ ${total.toFixed(2)}`;
        cartCount.textContent = `Your Cart (${cart.length})`;
    }

    function updateCartVisibility() {
        if (cart.length > 0) {
            cartImage.style.display = 'none';
            cartEmptyMessage.style.display = 'none';
            footElement.style.display = 'flex';
            tickElement.style.display = 'block';
        } else {
            cartImage.style.display = 'block';
            cartEmptyMessage.style.display = 'block';
            footElement.style.display = 'none';
            tickElement.style.display = 'none';
        }
    }

    function handleCheckout() {
        checkoutOverlay.style.display = 'flex';
        let checkoutHTML = '<h2>Confirm Order</h2>';
        checkoutHTML += '<div class="checkout-items">';
        cart.forEach(item => {
            const itemTotal = item.price * item.count;
            checkoutHTML += `
            <div class="checkout-item">
            <img src="${item.imgSrc}" alt="${item.name}" class="checkout-item-image">
            <div class="checkout-item-details">
                <p><strong>${item.name}</strong> x${item.count}</p>
                <p><strong>$${itemTotal.toFixed(2)}</strong></p>
            </div>
        </div>
            `;
        });
        checkoutHTML += '</div>';
        checkoutHTML += `<p class="checkout-total"><strong>Total: $${totalElement.textContent}</strong></p>`;
        checkoutHTML += '<button class="close-checkout">Start New Order</button>';
        checkoutContent.innerHTML = checkoutHTML;

        document.querySelector('.close-checkout').addEventListener('click', resetCart);
    }

    function resetCart() {
        checkoutOverlay.style.display = 'none';
        cart = [];
        updateCartDisplay();
        updateCartVisibility();

        // Reset all buttons to original state
        buttons.forEach(btn => {
            btn.classList.remove('show');
            const quantity = btn.querySelector('.quantity');
            quantity.textContent = '0';
        });
    }

    

    // Add click event listener to the tick element
    tickElement.addEventListener('click', handleCheckout);

    // Initialize visibility
    updateCartVisibility();
});








