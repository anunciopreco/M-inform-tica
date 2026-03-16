const products = [

{ id:1, name:"Mouse Gamer RGB", description:"Sensor óptico 3200 DPI.", price:8.00, oldPrice:15.00, category:"mouse", stock:10, bestSeller:true, promo:true, img:"./imagem/09.png"},
{ id:2, name:"Kit Teclado e Mouse", description:"Combo ergonômico.", price:49.00, category:"teclado", stock:2, bestSeller:true, promo:false, img:"./imagem/18660A.jpg"},
{ id:3, name:"SSD NVMe 128GB", description:"Velocidade ultra rápida.", price:170.00, oldPrice:210.00, category:"hardware", stock:10, bestSeller:false, promo:true, img:"./imagem/23412A.jpg"},
{ id:4, name:"Memória Dahua 4GB", description:"DDR3 1600MHz.", price:95.00, category:"hardware", stock:0, bestSeller:false, promo:false, img:"./imagem/24617A.jpg"},
{ id:5, name:"Mouse Wireless PRO", description:"Conexão 2.4GHz.", price:25.00, category:"mouse", stock:8, bestSeller:true, promo:false, img:"./imagem/8a4a552c-13df-438c-a119-42325fc333ee.png"},
{ id:6, name:"Mouse K-Mex", description:"Design ambidestro.", price:10.00, category:"mouse", stock:8, bestSeller:true, promo:false, img:"./imagem/23015A.jpg"},
{ id:7, name:"Mouse C3Tech Azul", description:"Sensor preciso.", price:18.99, category:"mouse", stock:12, bestSeller:false, promo:false, img:"./imagem/19806A1.jpg"},
{ id:8, name:"Cooler Processador", description:"Ventilação silenciosa.", price:21.99, category:"hardware", stock:12, bestSeller:false, promo:false, img:"./imagem/24428A.jpg"}

];

let cart = JSON.parse(localStorage.getItem("cart")) || [];
let discount = 0;
let shipping = 0;

/* =========================
SALVAR CARRINHO
========================= */

function saveCart(){
localStorage.setItem("cart", JSON.stringify(cart));
}

/* =========================
RENDER PRODUTOS
========================= */

function renderProducts(data){

const grid=document.getElementById("productsGrid");

grid.innerHTML=data.map(p=>`

<div class="product-card">

${p.promo?'<span class="badge badge-promo">% Oferta</span>':''}
${p.bestSeller?'<span class="badge badge-best">Top</span>':''}

<img src="${p.img}" onerror="this.src='./imagem/no-image.png'">

<h3>${p.name}</h3>

<p>${p.description}</p>

<div class="product-price">

${p.oldPrice?`<span class="price-old">R$ ${p.oldPrice.toFixed(2)}</span>`:''}

R$ ${p.price.toFixed(2)}

</div>

<button class="add-btn" onclick="addToCart(${p.id})" ${p.stock===0?'disabled':''}>

${p.stock>0?'Adicionar':'Esgotado'}

</button>

</div>

`).join("");

}

/* =========================
ADICIONAR
========================= */

function addToCart(id){

const product=products.find(p=>p.id===id);
const item=cart.find(i=>i.id===id);

if(item){

if(item.qty<product.stock){

item.qty++;

showToast("+1 unidade adicionada");

}else{

showToast("Limite de estoque");

return;

}

}else{

cart.push({...product,qty:1});

showToast("Produto adicionado");

}

saveCart();
updateCart();

openCart();

}

/* =========================
QUANTIDADE
========================= */

function changeQty(id,delta){

const item=cart.find(i=>i.id===id);
const product=products.find(p=>p.id===id);

if(!item) return;

if(delta>0 && item.qty<product.stock){
item.qty++;
}

else if(delta<0 && item.qty>1){
item.qty--;
}

else if(delta<0 && item.qty===1){
removeFromCart(id);
return;
}

saveCart();
updateCart();

}

/* =========================
REMOVER
========================= */

function removeFromCart(id){

cart=cart.filter(i=>i.id!==id);

saveCart();
updateCart();

showToast("Produto removido");

}

/* =========================
ATUALIZAR CARRINHO
========================= */

function updateCart(){

const subtotal=cart.reduce((t,i)=>t+(i.price*i.qty),0);

const totalDiscount=subtotal*discount;

const cep=document.getElementById("shippingInput").value;

if(cep.startsWith("5") && subtotal>=25) shipping=0;
else if(cep.length>=5) shipping=7;
else shipping=0;

const finalTotal=subtotal-totalDiscount+shipping;

document.getElementById("cartCount").innerText=cart.reduce((s,i)=>s+i.qty,0);

const cartItems=document.getElementById("cartItems");

if(cart.length===0){

cartItems.innerHTML=`

<div class="empty-cart">

<p>🛒 Seu carrinho está vazio</p>

<button onclick="closeCart()">

Adicionar produtos

</button>

</div>

`;

}else{

cartItems.innerHTML=cart.map(i=>`

<div class="cart-item">

<img src="${i.img}" onerror="this.src='./imagem/no-image.png'">

<div class="item-info">

<h4>${i.name}</h4>

<div class="price">R$ ${i.price.toFixed(2)}</div>

<div class="qty-control">

<button class="qty-btn" onclick="changeQty(${i.id},-1)">-</button>

<span>${i.qty}</span>

<button class="qty-btn" onclick="changeQty(${i.id},1)">+</button>

</div>

</div>

<button onclick="removeFromCart(${i.id})">✕</button>

</div>

`).join("");

}

document.getElementById("cartSubtotal").innerText=`R$ ${subtotal.toFixed(2)}`;
document.getElementById("cartDiscount").innerText=`- R$ ${totalDiscount.toFixed(2)}`;
document.getElementById("cartShipping").innerText=shipping===0?"GRÁTIS":`R$ ${shipping.toFixed(2)}`;
document.getElementById("cartTotal").innerText=`R$ ${finalTotal.toFixed(2)}`;

document.getElementById("discountRow").style.display=discount>0?"flex":"none";

}

/* =========================
CARRINHO
========================= */

function toggleCart(){

document.getElementById("cartSidebar").classList.toggle("active");
document.getElementById("cartOverlay").classList.toggle("active");

}

function openCart(){

document.getElementById("cartSidebar").classList.add("active");
document.getElementById("cartOverlay").classList.add("active");

}

function closeCart(){

document.getElementById("cartSidebar").classList.remove("active");
document.getElementById("cartOverlay").classList.remove("active");

}

/* =========================
CUPOM
========================= */

function applyCoupon(){

if(cart.length===0){
showToast("Adicione um produto primeiro");
return;
}

const input=document.getElementById("couponInput").value.toUpperCase();

const coupons={
TECH10:0.10,
MARIA15:0.15,
JOAO20:0.20
};

if(coupons[input]){

discount=coupons[input];

showToast(`Cupom aplicado ${discount*100}%`);

}else{

discount=0;

showToast("Cupom inválido");

}

updateCart();

}

/* =========================
FRETE
========================= */

function calculateShipping(){

const cep=document.getElementById("shippingInput").value;

if(cep.length>=5){

updateCart();

showToast("Frete atualizado");

}else{

showToast("CEP inválido");

}

}

/* =========================
TOAST
========================= */

function showToast(msg){

const t=document.getElementById("toast");

t.innerText=msg;

t.classList.add("show");

setTimeout(()=>{

t.classList.remove("show");

},2500);

}

/* =========================
CHECKOUT
========================= */

function checkout(){

if(cart.length===0){

showToast("Carrinho vazio");

return;

}

let msg="🛒 *NOVO PEDIDO TECHSTORE*%0A%0A";

cart.forEach(i=>{

msg+=`• ${i.name} (${i.qty}x) - R$ ${(i.price*i.qty).toFixed(2)}%0A`;

});

msg+=`%0A💰 Subtotal: ${document.getElementById("cartSubtotal").innerText}`;

if(discount>0)
msg+=`%0A🏷 Desconto: ${document.getElementById("cartDiscount").innerText}`;

msg+=`%0A🚚 Frete: ${document.getElementById("cartShipping").innerText}`;

msg+=`%0A🔥 Total: ${document.getElementById("cartTotal").innerText}`;

window.open(`https://wa.me/5581996646300?text=${msg}`,"_blank");

}

/* =========================
FILTROS
========================= */

function filterCategory(cat,btn){

document.querySelectorAll(".filter-btn").forEach(b=>b.classList.remove("active"));

btn.classList.add("active");

if(cat==="todos") renderProducts(products);

else if(cat==="promo") renderProducts(products.filter(p=>p.promo));

else renderProducts(products.filter(p=>p.category===cat));

}

function filterProducts(){

const term=document.getElementById("searchInput").value.toLowerCase();

const filtered=products.filter(p=>
p.name.toLowerCase().includes(term) ||
p.description.toLowerCase().includes(term)
);

renderProducts(filtered);

}

/* START */

renderProducts(products);

updateCart();
