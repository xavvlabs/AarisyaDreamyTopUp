(function () {
  var $ = function (s) {
      return document.querySelector(s);
    },
    $$ = function (s) {
      return Array.prototype.slice.call(document.querySelectorAll(s));
    };
  var paket = $("#paket"),
    total = $("#total"),
    bar = $("#mobileBar"),
    barTotal = $("#barTotal"),
    toTop = $("#toTop");
  var cards = $$(".package-card");

  /* 1. Tandai kartu paket yang sedang dipilih */
  function markPicked() {
    var v = paket ? paket.value.replace(/\D/g, "") : "";
    cards.forEach(function (c) {
      c.classList.toggle("picked", !!v && c.getAttribute("data-robux") === v);
    });
  }
  if (paket) paket.addEventListener("change", markPicked);
  $$(".package-card button").forEach(function (b) {
    b.addEventListener("click", function () {
      setTimeout(markPicked, 60);
    });
  });

  /* 2. Bar total di HP: ikut total pesanan */
  function syncBar() {
    if (!total || !bar) return;
    var t = total.textContent.trim();
    barTotal.textContent = t;
    bar.hidden = !(t && t !== "Rp0") || isOrderVisible();
  }
  function isOrderVisible() {
    var o = $("#order");
    if (!o) return false;
    var r = o.getBoundingClientRect();
    return (
      r.top < window.innerHeight * 0.6 && r.bottom > window.innerHeight * 0.3
    );
  }
  if (total && window.MutationObserver)
    new MutationObserver(function () {
      syncBar();
      markPicked();
    }).observe(total, { childList: true, characterData: true, subtree: true });

  /* 3. Filter paket */
  var chips = $$(".chip");
  chips.forEach(function (ch) {
    ch.addEventListener("click", function () {
      chips.forEach(function (c) {
        c.classList.remove("active");
      });
      ch.classList.add("active");
      var f = ch.getAttribute("data-f");
      cards.forEach(function (c) {
        var n = parseInt(c.getAttribute("data-robux"), 10),
          show =
            f === "all" ||
            (f === "small" && n <= 300) ||
            (f === "mid" && n >= 500 && n <= 1000) ||
            (f === "big" && n >= 1500);
        c.classList.toggle("is-hidden", !show);
      });
    });
  });

  /* 4. Tombol ke atas + menu aktif saat scroll */
  var links = $$('.nav-container nav a[href^="#"]:not(.nav-order)');
  var secs = links.map(function (a) {
    return $(a.getAttribute("href"));
  });
  function onScroll() {
    if (toTop) toTop.hidden = window.scrollY < 500;
    var y = window.scrollY + 120,
      cur = -1;
    secs.forEach(function (s, i) {
      if (s && s.offsetTop <= y) cur = i;
    });
    links.forEach(function (a, i) {
      a.classList.toggle("on", i === cur);
    });
    syncBar();
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
})();

/* Slideshow avatar Roblox di kartu hero (ganti tiap 1 detik) */
(function () {
  /* GANTI daftar ini dengan file gambar avatar kamu (taruh di folder "avatars"). */
  var AVATARS = [
    "avatars/avatar1.jpg",
    "avatars/avatar2.jpg",
    "avatars/avatar3.jpg",
    "avatars/avatar4.jpg",
    "avatars/avatar5.jpg",
  ];
  var INTERVAL = 1000; /* milidetik */
  var orb = document.getElementById("avatarOrb");
  if (!orb) return;
  var imgs = [],
    pending = AVATARS.length,
    idx = 0;
  AVATARS.forEach(function (src) {
    var im = new Image();
    im.className = "orb-avatar";
    im.alt = "Avatar Roblox";
    im.onload = function () {
      imgs.push(im);
      orb.appendChild(im);
      done();
    };
    im.onerror = done;
    im.src = src;
  });
  function done() {
    if (--pending > 0) return;
    if (!imgs.length) return;
    orb.classList.add("has-avatars");
    imgs[0].classList.add("on");
    if (imgs.length > 1)
      setInterval(function () {
        imgs[idx].classList.remove("on");
        idx = (idx + 1) % imgs.length;
        imgs[idx].classList.add("on");
      }, INTERVAL);
  }
})();
