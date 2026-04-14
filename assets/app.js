
(function(){
const STORAGE_KEY='fuding_demo_db_v1';
const SESSION_KEY='fuding_demo_session_v1';

const seedDB = {
  products: [
    {"id":"p1","name":"白毫银针","category":"高端茶品","price":398,"stock":58,"taste":"清鲜毫香","tag":"礼赠推荐","desc":"芽头肥壮，毫香清雅，适合送礼与高端品鉴。","image":"assets/images/product-yinzhen.svg"},
    {"id":"p2","name":"白牡丹","category":"入门茶品","price":268,"stock":76,"taste":"花香鲜爽","tag":"新手友好","desc":"兼具花香与鲜爽口感，适合初次接触福鼎白茶的用户。","image":"assets/images/product-mudan.svg"},
    {"id":"p3","name":"贡眉","category":"日常口粮","price":168,"stock":93,"taste":"醇和甘润","tag":"日常饮用","desc":"叶张舒展，口感柔和，适合办公与居家冲泡。","image":"assets/images/product-gongmei.svg"},
    {"id":"p4","name":"寿眉饼","category":"陈化收藏","price":218,"stock":42,"taste":"枣香醇厚","tag":"陈化体验","desc":"饼形紧实，适合存放转化，具有收藏与体验价值。","image":"assets/images/product-shoumei.svg"}
  ],
  plans: [
    {"id":"g1","name":"茶山体验认购","area":1,"price":699,"cycle":"1年","benefits":["茶园认购证书","采茶体验日1次","年度认购茶礼盒"],"desc":"适合首次体验认购的用户，以轻量方式参与茶园共建。","image":"assets/images/garden-1.svg"},
    {"id":"g2","name":"亲友共享认购","area":3,"price":1688,"cycle":"1年","benefits":["茶山铭牌展示","采摘与制茶体验2次","专属茶礼2份"],"desc":"适合家庭或朋友共同参与，可共享茶园体验与节庆活动。","image":"assets/images/garden-2.svg"},
    {"id":"g3","name":"文化深度认购","area":5,"price":2999,"cycle":"1年","benefits":["专属茶树编号","非遗工艺研学营名额","年度定制纪念册"],"desc":"适合偏爱文化深度体验的用户，突出非遗工艺学习与长期陪伴。","image":"assets/images/garden-3.svg"}
  ],
  posts: [
    {"id":"t1","userId":"seed_admin","author":"茶山管理员","title":"第一次喝白茶，应该从哪一款开始？","content":"如果你偏好清鲜口感，可以从白牡丹开始；如果更在意毫香与礼赠感受，可尝试白毫银针。欢迎大家分享自己的入门路线。","tags":["入门","茶品推荐"],"likes":8,"createdAt":"2026-04-10 09:10","comments":[{"id":"c1","author":"山风","content":"我也是先喝白牡丹，再慢慢接触陈年寿眉。","createdAt":"2026-04-10 12:35"}]},
    {"id":"t2","userId":"seed_admin","author":"福鼎茶旅志","title":"认购茶园以后，最值得参加的活动有哪些？","content":"建议优先参加春季采茶体验和秋季工艺开放日，这两类活动既能感受茶山，又能了解萎凋、干燥等传统工艺。","tags":["茶园认购","茶旅活动"],"likes":13,"createdAt":"2026-04-11 16:20","comments":[{"id":"c2","author":"白茶客","content":"开放日的制茶体验很有意思，还能带走自己的小样茶。","createdAt":"2026-04-11 18:06"}]}
  ],
  users: [
    {
      "id": "seed_admin",
      "username": "admin",
      "passwordHash": "demo_admin",
      "role": "admin",
      "nickname": "茶山管理员",
      "favorites": ["p1","p2"],
      "history": ["culture","shop"],
      "cart": [],
      "orders": [],
      "subscriptions": [],
      "posts": ["t1","t2"]
    },
    {
      "id": "u_demo1",
      "username": "demo1",
      "passwordHash": "",
      "role": "user",
      "nickname": "测试用户",
      "favorites": ["p2"],
      "history": ["garden","shop","forum"],
      "cart": [],
      "orders": [
        {
          "id": "o_seed_1",
          "items": [{"productId":"p2","qty":2}],
          "total": 536,
          "consignee": "测试用户",
          "status": "已支付",
          "createdAt": "2026-04-14 09:35:17"
        }
      ],
      "subscriptions": [
        {
          "id": "sub_seed_1",
          "planId": "g1",
          "planName": "茶山体验认购",
          "teaTreeCode": "FD-9040",
          "status": "认购成功",
          "createdAt": "2026-04-14 09:35:17",
          "ownerNote": "期待春季采茶"
        }
      ],
      "posts": []
    }
  ]
};

const store={db:null,session:null};

const fmtMoney=n=>`¥${Number(n).toFixed(0)}`;
const currentPage=()=>document.body.dataset.page || 'index';
const byId=id=>document.getElementById(id);

function clone(x){return JSON.parse(JSON.stringify(x));}
function loadDB(){
  const raw=localStorage.getItem(STORAGE_KEY);
  if(raw){
    try { return JSON.parse(raw); } catch(e){}
  }
  const db=clone(seedDB);
  db.users.forEach(u=>{ if(u.username==='demo1') u.passwordHash=hashPassword('123456'); });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
  return db;
}
function saveDB(){ localStorage.setItem(STORAGE_KEY, JSON.stringify(store.db)); }
function loadSession(){
  const raw=localStorage.getItem(SESSION_KEY);
  if(!raw) return null;
  try { return JSON.parse(raw); } catch(e){ return null; }
}
function saveSession(user){
  if(user) localStorage.setItem(SESSION_KEY, JSON.stringify({id:user.id, username:user.username}));
  else localStorage.removeItem(SESSION_KEY);
  store.session = user ? getUserById(user.id) : null;
}
function hashPassword(str){
  // lightweight stable hash for demo
  let h=2166136261;
  for(let i=0;i<str.length;i++){ h ^= str.charCodeAt(i); h += (h<<1)+(h<<4)+(h<<7)+(h<<8)+(h<<24); }
  return ('0000000'+(h>>>0).toString(16)).slice(-8);
}
function nowString(){ return new Date().toLocaleString('zh-CN',{hour12:false}); }
function randId(prefix){ return `${prefix}_${Math.random().toString(16).slice(2,10)}`; }
function getUserById(id){ return store.db.users.find(u=>u.id===id) || null; }
function getSessionUser(){
  const s=loadSession();
  if(!s) return null;
  return getUserById(s.id);
}
function getProduct(id){ return store.db.products.find(p=>p.id===id); }
function getPlan(id){ return store.db.plans.find(p=>p.id===id); }
function toast(msg){
  const el=byId('toast');
  if(!el){ alert(msg); return; }
  el.textContent=msg;
  el.classList.remove('hidden');
  setTimeout(()=>el.classList.add('hidden'),2200);
}
function requireLogin(){ if(!store.session){ location.href='login.html'; return false; } return true; }
function logout(){ saveSession(null); toast('已退出登录'); setTimeout(()=>location.href='index.html',400); }
function trackPage(page){
  if(!store.session) return;
  const arr=store.session.history || (store.session.history=[]);
  arr.push(page);
  if(arr.length>20) arr.splice(0, arr.length-20);
  saveDB();
}
function preferredTag(user){
  const map = interestMap(user);
  let best='文化展示', bestVal=-1;
  Object.entries(map).forEach(([k,v])=>{ if(v>bestVal){ best=k; bestVal=v; } });
  return best;
}
function interestMap(user){
  const map={'文化展示':0,'茶品消费':0,'茶园认购':0,'论坛互动':0};
  (user?.history||[]).forEach(page=>{
    if(page==='culture') map['文化展示']+=2;
    if(page==='shop') map['茶品消费']+=2;
    if(page==='garden') map['茶园认购']+=2;
    if(page==='forum') map['论坛互动']+=2;
    if(page==='profile') map['文化展示']+=1;
  });
  (user?.favorites||[]).forEach(pid=>{
    const p=getProduct(pid); 
    if(!p) return;
    map['茶品消费'] += p.category.includes('高端') ? 2 : 1;
    if(p.tag.includes('礼赠') || p.tag.includes('陈化')) map['文化展示'] += 1;
  });
  (user?.orders||[]).forEach(()=>map['茶品消费']+=2);
  (user?.subscriptions||[]).forEach(()=>{ map['茶园认购']+=3; map['文化展示']+=1; });
  (user?.posts||[]).forEach(()=>map['论坛互动']+=2);
  return map;
}
function getRecommendations(user){
  if(!user){
    return {
      preferredTag:'综合浏览',
      products: store.db.products.slice(0,2),
      plans: store.db.plans.slice(0,2)
    };
  }
  const map=interestMap(user);
  let products = clone(store.db.products);
  if(map['茶品消费']>=map['文化展示'] && map['茶品消费']>=map['茶园认购']){
    products.sort((a,b)=> b.price-a.price);
  } else if(map['茶园认购']>=map['茶品消费']) {
    products.sort((a,b)=> (a.tag.includes('礼赠')?1:0) - (b.tag.includes('礼赠')?1:0));
  } else {
    products.sort((a,b)=> (a.tag.includes('陈化')? -1:1));
  }
  let plans = clone(store.db.plans);
  if(map['茶园认购']>1) plans.sort((a,b)=>b.area-a.area);
  else plans.sort((a,b)=>a.price-b.price);
  return {preferredTag: preferredTag(user), products:products.slice(0,2), plans:plans.slice(0,2)};
}
function cartItems(user){
  return (user.cart||[]).map(i=>({qty:i.qty, product:getProduct(i.productId)})).filter(i=>i.product);
}
function ensureCart(user){ if(!user.cart) user.cart=[]; return user.cart; }
function findPost(id){ return store.db.posts.find(p=>p.id===id); }

function paintCommon(){
  document.querySelectorAll('[data-nav]').forEach(a=>{if(a.dataset.nav===currentPage()) a.classList.add('active');});
  const authSlot=byId('auth-slot');
  if(authSlot){
    authSlot.innerHTML = store.session
      ? `<a class="btn-outline" href="${store.session.role==='admin'?'admin.html':'profile.html'}">${store.session.nickname || store.session.username}</a><button class="btn" id="logoutBtn">退出</button>`
      : `<a class="btn-outline" href="login.html">登录 / 注册</a>`;
    byId('logoutBtn')?.addEventListener('click', logout);
  }
  if(store.session) trackPage(currentPage());
}
function productCard(p, favorites=[]){
  const fav=favorites.includes(p.id);
  return `<article class="product-card"><img src="${p.image}" alt="${p.name}"><div class="card-body"><div class="meta-row"><span class="badge">${p.category}</span><span>${p.tag}</span></div><h3>${p.name}</h3><p class="small">${p.desc}</p><div class="meta-row"><strong class="price">${fmtMoney(p.price)}</strong><span>${p.taste}</span></div><div class="toolbar"><button class="btn" data-add-cart="${p.id}">加入购物车</button><button class="btn-outline" data-favorite="${p.id}">${fav?'已收藏':'收藏'}</button></div></div></article>`;
}
function planCard(p){
  return `<article class="plan-card"><img src="${p.image}" alt="${p.name}"><div class="card-body"><div class="meta-row"><span class="badge">${p.area} 亩认购</span><span>${p.cycle}</span></div><h3>${p.name}</h3><p class="small">${p.desc}</p><div class="tag-list">${p.benefits.map(b=>`<span class="tag">${b}</span>`).join('')}</div><div class="meta-row"><strong class="price">${fmtMoney(p.price)}</strong><button class="btn" data-subscribe="${p.id}">立即认购</button></div></div></article>`;
}
function bindProductActions(scope=document){
  scope.querySelectorAll('[data-add-cart]').forEach(btn=>btn.onclick=()=>{
    if(!requireLogin()) return;
    const productId=btn.dataset.addCart;
    const cart=ensureCart(store.session);
    const item=cart.find(i=>i.productId===productId);
    if(item) item.qty += 1; else cart.push({productId, qty:1});
    saveDB(); toast('已加入购物车'); loadCart();
  });
  scope.querySelectorAll('[data-favorite]').forEach(btn=>btn.onclick=()=>{
    if(!requireLogin()) return;
    store.session.favorites = store.session.favorites || [];
    const pid=btn.dataset.favorite;
    const idx=store.session.favorites.indexOf(pid);
    if(idx>=0) store.session.favorites.splice(idx,1); else store.session.favorites.push(pid);
    saveDB();
    btn.textContent = store.session.favorites.includes(pid) ? '已收藏' : '收藏';
    toast('收藏状态已更新');
  });
}
function bindPlanActions(scope=document){
  scope.querySelectorAll('[data-subscribe]').forEach(btn=>btn.onclick=()=>{
    if(!requireLogin()) return;
    const input=byId('selectedPlan');
    if(input) input.value = btn.dataset.subscribe;
    byId('subscribePanel')?.scrollIntoView({behavior:'smooth'});
    toast('已为你选中认购方案');
  });
}
function renderHome(){
  const products=store.db.products, posts=store.db.posts, plans=store.db.plans;
  byId('home-products').innerHTML = products.slice(0,3).map(p=>productCard(p, store.session?.favorites||[])).join('');
  byId('home-posts').innerHTML = posts.slice(0,2).map(p=>`<article class="post-card"><div class="card-body"><div class="meta-row"><span class="badge">${(p.tags||[])[0]||'讨论'}</span><span>${p.createdAt}</span></div><h3>${p.title}</h3><p class="small">${p.content}</p><div class="meta-row"><span>👍 ${p.likes}</span><span>💬 ${(p.comments||[]).length}</span></div></div></article>`).join('');
  byId('home-plans').innerHTML = plans.map(planCard).join('');
  const rec = getRecommendations(store.session);
  byId('recommendation-box').innerHTML = `<div class="notice">系统根据当前浏览与交互行为，识别你更关注<strong>${rec.preferredTag}</strong>方向内容，优先推荐${rec.products.map(p=>p.name).join('、')}以及${rec.plans.map(p=>p.name).join('、')}。</div>`;
  bindProductActions(); bindPlanActions();
}
function renderCulture(){
  const box=byId('culture-track');
  if(box) box.innerHTML = `<div class="notice">本页以国家级非遗“白茶制作技艺（福鼎白茶制作技艺）”为线索，整合历史、工艺、茶品和文旅场景，形成可浏览、可消费、可互动的数字展示路径。</div>`;
}
function renderShop(){
  const products=store.db.products;
  const grid=byId('product-grid'), search=byId('searchInput'), filter=byId('categoryFilter');
  const paint=()=>{
    const kw=(search.value||'').trim();
    const cat=filter.value;
    const list=products.filter(p=>(!kw || p.name.includes(kw) || p.desc.includes(kw) || p.tag.includes(kw)) && (!cat || p.category===cat));
    grid.innerHTML=list.map(p=>productCard(p, store.session?.favorites||[])).join('');
    bindProductActions(grid);
  };
  search.oninput=paint; filter.onchange=paint; paint();
  byId('checkoutBtn').onclick=()=>{
    if(!requireLogin()) return;
    const consignee=byId('consignee').value.trim();
    const cart=cartItems(store.session);
    if(!cart.length) return toast('购物车暂时为空');
    if(!consignee) return toast('请输入收货人姓名');
    const order = {
      id: randId('o'),
      items: (store.session.cart||[]).map(i=>clone(i)),
      total: cart.reduce((s,i)=>s+i.product.price*i.qty,0),
      consignee,
      status:'已支付',
      createdAt: nowString()
    };
    store.session.orders = store.session.orders || [];
    store.session.orders.unshift(order);
    store.session.cart = [];
    saveDB();
    loadCart();
    toast('订单已生成，购物车已清空');
    setTimeout(()=>location.href='profile.html',700);
  };
  loadCart();
}
function loadCart(){
  const cartBox=byId('cartTable'); if(!cartBox) return;
  if(!store.session){ cartBox.innerHTML='<div class="notice">登录后可将白茶商品加入购物车，形成消费数据与推荐依据。</div>'; return; }
  const items=cartItems(store.session);
  if(!items.length){ cartBox.innerHTML='<div class="notice">购物车暂时为空，先去挑选一款合适的白茶吧。</div>'; return; }
  const total=items.reduce((s,i)=>s+i.product.price*i.qty,0);
  cartBox.innerHTML=`<table class="table"><thead><tr><th>茶品</th><th>单价</th><th>数量</th><th class="right">小计</th></tr></thead><tbody>${items.map(i=>`<tr><td>${i.product.name}</td><td>${fmtMoney(i.product.price)}</td><td>${i.qty}</td><td class="right">${fmtMoney(i.product.price*i.qty)}</td></tr>`).join('')}</tbody></table><div class="right"><strong class="price">总计 ${fmtMoney(total)}</strong></div>`;
}
function renderGarden(){
  byId('planGrid').innerHTML = store.db.plans.map(planCard).join('');
  bindPlanActions();
  byId('subscribeForm').onsubmit=(e)=>{
    e.preventDefault();
    if(!requireLogin()) return;
    const planId = byId('selectedPlan').value || store.db.plans[0].id;
    const note = byId('ownerNote').value.trim();
    const plan = getPlan(planId);
    if(!plan) return toast('请选择有效认购方案');
    const subscription = {
      id: randId('sub'),
      planId,
      planName: plan.name,
      teaTreeCode: 'FD-' + String(Math.floor(Math.random()*9000+1000)),
      status: '认购成功',
      createdAt: nowString(),
      ownerNote: note
    };
    store.session.subscriptions = store.session.subscriptions || [];
    store.session.subscriptions.unshift(subscription);
    saveDB();
    byId('subscribeResult').innerHTML = `<div class="notice">你已成功认购 <strong>${subscription.planName}</strong>，专属茶树编号为 <strong>${subscription.teaTreeCode}</strong>，系统已同步更新个人中心中的认购记录。</div>`;
    toast(`认购成功，专属茶树编号 ${subscription.teaTreeCode}`);
    e.target.reset();
  };
}
function renderForum(){
  const postsWrap=byId('postList');
  const paint=()=>{
    postsWrap.innerHTML = store.db.posts.map(p=>`<article class="post-card"><div class="card-body"><div class="meta-row"><span>${p.author}</span><span>${p.createdAt}</span></div><h3>${p.title}</h3><div class="tag-list">${(p.tags||[]).map(t=>`<span class="tag">#${t}</span>`).join('')}</div><p class="small">${p.content}</p><div class="meta-row"><span>👍 ${p.likes}</span><span>💬 ${(p.comments||[]).length}</span></div><div class="toolbar"><button class="btn-outline" data-like="${p.id}">点赞</button><button class="btn-outline" data-comment-target="${p.id}">评论</button></div><div id="comments-${p.id}">${(p.comments||[]).map(c=>`<div class="comment"><strong>${c.author}</strong>：${c.content}</div>`).join('')}</div><div class="hidden" id="commentBox-${p.id}"><div class="toolbar"><input class="input" id="commentInput-${p.id}" placeholder="写下你的看法"><button class="btn" data-submit-comment="${p.id}">发送</button></div></div></div></article>`).join('');
  };
  paint();
  postsWrap.addEventListener('click', (e)=>{
    const like=e.target.dataset.like, target=e.target.dataset.commentTarget, submit=e.target.dataset.submitComment;
    if(like){
      const post=findPost(like); if(post){ post.likes += 1; saveDB(); paint(); toast('已点赞'); }
    }
    if(target){
      if(!requireLogin()) return;
      byId(`commentBox-${target}`).classList.toggle('hidden');
    }
    if(submit){
      if(!requireLogin()) return;
      const input=byId(`commentInput-${submit}`);
      const content=input.value.trim();
      if(!content) return toast('请输入评论内容');
      const post=findPost(submit);
      post.comments = post.comments || [];
      post.comments.push({id:randId('c'), author:store.session.nickname || store.session.username, content, createdAt:nowString()});
      saveDB(); paint(); toast('评论成功');
    }
  });
  byId('postForm').onsubmit=(e)=>{
    e.preventDefault();
    if(!requireLogin()) return;
    const title=byId('postTitle').value.trim();
    const tags=byId('postTags').value.trim();
    const content=byId('postContent').value.trim();
    if(!title || !content) return toast('请完整填写帖子信息');
    const post={id:randId('t'), userId:store.session.id, author:store.session.nickname || store.session.username, title, content, tags:tags?tags.split(/\s+/).slice(0,4):['交流'], likes:0, createdAt:nowString(), comments:[]};
    store.db.posts.unshift(post);
    store.session.posts = store.session.posts || [];
    store.session.posts.unshift(post.id);
    saveDB();
    e.target.reset();
    paint();
    toast('帖子已发布');
  };
}
function renderProfile(){
  const panel=byId('profilePanel');
  if(!store.session){ panel.innerHTML='<div class="notice">请先登录，再查看你的订单、收藏、认购和论坛互动记录。</div>'; return; }
  const m = {
    favoriteCount: (store.session.favorites||[]).length,
    orderCount: (store.session.orders||[]).length,
    subscriptionCount: (store.session.subscriptions||[]).length,
    postCount: (store.session.posts||[]).length,
    interestMap: interestMap(store.session)
  };
  const rec = getRecommendations(store.session);
  const favorites = (store.session.favorites||[]).map(getProduct).filter(Boolean);
  const myPosts = (store.session.posts||[]).map(findPost).filter(Boolean);
  panel.innerHTML=`<div class="profile-shell"><aside class="card"><h2>${store.session.nickname}</h2><p class="small">账号：${store.session.username}</p><div class="grid-2"><div class="metric"><strong>${m.favoriteCount}</strong><span>收藏茶品</span></div><div class="metric"><strong>${m.orderCount}</strong><span>消费订单</span></div><div class="metric"><strong>${m.subscriptionCount}</strong><span>茶园认购</span></div><div class="metric"><strong>${m.postCount}</strong><span>社区帖子</span></div></div><div class="section"><h3>兴趣画像</h3><div class="chart">${Object.entries(m.interestMap).map(([k,v])=>`<div class="bar-row"><span>${k}</span><div class="bar"><span style="width:${Math.min(100,v*16+12)}%"></span></div><strong>${v}</strong></div>`).join('')}</div></div></aside><section class="grid-2"><div class="card"><div class="panel-title"><h3>推荐茶品</h3><span class="subtle">依据浏览、收藏、订单与认购行为生成</span></div>${rec.products.map(p=>`<div class="comment"><strong>${p.name}</strong> · ${p.taste}</div>`).join('')}</div><div class="card"><div class="panel-title"><h3>推荐认购</h3><span class="subtle">结合文化体验倾向</span></div>${rec.plans.map(p=>`<div class="comment"><strong>${p.name}</strong> · ${p.area}亩</div>`).join('')}</div><div class="card"><div class="panel-title"><h3>我的订单</h3></div>${(store.session.orders||[]).length?(store.session.orders).map(o=>`<div class="comment"><strong>${o.id}</strong> · ${fmtMoney(o.total)} · ${o.status}</div>`).join(''):'<div class="small">暂无订单</div>'}</div><div class="card"><div class="panel-title"><h3>我的认购</h3></div>${(store.session.subscriptions||[]).length?(store.session.subscriptions).map(s=>`<div class="comment"><strong>${s.planName}</strong> · 茶树编号 ${s.teaTreeCode}</div>`).join(''):'<div class="small">暂无认购记录</div>'}</div><div class="card"><div class="panel-title"><h3>收藏茶品</h3></div>${favorites.length?favorites.map(f=>`<div class="comment"><strong>${f.name}</strong> · ${f.tag}</div>`).join(''):'<div class="small">暂无收藏</div>'}</div><div class="card"><div class="panel-title"><h3>我的帖子</h3></div>${myPosts.length?myPosts.map(p=>`<div class="comment"><strong>${p.title}</strong> · 👍${p.likes}</div>`).join(''):'<div class="small">还没有发帖，去论坛写下第一条体验吧。</div>'}</div></section></div>`;
}
function renderLogin(){
  byId('loginForm').onsubmit=(e)=>{
    e.preventDefault();
    const username=byId('loginUsername').value.trim();
    const password=byId('loginPassword').value;
    const user=store.db.users.find(u=>u.username===username);
    if(!user) return toast('用户名不存在');
    const ok = user.username==='admin' ? password==='admin123' : user.passwordHash===hashPassword(password);
    if(!ok) return toast('密码错误');
    saveSession(user);
    toast('登录成功');
    setTimeout(()=>location.href=(user.role==='admin'?'admin.html':'profile.html'),500);
  };
  byId('registerForm').onsubmit=(e)=>{
    e.preventDefault();
    const nickname=byId('regNickname').value.trim();
    const username=byId('regUsername').value.trim();
    const password=byId('regPassword').value;
    if(!nickname || !username || !password) return toast('请完整填写注册信息');
    if(store.db.users.some(u=>u.username===username)) return toast('用户名已存在');
    const user={id:randId('u'), username, passwordHash:hashPassword(password), role:'user', nickname, favorites:[], history:['index'], cart:[], orders:[], subscriptions:[], posts:[]};
    store.db.users.push(user);
    saveDB();
    toast('注册成功，请登录');
    e.target.reset();
  };
}
function renderAdmin(){
  const box=byId('adminPanel');
  if(!store.session || store.session.role!=='admin'){
    box.innerHTML='<div class="notice">请使用管理员账号登录后查看后台概览。</div>';
    return;
  }
  const users = store.db.users.filter(u=>u.role==='user');
  const orders = users.flatMap(u=>u.orders||[]);
  const subscriptions = users.flatMap(u=>u.subscriptions||[]);
  const posts = store.db.posts;
  box.innerHTML = `
    <div class="grid-4">
      <div class="metric"><strong>${store.db.users.length}</strong><span>用户总数</span></div>
      <div class="metric"><strong>${orders.length}</strong><span>订单总数</span></div>
      <div class="metric"><strong>${posts.length}</strong><span>帖子总数</span></div>
      <div class="metric"><strong>${subscriptions.length}</strong><span>认购总数</span></div>
    </div>
    <section class="section grid-2">
      <div class="card"><div class="panel-title"><h2>最新订单</h2></div>${orders.length ? orders.slice(0,5).map(o => `<div class="comment"><strong>${o.id}</strong> · ${o.status} · ${fmtMoney(o.total)}</div>`).join('') : '<div class="small">暂无订单</div>'}</div>
      <div class="card"><div class="panel-title"><h2>最新认购</h2></div>${subscriptions.length ? subscriptions.slice(0,5).map(s => `<div class="comment"><strong>${s.planName}</strong> · 茶树编号 ${s.teaTreeCode}</div>`).join('') : '<div class="small">暂无认购</div>'}</div>
      <div class="card"><div class="panel-title"><h2>热门茶品</h2></div>${store.db.products.map(p=>`<div class="comment"><strong>${p.name}</strong> · 库存 ${p.stock}</div>`).join('')}</div>
      <div class="card"><div class="panel-title"><h2>社区活跃话题</h2></div>${posts.slice(0,5).map(p=>`<div class="comment"><strong>${p.title}</strong> · 👍${p.likes} · 💬${(p.comments||[]).length}</div>`).join('')}</div>
    </section>`;
}
function boot(){
  store.db = loadDB();
  store.session = getSessionUser();
  paintCommon();
  const page=currentPage();
  if(page==='index') renderHome();
  if(page==='culture') renderCulture();
  if(page==='shop') renderShop();
  if(page==='garden') renderGarden();
  if(page==='forum') renderForum();
  if(page==='profile') renderProfile();
  if(page==='login') renderLogin();
  if(page==='admin') renderAdmin();
}
window.addEventListener('DOMContentLoaded', boot);
})();
