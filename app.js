const $=s=>document.querySelector(s);let products=[],categories=[],cart=[];
async function api(action,opts={}){const r=await fetch(`/api?action=${action}`,opts);const d=await r.json();if(!r.ok)throw Error(d.error||"Something went wrong");return d}
function money(n){return "₹"+Number(n).toLocaleString("en-IN")}
function renderCats(){const el=$("#categories");el.innerHTML=`<button class="chip active" data-cat="">All</button>`+categories.map(c=>`<button class="chip" data-cat="${esc(c)}">${esc(c)}</button>`).join("");el.querySelectorAll(".chip").forEach(b=>b.onclick=()=>{el.querySelectorAll(".chip").forEach(x=>x.classList.remove("active"));b.classList.add("active");renderProducts(b.dataset.cat)})}
function renderProducts(cat=""){const q=($("#search").value||"").toLowerCase();const list=products.filter(p=>(!cat||p.category===cat)&&(!q||`${p.name} ${p.category} ${p.description}`.toLowerCase().includes(q)));$("#products").innerHTML=list.map(p=>`<article class="product"><div class="product-img">${p.image?`<img src="${esc(p.image)}" alt="${esc(p.name)}">`:"✦"}</div><div class="product-body"><h3>${esc(p.name)}</h3><div class="meta">${esc(p.category)}${p.size?" · "+esc(p.size):""}</div><div class="price">${money(p.price)}</div><button onclick="addCart('${p.id}')">Add to cart</button></div></article>`).join("");$("#empty").classList.toggle("hidden",!list.length)}
function addCart(id){const p=products.find(x=>x.id===id);const x=cart.find(x=>x.id===id);if(x)x.qty++;else cart.push({id:p.id,name:p.name,price:p.price,qty:1});renderCart()}
function removeCart(id){cart=cart.filter(x=>x.id!==id);renderCart()}
function renderCart(){const el=$("#cartItems");if(!cart.length){el.textContent="Your cart is empty.";$("#cartTotal").textContent="₹0";return}el.innerHTML=cart.map(x=>`<div class="cart-line"><span>${esc(x.name)} × ${x.qty}</span><b>${money(x.price*x.qty)} <button onclick="removeCart('${x.id}')">×</button></b></div>`).join("");$("#cartTotal").textContent=money(cart.reduce((s,x)=>s+x.price*x.qty,0))}
$("#search").oninput=()=>renderProducts(document.querySelector(".chip.active")?.dataset.cat||"");
$("#lookupBtn").onclick=async()=>{const p=$("#phoneLookup").value.trim();const out=$("#customerResult");try{const d=await api(`customer&phone=${encodeURIComponent(p)}`);const c=d.customer;out.innerHTML=`<div class="success"><b>${c.name||"Customer"}</b><br>Loyalty points: <strong>${c.points||0}</strong><br>Scratch cards earned: ${c.scratchCards?.length||0}</div>`}catch(e){out.innerHTML=`<div class="error">${e.message}</div>`}};
$("#orderBtn").onclick=async()=>{
  const msg=$("#orderMsg");
  if(!cart.length){msg.innerHTML='<div class="error">Please add at least one product.</div>';return}
  const amount=cart.reduce((s,x)=>s+x.price*x.qty,0);
  const payload={name:$("#orderName").value.trim(),phone:$("#orderPhone").value.trim(),pincode:$("#orderPin").value.trim(),address:$("#orderAddress").value.trim(),amount,items:cart};
  if(!payload.name||payload.phone.length!==10||payload.address.length<10){msg.innerHTML='<div class="error">Name, 10-digit mobile number and full address are required.</div>';return}
  if(payload.pincode!=="845107"){msg.innerHTML='<div class="error">Online delivery is available only in PIN 845107.</div>';return}
  if(amount<500){msg.innerHTML='<div class="error">Minimum online order is ₹500.</div>';return}
  try{
    msg.innerHTML='<div>Creating secure payment…</div>';
    const d=await api("create-payment-order",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify(payload)});
    const options={key:d.keyId,amount:Math.round(d.amount*100),currency:"INR",name:"Saheli Bherayti Store",description:"Online order "+d.orderId,order_id:d.razorpayOrderId,prefill:{name:payload.name,contact:payload.phone},notes:{order_id:d.orderId},theme:{color:"#e62b83"},handler:async function(response){
      try{
        const v=await api("verify-payment",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify(response)});
        msg.innerHTML=`<div class="success">Payment successful ✅<br>Order <b>${v.order.id}</b> is awaiting store confirmation. Loyalty points will be added only after confirmation.</div>`;
        cart=[];renderCart();
      }catch(e){msg.innerHTML=`<div class="error">Payment was received but verification failed: ${e.message}. Please contact the store with your payment details.</div>`}
    },modal:{ondismiss:function(){msg.innerHTML='<div class="error">Payment window closed. Your order is still pending payment.</div>'}}};
    const rzp=new Razorpay(options); rzp.on('payment.failed',function(r){msg.innerHTML=`<div class="error">Payment failed. ${esc(r.error?.description||'Please try again.')}</div>`}); rzp.open();
  }catch(e){msg.innerHTML=`<div class="error">${e.message}</div>`}
}
function esc(v){return String(v??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}
(async()=>{try{const [p,c]=await Promise.all([api("products"),api("categories")]);products=p.products;categories=c.categories;renderCats();renderProducts()}catch(e){$("#products").innerHTML=`<div class="error">${e.message}</div>`}})();$("#year").textContent=new Date().getFullYear();
