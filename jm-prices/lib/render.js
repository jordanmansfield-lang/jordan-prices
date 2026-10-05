import { SITE_CSS } from "./site-css.js";

export const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
export const imgUrl = (id, size, v) => `/img/v${v}/${encodeURIComponent(id)}-${size}.jpg`;
export const gbp = (n) => "£" + Number(n || 0).toLocaleString("en-GB");
const nl2br = (s) => esc(s).replace(/\n/g, "<br>");

function imgTag(id, alt, v, { sizes = "100vw", lazy = true, extra = "" } = {}) {
  if (!id) return "";
  const s = imgUrl(id, "s", v), l = imgUrl(id, "l", v);
  return `<img src="${s}" srcset="${s} 900w, ${l} 2000w" sizes="${sizes}" alt="${esc(alt)}"${lazy ? ' loading="lazy"' : ' fetchpriority="high"'} ${extra}>`;
}

const clampPct = (n) => (Number.isFinite(+n) ? Math.max(0, Math.min(100, +n)) : 50);
// The part of a photo to keep in frame when object-fit:cover crops it, from the admin-set focus point.
const focusAttr = (c, id) => {
  const f = c.imageFocus && c.imageFocus[id];
  return f ? `style="object-position:${clampPct(f.x)}% ${clampPct(f.y)}%"` : "";
};

const EXTRA_CSS = `
.enq{display:grid;gap:12px}
.details textarea{font:inherit;font-size:.95rem;color:var(--ink);background:var(--paper);border:1px solid var(--line);padding:11px 12px;width:100%;min-width:0;min-height:96px;resize:vertical}
.details textarea:focus{border-color:var(--sage);outline:none}
.req{color:var(--sage)}
.err{font-size:.82rem;color:#b3261e;min-height:1.2em}
.hp{position:absolute;left:-9999px;width:1px;height:1px;overflow:hidden}
.thanks{display:grid;gap:12px;border:1px solid var(--sage);background:var(--sage-soft);padding:20px}
.thanks h4{margin:0;font-family:var(--display);font-weight:400;letter-spacing:.12em;text-transform:uppercase;font-size:1.05rem}
.btn[disabled]{opacity:.55;cursor:progress}
`;

export function renderPage(c, v) {
  const S = c.site || {};
  const pk = c.packages || [];
  const ex = c.extras || {};
  const fe = ex.filmExtras || [];
  const ad = ex.addOns || [];

  const packages = pk.map((p, i) => {
    const pos = String(p.panelPosition || "");
    const cls = ["spread", pos.includes("right") ? "right" : "", pos.includes("bottom") ? "low" : ""].join(" ").trim();
    const chapter = p.chapterTitle ? `<div class="chapter wrap">${i === 0 && c.packagesIntro?.eyebrow ? `<div class="eyebrow">${esc(c.packagesIntro.eyebrow)}</div>` : ""}<h2 class="title">${esc(p.chapterTitle)}</h2>${p.chapterPrice ? `<div class="price">${esc(p.chapterPrice)}</div>` : ""}</div>` : "";
    return `${chapter}
  <div class="${cls}">
    ${imgTag(p.image, p.alt, v, { extra: focusAttr(c, p.image) })}
    <div class="card">
      <h3>${esc(p.name)}</h3>
      ${p.lede ? `<p class="lede">${esc(p.lede)}</p>` : ""}
      <ul>${(p.items || []).map((t) => `<li>${esc(t)}</li>`).join("")}</ul>
      <div class="price">${p.priceIsFrom ? "from " : ""}£${esc(p.price)}</div>
      <div class="acts">
        <button class="btn" type="button" data-pick="${i}">Customise this</button>
        ${p.linkText && p.linkUrl ? `<a class="tlink" href="${esc(p.linkUrl)}" target="_blank" rel="noopener">${esc(p.linkText)} ↗</a>` : ""}
      </div>
    </div>
  </div>`;
  }).join("\n");

  const builderData = {
    packages: pk.map((p) => ({ name: p.name, price: +p.price || 0, from: !!p.priceIsFrom, film: !!p.includesFilm })),
    film: fe.map((f) => ({ name: f.name, price: +f.price || 0 })),
    addOns: ad.map((a) => ({ name: a.name, price: +a.price || 0, from: !!a.priceIsFrom })),
    droneLine: ex.drone?.builderLine || ""
  };

  return `<!doctype html>
<html lang="en-GB">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>${esc(S.pageTitle)}</title>
<meta name="description" content="${esc(S.metaDescription)}">
<meta property="og:title" content="${esc(S.pageTitle)}">
<meta property="og:description" content="${esc(S.metaDescription)}">
${c.hero?.image ? `<meta property="og:image" content="${imgUrl(c.hero.image, "l", v)}">` : ""}
${S.favicon ? `<link rel="icon" type="image/jpeg" href="${imgUrl(S.favicon, "s", v)}">
<link rel="apple-touch-icon" href="${imgUrl(S.favicon, "s", v)}">` : ""}
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Marcellus&family=Quicksand:wght@300;400;500;600&family=Spectral:ital,wght@0,300;1,300;1,400&display=swap">
<style>${SITE_CSS}${EXTRA_CSS}</style>
</head>
<body>
<nav class="nav" aria-label="Sections">
  <div class="wrap">
    <a class="mark spaced" href="#top">${esc(S.name)}</a>
    <button class="navbtn" type="button" id="navbtn" aria-expanded="false" aria-controls="navlist" aria-label="Open menu">
      <span></span><span></span><span></span>
    </button>
    <ul id="navlist">
      <li><a class="l" href="#about">About</a></li>
      <li><a class="l" href="#packages">Packages</a></li>
      <li><a class="l" href="#build">Build your day</a></li>
      <li><a class="l" href="#films">Films</a></li>
      <li><a class="l" href="#gallery">Gallery</a></li>
      <li><a class="l" href="#kindwords">Kind words</a></li>
      <li><a class="l" href="#build">Enquire</a></li>
    </ul>
  </div>
</nav>

<header class="hero" id="top">
  ${imgTag(c.hero?.image, c.hero?.alt, v, { lazy: false, extra: focusAttr(c, c.hero?.image) })}
  <div class="over">
    <h1>${esc(c.hero?.title)}</h1>
    <div class="sub">${esc(c.hero?.subtitle)}</div>
    <div class="yr">${esc(c.hero?.year)}</div>
  </div>
</header>

<main>
<section id="about" class="block">
  <div class="wrap">
    <div class="about">
      <figure>
        ${imgTag(c.about?.image, c.about?.alt, v, { sizes: "(max-width:820px) 100vw, 45vw", extra: focusAttr(c, c.about?.image) })}
        ${c.about?.caption ? `<figcaption>${esc(c.about.caption)}</figcaption>` : ""}
      </figure>
      <div class="text">
        <div class="eyebrow">${esc(c.about?.eyebrow)}</div>
        <h2 class="title">${esc(c.about?.heading)}</h2>
        <div class="prose">${(c.about?.paragraphs || []).map((p) => `<p>${nl2br(p)}</p>`).join("")}</div>
      </div>
    </div>
    ${(c.facts || []).length ? `<div class="facts" aria-label="At a glance">${c.facts.map((f) => `<div><b>${esc(f.big)}</b><span>${esc(f.small)}</span></div>`).join("")}</div>` : ""}
  </div>
</section>

<section class="block" style="padding-top:0">
  <div class="wrap style">
    <div style="display:grid;gap:22px;min-width:0">
      <div class="eyebrow">${esc(c.style?.eyebrow)}</div>
      <p class="pull">“${esc(c.style?.quote)}”<small>${esc(c.style?.quoteNote)}</small></p>
    </div>
    <div class="prose">${(c.style?.paragraphs || []).map((p) => `<p>${nl2br(p)}</p>`).join("")}</div>
  </div>
</section>

<section id="packages">
${packages}
</section>

<section class="block" style="padding-top:clamp(20px,3vw,40px)">
  <div class="wrap">
    <div class="chapter" style="padding-top:0">
      <div class="eyebrow">${esc(ex.eyebrow)}</div>
      <h2 class="title">${esc(ex.heading)}</h2>
    </div>
    <div class="extras">
      ${fe.length ? `<div class="col">
        <h3>${esc(ex.filmHeading)}</h3>
        ${fe.map((f) => `<div class="row"><span>${esc(f.name)}</span><span>${gbp(f.price)}</span></div>`).join("")}
        <p>${esc(ex.filmNote)}</p>
      </div>` : ""}
      ${ad.map((a) => `<div class="col">
        <h3>${esc(a.heading || a.name)}</h3>
        <div class="row"><span>${esc(a.name)}</span><span>${a.priceIsFrom ? "from " : ""}${gbp(a.price)}</span></div>
        <p>${esc(a.text)}</p>
      </div>`).join("")}
    </div>
    ${ex.drone?.title ? `<div class="drone">
      ${imgTag(ex.drone.image, ex.drone.alt, v, { sizes: "(max-width:820px) 100vw, 60vw", extra: focusAttr(c, ex.drone.image) })}
      <div class="t">
        <div class="eyebrow">${esc(ex.drone.eyebrow)}</div>
        <h3 class="spaced" style="margin:0;font-size:1rem;letter-spacing:.32em">${esc(ex.drone.title)}</h3>
        <p class="small" style="font-size:.92rem">${esc(ex.drone.text)}</p>
      </div>
    </div>` : ""}
  </div>
</section>

<section id="build" class="builder block">
  <div class="wrap">
    <div class="chapter" style="padding:0">
      <div class="eyebrow">${esc(c.builder?.eyebrow)}</div>
      <h2 class="title">${esc(c.builder?.heading)}</h2>
      <p class="small" style="max-width:52ch">${esc(c.builder?.intro)}</p>
    </div>
    <div class="bgrid">
      <form class="groups" id="builder" autocomplete="on" novalidate>
        <fieldset>
          <legend class="eyebrow"><span class="num">1 · </span>Package</legend>
          <div class="opts">
            ${pk.map((p, i) => `<label class="opt"><input type="radio" name="pkg" id="pkg-${i}" value="${i}"${i === 0 ? " checked" : ""}><span class="n">${esc(p.name)}</span><span class="d">${esc(p.builderNote)}</span><span class="p">${p.priceIsFrom ? "from " : ""}${gbp(p.price)}</span></label>`).join("")}
          </div>
        </fieldset>
        ${fe.length ? `<fieldset id="filmx"${pk[0]?.includesFilm ? "" : " hidden"}>
          <legend class="eyebrow"><span class="num">2 · </span>${esc(ex.filmHeading)}</legend>
          <div class="opts">
            ${fe.map((f, i) => `<label class="opt check"><input type="checkbox" name="film" id="film-${i}" value="${i}"><span class="box"></span><span class="n">${esc(f.name)}</span><span class="p">${gbp(f.price)}</span></label>`).join("")}
          </div>
        </fieldset>` : ""}
        ${ad.length ? `<fieldset>
          <legend class="eyebrow"><span class="num">${fe.length ? 3 : 2} · </span>Anything else</legend>
          <div class="opts">
            ${ad.map((a, i) => `<label class="opt check"><input type="checkbox" name="addon" id="addon-${i}" value="${i}"><span class="box"></span><span class="n">${esc(a.name)}</span><span class="p">${a.priceIsFrom ? "from " : ""}${gbp(a.price)}</span></label>`).join("")}
          </div>
        </fieldset>` : ""}
        <fieldset>
          <legend class="eyebrow"><span class="num">${(fe.length ? 1 : 0) + (ad.length ? 1 : 0) + 2} · </span>About you &amp; your wedding</legend>
          <div class="details">
            <label for="d-names"><span>Your names <span class="req">*</span></span><input id="d-names" name="names" type="text" autocomplete="name" placeholder="e.g. Ellie &amp; Reece" required></label>
            <label for="d-email"><span>Your email <span class="req">*</span></span><input id="d-email" name="email" type="email" autocomplete="email" placeholder="you@example.com" required></label>
            <label for="d-phone">Phone<input id="d-phone" name="phone" type="tel" autocomplete="tel"></label>
            <label for="d-date">Wedding date<input id="d-date" name="date" type="date"></label>
            <label class="full" for="d-venue">Venue<input id="d-venue" name="venue" type="text" placeholder="e.g. Farbridge, West Dean"></label>
            <label class="full" for="d-msg">Anything else you’d like to tell me<textarea id="d-msg" name="message" maxlength="3000"></textarea></label>
            <div class="hp" aria-hidden="true"><label for="d-company">Company<input id="d-company" name="company" type="text" tabindex="-1" autocomplete="off"></label></div>
          </div>
        </fieldset>
      </form>

      <aside class="summary" aria-live="polite">
        <h3 class="eyebrow">Your selection</h3>
        <ul class="lines" id="lines"></ul>
        <div class="total"><span class="eyebrow">Estimated total</span><b id="total"></b></div>
        <p class="small" id="fromnote">${esc(c.builder?.fromNote)}</p>
        <div class="enq" id="enq">
          <button class="btn" type="button" id="send">Send my enquiry</button>
          <div class="err" id="err" role="alert"></div>
          <p class="small">Goes straight to me, and you’ll get a copy by email.</p>
        </div>
        <div class="thanks" id="thanks" hidden>
          <h4>${esc(c.builder?.thanksHeading)}</h4>
          <p class="small">${esc(c.builder?.thanksText)}</p>
        </div>
      </aside>
    </div>
  </div>
</section>

<section id="films" class="block">
  <div class="wrap">
    <div class="chapter" style="padding:0">
      <div class="eyebrow">${esc(c.films?.eyebrow)}</div>
      <h2 class="title">${esc(c.films?.heading)}</h2>
      <p class="small" style="max-width:50ch">${esc(c.films?.intro)}</p>
    </div>
    <div class="films">
      ${(c.films?.items || []).map((f) => `<a class="film" href="${esc(f.url)}" target="_blank" rel="noopener">
        ${imgTag(f.image, "", v, { sizes: "(max-width:680px) 100vw, 50vw", extra: focusAttr(c, f.image) })}
        <span class="cap"><span class="play" aria-hidden="true"></span><span>${esc(f.title)}</span><em>${esc(f.note)} ↗</em></span>
      </a>`).join("")}
    </div>
  </div>
</section>

<section id="gallery" class="block" style="padding-top:0">
  <div class="wrap">
    <div class="chapter" style="padding:0">
      <div class="eyebrow">${esc(c.gallery?.eyebrow)}</div>
      <h2 class="title">${esc(c.gallery?.heading)}</h2>
    </div>
    <div class="gallery" id="gal">
      ${(c.gallery?.photos || []).map((g, i) => `<button type="button" data-i="${i}" data-full="${imgUrl(g.image, "l", v)}" aria-label="Open photo: ${esc(g.alt)}"><img src="${imgUrl(g.image, "s", v)}" alt="${esc(g.alt)}" loading="lazy" ${focusAttr(c, g.image)}></button>`).join("")}
    </div>
  </div>
</section>

<section id="kindwords" class="block" style="padding-top:0">
  <div class="wrap">
    <div class="chapter" style="padding:0">
      <div class="eyebrow">${esc(c.testimonials?.eyebrow)}</div>
      <h2 class="title">${esc(c.testimonials?.heading)}</h2>
    </div>
    <div class="quotes">
      <div class="track" id="track" tabindex="0" aria-label="Testimonials, scroll sideways">
        ${(c.testimonials?.items || []).map((q) => `<figure class="q">
          <blockquote>${(q.paragraphs || []).map((p) => `<p>“${esc(p)}”</p>`).join("")}</blockquote>
          <figcaption>${q.image ? `<img src="${imgUrl(q.image, "s", v)}" alt="${esc(q.alt || "")}" loading="lazy" ${focusAttr(c, q.image)}>` : ""}<span>${esc(q.names)}</span></figcaption>
        </figure>`).join("")}
      </div>
      <div class="qnav">
        <div class="dots" id="dots">${(c.testimonials?.items || []).map((q, i) => `<button type="button" aria-label="Show ${esc(q.names)}" data-i="${i}"></button>`).join("")}</div>
        <div class="arrows"><button type="button" id="prev" aria-label="Previous testimonial">←</button><button type="button" id="next" aria-label="Next testimonial">→</button></div>
      </div>
    </div>
  </div>
</section>

<section id="contact" class="contact">
  ${imgTag(c.contact?.image, "", v, { extra: focusAttr(c, c.contact?.image) })}
  <div class="over">
    <div class="eyebrow" style="color:rgba(255,255,255,.8)">${esc(c.contact?.eyebrow)}</div>
    <h2 class="title">${esc(c.contact?.heading)}</h2>
    <p style="max-width:46ch;opacity:.9">${esc(c.contact?.text)}</p>
    <div class="addr">${esc(c.contact?.email)}</div>
    <div class="links">
      <a class="btn" href="mailto:${esc(c.contact?.email)}">Email me</a>
      ${c.contact?.instagram ? `<a class="btn ghost" href="${esc(c.contact.instagram)}" target="_blank" rel="noopener">Instagram ↗</a>` : ""}
      ${c.contact?.website ? `<a class="btn ghost" href="${esc(c.contact.website)}" target="_blank" rel="noopener">Website ↗</a>` : ""}
    </div>
  </div>
</section>
</main>

<footer><div class="wrap"><span>${esc(S.footerLeft)}</span><span>${esc(S.footerRight)}</span></div></footer>

<div class="lb" id="lb" hidden role="dialog" aria-modal="true" aria-label="Photo viewer">
  <button type="button" id="lbprev" aria-label="Previous photo">‹</button>
  <img id="lbimg" alt="">
  <button type="button" id="lbnext" aria-label="Next photo">›</button>
  <button type="button" class="x" id="lbx" aria-label="Close">✕</button>
</div>

<script>window.__B=${JSON.stringify(builderData).replace(/</g, "\\u003c")};</script>
<script>${CLIENT_JS}</script>
</body>
</html>`;
}

const CLIENT_JS = `
(function(){
/* mobile nav drawer */
var navbtn=document.getElementById('navbtn'),navlist=document.getElementById('navlist');
function setNav(open){
  navbtn.setAttribute('aria-expanded',open?'true':'false');
  navlist.classList.toggle('open',open);
  document.documentElement.style.overflow=open?'hidden':'';
  if(open){var first=navlist.querySelector('a');if(first)first.focus();}
}
navbtn.addEventListener('click',function(){setNav(navbtn.getAttribute('aria-expanded')!=='true')});
navlist.addEventListener('click',function(e){if(e.target.closest('a'))setNav(false)});
document.addEventListener('keydown',function(e){if(e.key==='Escape'&&navbtn.getAttribute('aria-expanded')==='true'){setNav(false);navbtn.focus()}});
window.addEventListener('resize',function(){if(window.innerWidth>760&&navbtn.getAttribute('aria-expanded')==='true')setNav(false)});

/* gallery lightbox */
var gal=document.getElementById('gal'),lb=document.getElementById('lb'),lbimg=document.getElementById('lbimg');
var items=[].slice.call(gal.querySelectorAll('button')),cur=0,lastFocus=null;
function show(i){cur=(i+items.length)%items.length;lbimg.src=items[cur].dataset.full;lbimg.alt=items[cur].querySelector('img').alt;}
gal.addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;lastFocus=b;show(+b.dataset.i);lb.hidden=false;document.getElementById('lbx').focus();});
function close(){lb.hidden=true;if(lastFocus)lastFocus.focus();}
document.getElementById('lbx').onclick=close;
document.getElementById('lbprev').onclick=function(){show(cur-1)};
document.getElementById('lbnext').onclick=function(){show(cur+1)};
lb.addEventListener('click',function(e){if(e.target===lb)close();});
document.addEventListener('keydown',function(e){if(lb.hidden)return;if(e.key==='Escape')close();if(e.key==='ArrowRight')show(cur+1);if(e.key==='ArrowLeft')show(cur-1);});
var tx=null;lb.addEventListener('touchstart',function(e){tx=e.touches[0].clientX},{passive:true});
lb.addEventListener('touchend',function(e){if(tx===null)return;var d=e.changedTouches[0].clientX-tx;if(Math.abs(d)>50)show(cur+(d<0?1:-1));tx=null;});

/* testimonials */
var track=document.getElementById('track'),slides=[].slice.call(track.children),dots=[].slice.call(document.getElementById('dots').children);
function go(i){if(!slides.length)return;i=Math.max(0,Math.min(slides.length-1,i));track.scrollTo({left:slides[i].offsetLeft-track.offsetLeft,behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'auto':'smooth'});}
function active(){var x=track.scrollLeft,best=0,bd=1e9;slides.forEach(function(s,i){var d=Math.abs(s.offsetLeft-track.offsetLeft-x);if(d<bd){bd=d;best=i}});dots.forEach(function(b,i){b.setAttribute('aria-current',i===best)});return best;}
track.addEventListener('scroll',function(){requestAnimationFrame(active)},{passive:true});
document.getElementById('dots').addEventListener('click',function(e){var b=e.target.closest('button');if(b)go(+b.dataset.i);});
document.getElementById('prev').onclick=function(){go(active()-1)};
document.getElementById('next').onclick=function(){go(active()+1)};
active();

/* builder */
var B=window.__B,form=document.getElementById('builder');
function gbp(n){return '£'+Number(n).toLocaleString('en-GB')}
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
function sel(){
  var pi=+((form.querySelector('input[name=pkg]:checked')||{}).value||0),p=B.packages[pi]||B.packages[0];
  var film=[].slice.call(form.querySelectorAll('input[name=film]:checked:not(:disabled)')).map(function(i){return +i.value});
  var add=[].slice.call(form.querySelectorAll('input[name=addon]:checked')).map(function(i){return +i.value});
  return {pi:pi,p:p,film:film,add:add};
}
function render(){
  var s=sel(),p=s.p;if(!p)return;
  form.querySelectorAll('input[name=film]').forEach(function(i){i.disabled=!p.film});
  var filmx=document.getElementById('filmx');if(filmx)filmx.hidden=!p.film;
  var fs=[].slice.call(form.querySelectorAll('fieldset')).filter(function(f){return !f.hidden});
  fs.forEach(function(f,i){var n=f.querySelector('.num');if(n)n.textContent=(i+1)+' · ';});
  var total=p.price,from=p.from,rows=['<li><span>'+esc(p.name)+'</span><span>'+(p.from?'from ':'')+gbp(p.price)+'</span></li>'];
  s.film.forEach(function(i){var f=B.film[i];total+=f.price;rows.push('<li><span>'+esc(f.name)+'</span><span>'+gbp(f.price)+'</span></li>')});
  s.add.forEach(function(i){var a=B.addOns[i];total+=a.price;if(a.from)from=true;rows.push('<li><span>'+esc(a.name)+'</span><span>'+(a.from?'from ':'')+gbp(a.price)+'</span></li>')});
  if(B.droneLine)rows.push('<li class="inc"><span>'+esc(B.droneLine)+'</span><span>included</span></li>');
  document.getElementById('lines').innerHTML=rows.join('');
  document.getElementById('total').textContent=(from?'from ':'')+gbp(total);
  document.getElementById('fromnote').hidden=!from;
}
form.addEventListener('change',render);form.addEventListener('input',render);
form.addEventListener('submit',function(e){e.preventDefault()});
document.querySelectorAll('[data-pick]').forEach(function(b){b.addEventListener('click',function(){var r=document.getElementById('pkg-'+b.dataset.pick);if(r){r.checked=true;render();document.getElementById('build').scrollIntoView();}})});
render();

/* send enquiry */
var send=document.getElementById('send'),err=document.getElementById('err');
send.addEventListener('click',function(){
  err.textContent='';
  var names=form.names.value.trim(),email=form.email.value.trim();
  if(!names){err.textContent='Please add your names so I know who you are.';form.names.focus();return;}
  if(!/^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$/.test(email)){err.textContent='Please add a valid email address so I can reply.';form.email.focus();return;}
  var s=sel();
  var body={pkg:s.pi,film:s.film,addons:s.add,names:names,email:email,phone:form.phone.value.trim(),date:form.date.value,venue:form.venue.value.trim(),message:form.message.value.trim(),company:form.company.value};
  send.disabled=true;send.textContent='Sending…';
  fetch('/api/enquiry',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(body)})
   .then(function(r){return r.json().catch(function(){return {}}).then(function(j){return {ok:r.ok,j:j}})})
   .then(function(res){
     if(res.ok&&res.j.ok){document.getElementById('enq').hidden=true;document.getElementById('thanks').hidden=false;}
     else{err.textContent=(res.j&&res.j.error)||'Sorry, that didn’t send. Please email me directly at the address below.';send.disabled=false;send.textContent='Send my enquiry';}
   })
   .catch(function(){err.textContent='Sorry, that didn’t send. Please check your connection and try again, or email me directly.';send.disabled=false;send.textContent='Send my enquiry';});
});
})();
`;
