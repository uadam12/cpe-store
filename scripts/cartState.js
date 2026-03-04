export let cart = {}; 

export const clearCart = () => {cart = {}};
export const addToCart = (id) => { cart[id] = 1; };
export const removeFromCart = (id) => { delete cart[id]; };
export const updateQuantity = (id, delta) => {
    if (!cart[id]) return;
    cart[id] += delta;
    if (cart[id] <= 0) removeFromCart(id);
};
export const getCartTotal = (productList) => {
    return Object.keys(cart).reduce((sum, id) => {
        const product = productList.find(p => p.id === parseInt(id));
        return sum + (product.price * cart[id]);
    }, 0);
};
export const getCartCount = () => Object.values(cart).reduce((sum, qty) => sum + qty, 0);
export const checkout = (amount) => {
    if (amount <= 0) {
        alert("Please select a product before checkout");
        return false;
    }
    
    alert(`Your order for ${formatAmount(amount)} is placed successfully!!!`);
    return true;
}

// --- AMOUNT FORMATTING FUNCTIONS ---
export const formatAmount = (amount) => new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 2
}).format(amount);