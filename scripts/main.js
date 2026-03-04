import { products } from './products.js';
import * as CartLogic from './cartState.js';
import { paystackCheckout } from './checkout.js'


const grid = document.getElementById('product-grid');
const cartTotal = document.getElementById('cart-total');
const cartContainer = document.getElementById('cart-sidebar');
const cartItemsContainer = document.getElementById('cart-items');
const checkoutModal = document.getElementById("checkout-modal");
const checkoutForm = document.getElementById("checkout-form");


// --- RENDERING FUNCTIONS ---
const renderProducts = () => {
    grid.innerHTML = products.map(product => {
        const isInCart = CartLogic.cart[product.id] !== undefined;

        return `
        <div class="bg-white rounded-3xl p-4 border border-gray-100 shadow-sm hover:shadow-xl transition-all group">
            <div class="relative rounded-2xl overflow-hidden mb-4 aspect-square bg-gray-50">
                <img src="${product.image}" class="w-full h-full object-cover group-hover:scale-105 transition duration-500">
            </div>
            <p class="text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-1">${product.category}</p>
            <h3 class="font-bold text-gray-800">${product.name}</h3>
            <div class="flex justify-between items-center mt-4">
                <span class="text-xl font-black">${CartLogic.formatAmount(product.price)}</span>
                ${isInCart
                ? `<button onclick="handleRemove(${product.id})" class="bg-red-50 text-red-500 px-4 py-2 rounded-xl text-xs font-bold hover:bg-red-500 hover:text-white transition">Remove</button>`
                : `<button onclick="handleAdd(${product.id})" class="bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-blue-600 transition">Add to Cart</button>`
            }
            </div>
        </div>`;
    }).join('');
};

const renderCart = () => {
    const cartCount = CartLogic.getCartCount();
    document.getElementById('cart-count').innerText = cartCount;

    const items = Object.keys(CartLogic.cart).map(id => {
        const product = products.find(p => p.id === parseInt(id));
        const qty = CartLogic.cart[id];
        return `
            <div class="flex items-center justify-between bg-white p-3 rounded-2xl border border-gray-100 shadow-sm">
                <div class="flex items-center space-x-3">
                    <img src="${product.image}" class="w-12 h-12 rounded-lg object-cover">
                    <div>
                        <p class="font-bold text-xs">${product.name}</p>
                        <p class="text-xs text-blue-600 font-bold">${CartLogic.formatAmount(product.price * qty)}</p>
                    </div>
                </div>
                <div class="flex items-center space-x-2 bg-gray-50 rounded-lg px-2 py-1">
                    <button onclick="handleQty(${product.id}, -1)" class="text-gray-400 hover:text-blue-600 font-bold px-1">-</button>
                    <span class="text-xs font-bold w-4 text-center">${qty}</span>
                    <button onclick="handleQty(${product.id}, 1)" class="text-gray-400 hover:text-blue-600 font-bold px-1">+</button>
                </div>
            </div>`;
    }).join('');

    cartItemsContainer.innerHTML = items || `<div class="text-center py-20 text-gray-400 text-sm">Your cart is empty</div>`;
    cartTotal.innerText = CartLogic.formatAmount(CartLogic.getCartTotal(products));
};

// --- EVENT HANDLERS (Exposed to Window) ---
window.handleAdd = (id) => { CartLogic.addToCart(id); updateUI(); };
window.handleRemove = (id) => { CartLogic.removeFromCart(id); updateUI(); };
window.handleQty = (id, delta) => { CartLogic.updateQuantity(id, delta); updateUI(); };
window.toggleCart = () => cartContainer.classList.toggle('open');
window.openCheckoutModal = () => {
    const totalAmount = CartLogic.getCartTotal(products);
    if (totalAmount <= 0) return alert(
        "Please select an item before checkout."
    );

    checkoutModal.classList.remove("hidden");
    checkoutModal.classList.add("flex");
};

// Close modal
window.closeCheckoutModal = () => {
    checkoutModal.classList.add("hidden");
    checkoutModal.classList.remove("flex");
};

const updateUI = () => {
    renderProducts();
    renderCart();
};

document.addEventListener('DOMContentLoaded', updateUI);

checkoutForm.addEventListener("submit", (e) => {
    e.preventDefault();
    paystackCheckout(CartLogic.getCartTotal(products));
});