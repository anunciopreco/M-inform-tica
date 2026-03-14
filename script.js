const products = [
    { id:1, name:"Mouse Gamer RGB", price:8.00, oldPrice: 15.00, category:"mouse", stock: 10, bestSeller: true, promo: true, img:"imagem/09.png"},
    { id:2, name:"Kit Teclado e Mouse", price:49.00, category:"teclado", stock: 2, bestSeller: true, promo: false, img:"imagem/18660A.jpg"},
    { id:3, name:"SSD NVMe 128.GB", price:170.00, oldPrice: 210.00, category:"hardware", stock: 10, bestSeller: false, promo: true, img:"imagem/23412A.jpg"},
    { id:4, name:"Memória Dahua, 4GB, 1600MHz, DDR3, CL11, Preto - DHI-DDR-C160U4G", price:95.00, category:"hardware", stock: 0, bestSeller: false, promo: false, img:"imagem/24617A.jpg"},
    { id:5, name:"Mouse Wireless PRO", price:25.00, category:"mouse", stock: 8, bestSeller: true, promo: false, img:"imagem/8a4a552c-13df-438c-a119-42325fc333ee.png"},
    { id:6, name:"Mouse K-Mex MO-M833, USB, 3 Botões", price:10.00, category:"mouse", stock: 8, bestSeller: true, promo: false, img:"imagem/23015A.jpg"},
    { id:7, name:"Mouse C3Tech, USB, 3 Botões, 1000DPI, Preto e Azul - MS-20BL", price:18.99, category:"mause", stock: 12, bestSeller: false, promo: false, img:"imagem/19806A1.jpg"},
    { id:8, name:"Cooler Para Processador Get, Intel 1150/1151/1155/1156/1700, Preto - 72331", price:21.99, category:"hardware", stock: 12, bestSeller: false, promo: false, img:"imagem/24428A.jpg"}
];

let cart = [];
let discount = 0;
let shipping = 0;

function renderProducts(data) {
    const grid = document.getElementById("productsGrid");
    grid.innerHTML = data.map(p => `
        <div class="product-card ${p.stock === 0 ? 'out-of-stock' : ''}">
            ${p.promo ? '<span class="badge badge-promo">% Oferta</span>' : ''}
            ${p.bestSeller ? '<span class="badge badge-best">Mais Vendido</span>' : ''}
            <img src="${p.img}">
            <div class="product-name">${p.name}</div>
            <div class="product-price">
                ${p.oldPrice ? `<span class="price-old">R$ ${p.oldPrice.toFixed(2)}</span>` : ''}
                R$ ${p.price.toFixed(2)}
            </div>
            <button class="add-btn" onclick="addToCart(${p.id})" ${p.stock === 0 ? 'disabled' : ''}>
                ${p.stock > 0 ? 'Adicionar ao Setup' : 'Esgotado'}
            </button>
        </div>
    `).join("");
}

function addToCart(id) {
    const product = products.find(p => p.id === id);
    const item = cart.find(i => i.id === id);
    if (item) {
        if (item.qty < product.stock) item.qty++;
        else return showToast("Estoque máximo atingido!");
    } else cart.push({...product, qty: 1});
    updateCart();
    showToast(`${product.name} adicionado! 🚀`);
}

function updateCart() {
    const cartCount = document.getElementById("cartCount");
    const subtotal = cart.reduce((s, i) => s + (i.price * i.qty), 0);
    const cep = document.getElementById("shippingInput").value;

    // LÓGICA FRETE GRÁTIS: Pernambuco (começa com 5) e Total >= 25.00
    if(cep.startsWith("5") && subtotal >= 25.00) {
        shipping = 0;
    } else if (cep !== "") {
        shipping = 7.00;
    }

    const totalDiscount = subtotal * discount;
    const finalTotal = (subtotal - totalDiscount + shipping);

    cartCount.innerText = cart.reduce((s, i) => s + i.qty, 0);
    cartCount.classList.add("pop");
    setTimeout(() => cartCount.classList.remove("pop"), 300);

    document.getElementById("cartItems").innerHTML = cart.map(i => `
        <div class="cart-item" style="display:flex; justify-content:space-between; margin-bottom:10px; border-bottom:1px solid #333; padding-bottom:5px">
            <div>${i.name} (x${i.qty})</div>
            <button onclick="removeFromCart(${i.id})" style="background:none; border:none; color:red; cursor:pointer">✕</button>
        </div>
    `).join("");

    document.getElementById("cartSubtotal").innerText = `R$ ${subtotal.toFixed(2)}`;
    document.getElementById("cartDiscount").innerText = `- R$ ${totalDiscount.toFixed(2)}`;
    document.getElementById("cartShipping").innerText = (shipping === 0 && subtotal >= 200) ? "GRÁTIS" : `R$ ${shipping.toFixed(2)}`;
    document.getElementById("cartTotal").innerText = `R$ ${finalTotal.toFixed(2)}`;
    document.getElementById("discountRow").style.display = discount > 0 ? "flex" : "none";
}

function calculateShipping() {
    const cep = document.getElementById("shippingInput").value;
    if(cep.length >= 5) {
        showToast("Calculando frete...");
        updateCart();
    } else showToast("Digite um CEP válido.");
}

function applyCoupon() {
    const input = document.getElementById("couponInput");
    if(input.value.toUpperCase() === "./.1") {
        discount = 0.10;
        document.getElementById("couponCard").classList.add("coupon-active");
        showToast("Cupom de 10% aplicado!");
    } else {
        discount = 0;
        document.getElementById("couponCard").classList.remove("coupon-active");
        showToast("Cupom inválido.");
    }
    updateCart();
}

function removeFromCart(id) {
    cart = cart.filter(i => i.id !== id);
    updateCart();
}

function toggleCart() { document.getElementById("cartSidebar").classList.toggle("active"); }

function showToast(msg) {
    const t = document.getElementById("toast");
    t.innerText = msg; t.classList.add("show");
    setTimeout(() => t.classList.remove("show"), 3000);
}

function filterCategory(cat, btn) {
    document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    if(cat === 'todos') renderProducts(products);
    else if(cat === 'promo') renderProducts(products.filter(p => p.promo));
    else renderProducts(products.filter(p => p.category === cat));
}

function filterProducts() {
    const term = document.getElementById("searchInput").value.toLowerCase();
    renderProducts(products.filter(p => p.name.toLowerCase().includes(term)));
}

function checkout() {
    if(cart.length === 0) return showToast("Carrinho vazio!");
    let msg = "🛒 *NOVO PEDIDO TECHSTORE*%0A%0A";
    cart.forEach(i => msg += `• ${i.name} (${i.qty}x)%0A`);
    msg += `%0A💰 *Total:* ${document.getElementById("cartTotal").innerText}`;
    window.open(`https://wa.me/55996646300?text=${msg}`, "_blank");
}

renderProducts(products);