/* =========================
BANCO DE PRODUTOS
========================= */
const products = [
  { id:1, name:"Mouse Gamer RGB", description:"Sensor óptico 3200 DPI.", price:8.00, oldPrice:15.00, category:"mouse", stock:10, bestSeller:true, promo:true, img:"./imagem/09.png" },
  { id:2, name:"Kit Teclado e Mouse", description:"Combo ergonômico.", price:49.00, category:"teclado", stock:2, bestSeller:true, promo:false, img:"./imagem/18660A.jpg" },
  { id:3, name:"SSD NVMe 128GB", description:"Velocidade ultra rápida.", price:170.00, oldPrice:210.00, category:"hardware", stock:10, bestSeller:false, promo:true, img:"./imagem/23412A.jpg" },
  { id:4, name:"Memória Dahua 4GB", description:"DDR3 1600MHz.", price:95.00, category:"hardware", stock:0, bestSeller:false, promo:false, img:"./imagem/24617A.jpg" },
  { id:5, name:"Mouse Wireless PRO", description:"Conexão 2.4GHz.", price:25.00, category:"mouse", stock:8, bestSeller:true, promo:false, img:"./imagem/8a4a552c-13df-438c-a119-42325fc333ee.png" },
  { id:6, name:"Mouse K-Mex", description:"Design ambidestro.", price:10.00, category:"mouse", stock:8, bestSeller:true, promo:false, img:"./imagem/23015A.jpg" },
  { id:7, name:"Mouse C3Tech Azul", description:"Sensor preciso.", price:18.99, category:"mouse", stock:12, bestSeller:false, promo:false, img:"./imagem/19806A1.jpg" },
  { id:8, name:"Cooler Processador", description:"Ventilação silenciosa.", price:21.99, category:"hardware", stock:12, bestSeller:false, promo:false, img:"./imagem/24428A.jpg" },
  { id:9, name:"Placa Mãe Get H61", description:"DDR3 M2, Intel LGA 1155, DDR3, M.2, USB 2.0, VGA HDMI.", price:147.00, category:"hardware", stock:11, bestSeller:false, promo:false, img:"./imagem/24088A.jpg" },
  { id:10, name:"Processador Intel Core", description:"i3-2120, LGA 1155, Cache 3MB, 3.30GHz, OEM", price:49.00, category:"hardware", stock:12, bestSeller:false, promo:false, img:"./imagem/17659A.jpg" },
  { id:11, name:"Memória Kingston, 4GB", description:"1600MHz, DDR3, CL11 Paralela - KVR16N11/4.", price:106.00, category:"hardware", stock:12, bestSeller:false, promo:false, img:"./imagem/16532A.jpg" },
  { id:12, name:"Gabinete C3Tech ATX", description:"Com Fonte 200W, Preto - MT-31V2BK.", price:143.00, category:"hardware", stock:12, bestSeller:false, promo:false, img:"./imagem/23234A.jpg" },
  { id:13, name:"SSD Redragon Rock", description:"120GB, SATA III, Leitura 520MB/s, Gravação 470MB/s, Preto - GD-310.", price:190.00, category:"hardware", stock:12, bestSeller:false, promo:false, img:"./imagem/24585A2.jpg" },
  { id:14, name:"Teclado Maxprint Office Easy", description:"USB 2.0, Padrão, Preto - 60000153.", price:24.00, category:"teclado", stock:12, bestSeller:false, promo:false, img:"./imagem/23447A.jpg" },
  { id:15, name:"Cabo de Força", description:"1.20 Metro Padrão Novo, Preto", price:14.00, category:"hardware", stock:12, bestSeller:false, promo:false, img:"./imagem/02941A.jpg" },
  { id:16, name:"Computador Intel Core I3-2120 3.30GHz", description:"4GB DDR3, SSD 120Gb, Monitor 15.4 Led, Teclado e Mouse", price:957.99, category:"hardware", stock:8, bestSeller:true, promo:false, img:"./imagem/HOMEPC46A.jpg" }
];

/* =========================
ESTADO GLOBAL
========================= */
let cart = JSON.parse(localStorage.getItem("cart")) || [];
let discount = Number(localStorage.getItem("discount")) || 0;
let shipping = 0;
let searchTimeout;

/* =========================
RENDERIZAÇÃO
========================= */
function renderProducts(data){
  const grid = document.getElementById("productsGrid");
  if(!grid) return;

  if(data.length === 0){
    grid.innerHTML = `<p style="grid-column:1/-1;text-align:center;padding:50px">Nenhum produto encontrado</p>`;
    return;
  }

  grid.innerHTML = data.map(p => `
    <div class="product-card">
      ${p.promo ? '<span class="badge badge-promo">% Oferta</span>' : ''}
      ${p.bestSeller ? '<span class="badge badge-best">Top</span>' : ''}
      <img src="${p.img}" onerror="this.src='https://placehold.co/200x200?text=Produto'">
      <h3>${p.name}</h3>
      <p class="product-description">${p.description}</p>
      <div class="product-viewers">🔥 ${Math.floor(Math.random()*15)+3} pessoas vendo</div>
      <div class="product-price">
        ${p.oldPrice ? `<span class="price-old">R$ ${p.oldPrice.toFixed(2)}</span>` : ''}
        R$ ${p.price.toFixed(2)}
      </div>
      <button class="add-btn" onclick="addToCart(${p.id})" ${p.stock === 0 ? 'disabled' : ''}>
        ${p.stock > 0 ? 'Adicionar' : 'Esgotado'}
      </button>
    </div>
  `).join("");
}

/* =========================
LÓGICA DO CARRINHO
========================= */
function addToCart(id){
  const product = products.find(p => p.id===id);
  const item = cart.find(i => i.id===id);

  if(item){
    if(item.qty < product.stock){
      item.qty++;
      showToast("Quantidade atualizada");
    } else {
      showToast("Estoque insuficiente");
      return;
    }
  } else {
    cart.push({...product, qty:1});
    showToast("Produto adicionado!");
  }

  updateCart();
  openCart();
}

function changeQty(id, change){
  const item = cart.find(i => i.id===id);
  const product = products.find(p => p.id===id);
  if(!item) return;

  item.qty += change;

  if(item.qty <= 0){
    removeFromCart(id);
    return;
  }

  if(item.qty > product.stock){
    item.qty = product.stock;
    showToast("Limite de estoque");
  }

  updateCart();
}

function removeFromCart(id){
  cart = cart.filter(i => i.id!==id);
  updateCart();
}

/* =========================
CÁLCULOS E UI DO CARRINHO
========================= */
function updateCart(){
  const container = document.getElementById("cartItems");
  const subtotal = cart.reduce((t,i)=>t + (i.price*i.qty),0);
  const cepInput = document.getElementById("shippingInput");
  const cep = cepInput ? cepInput.value.replace(/\D/g,"") : "";

  // Lógica de Frete (Ex: CEP começando com 5 é Pernambuco/Recife)
  if(cep.startsWith("5") && subtotal >= 25){
    shipping = 0;
  } else if(cep.length >= 5){
    shipping = 15;
  } else {
    shipping = 0;
  }

  const discountAmount = subtotal * discount;
  const total = (subtotal - discountAmount) + shipping;

  // Atualiza crachá e subtotal
  document.getElementById("cartCount").innerText = cart.reduce((s,i)=>s+i.qty,0);
  document.getElementById("cartSubtotal").innerText = `R$ ${subtotal.toFixed(2)}`;

  // Área de Desconto
  const discRow = document.getElementById("discountRow");
  if(discountAmount > 0){
    discRow.style.display = "flex";
    document.getElementById("cartDiscount").innerText = `- R$ ${discountAmount.toFixed(2)}`;
  } else {
    discRow.style.display = "none";
  }

  // Área de Frete
  const shipText = document.getElementById("cartShipping");
  if(shipping === 0 && cep.startsWith("5") && subtotal >= 25){
    shipText.innerText = "GRÁTIS";
    shipText.style.color = "#00f2fe";
  } else {
    shipText.innerText = `R$ ${shipping.toFixed(2)}`;
    shipText.style.color = "inherit";
  }

  document.getElementById("cartTotal").innerText = `R$ ${total.toFixed(2)}`;

  // Renderiza itens no carrinho
  if(cart.length===0){
    container.innerHTML = `
      <div class="empty-cart">
        <p>🛒 Seu carrinho está vazio</p>
        <button onclick="closeCart()">Adicionar produtos</button>
      </div>
    `;
  } else {
    container.innerHTML = cart.map(i => `
      <div class="cart-item">
        <img src="${i.img}">
        <div class="item-info">
          <h4>${i.name}</h4>
          <small>R$ ${i.price.toFixed(2)}</small>
          <div class="qty-control">
            <button onclick="changeQty(${i.id},-1)">-</button>
            <span>${i.qty}</span>
            <button onclick="changeQty(${i.id},1)">+</button>
          </div>
        </div>
        <button class="remove-btn" onclick="removeFromCart(${i.id})">✕</button>
      </div>
    `).join("");
  }

  localStorage.setItem("cart", JSON.stringify(cart));
}

/* =========================
CUPOM (CORRIGIDO)
========================= */
function applyCoupon() {
  const code = document.getElementById("couponInput").value.toUpperCase().trim();
  
  const coupons = {
    "TECH10": 0.10,
    "MARIA11": 0.11,
    "PROMO20": 0.20,
    "BLACK50": 0.50
  };

  if (coupons.hasOwnProperty(code)) {
    discount = coupons[code]; // Atualiza variável global corretamente
    localStorage.setItem("discount", discount);
    showToast(`Cupom ${code} aplicado!`);
    updateCart();
  } else {
    showToast("Cupom inválido");
    discount = 0;
    localStorage.removeItem("discount");
    updateCart();
  }
}

/* =========================
FILTROS E BUSCA
========================= */
function filterCategory(cat, btn){
  document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
  btn.classList.add("active");

  if(cat==="todos") renderProducts(products);
  else if(cat==="promo") renderProducts(products.filter(p => p.promo));
  else renderProducts(products.filter(p => p.category===cat));
}

function filterProducts(){
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    const term = document.getElementById("searchInput").value.toLowerCase();
    renderProducts(products.filter(p => p.name.toLowerCase().includes(term)));
  }, 300);
}

function calculateShipping(){
  updateCart();
  showToast("Frete calculado!");
}

/* =========================
UI CONTROLS
========================= */
function toggleCart(){ document.getElementById("cartSidebar").classList.toggle("active"); }
function openCart(){ document.getElementById("cartSidebar").classList.add("active"); }
function closeCart(){ document.getElementById("cartSidebar").classList.remove("active"); }

function showToast(msg){
  const t = document.getElementById("toast");
  t.innerText = msg;
  t.classList.add("show");
  setTimeout(()=>{ t.classList.remove("show"); },2500);
}

/* =========================
CHECKOUT WHATSAPP (FINALIZADO)
========================= */
function checkout(){
  if(cart.length===0){ showToast("Carrinho vazio!"); return; }

  const subtotal = cart.reduce((t,i)=>t+(i.price*i.qty),0);
  const discountAmount = subtotal * discount;
  const total = subtotal - discountAmount + shipping;

  let message = `*PEDIDO TECHSTORE PRO*%0A%0A`;
  
  cart.forEach(i => {
    message += `• ${i.qty}x ${i.name} - R$ ${(i.price * i.qty).toFixed(2)}%0A`;
  });

  message += `%0A---%0A`;
  message += `*Subtotal:* R$ ${subtotal.toFixed(2)}%0A`;
  if(discount > 0) message += `*Desconto:* - R$ ${discountAmount.toFixed(2)}%0A`;
  message += `*Frete:* ${shipping === 0 ? "GRÁTIS" : "R$ " + shipping.toFixed(2)}%0A`;
  message += `*TOTAL:* R$ ${total.toFixed(2)}%0A%0A`;
  message += `_Aguardando instruções de pagamento._`;

  const phone = "5581999999999"; // Substitua pelo seu número
  window.open(`https://wa.me/${phone}?text=${message}`);
}

/* =========================
INICIALIZAÇÃO
========================= */
window.onload = () => {
  renderProducts(products);
  updateCart();
};
