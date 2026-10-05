// Daftarkan variabel CSS khusus agar animasi lingkaran --mask-size berjalan mulus
try {
  CSS.registerProperty({
    name: '--mask-size',
    syntax: '<length>',
    inherits: false,
    initialValue: '0px',
  });
} catch (e) {
  // Abaikan jika browser sudah mendukung secara native
}

// ==================== 1. ACCURATE LOADER & LIGHTNING ====================
const loader = document.getElementById("loader");
const loaderBar = document.getElementById("loader-bar");
const loaderPercent = document.getElementById("loader-percent");

let progress = 0;
const loadInterval = setInterval(() => {
  progress += Math.floor(Math.random() * 8) + 2;
  if (progress >= 100) {
    progress = 100;
    clearInterval(loadInterval);
    setTimeout(() => {
      if (loader) {
        loader.style.opacity = "0";
        setTimeout(() => loader.remove(), 800);
      }
    }, 400);
  }
  if (loaderBar) loaderBar.style.width = progress + "%";
  if (loaderPercent) loaderPercent.textContent = progress + "%";
}, 40);

const lCanvas = document.getElementById("loader-canvas");
if (lCanvas) {
  const lCtx = lCanvas.getContext("2d");
  lCanvas.width = window.innerWidth;
  lCanvas.height = window.innerHeight;

  let lParticles = Array.from({ length: 60 }, () => ({
    x: Math.random() * lCanvas.width,
    y: Math.random() * lCanvas.height,
    r: Math.random() * 2 + 1,
    speedY: -Math.random() * 1.5 - 0.5,
    alpha: Math.random() * 0.8 + 0.2
  }));

  function animateLoaderParticles() {
    lCtx.clearRect(0, 0, lCanvas.width, lCanvas.height);
    lParticles.forEach((p) => {
      p.y += p.speedY;
      if (p.y < 0) p.y = lCanvas.height;
      lCtx.beginPath();
      lCtx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      lCtx.fillStyle = `rgba(59, 130, 246, ${p.alpha})`;
      lCtx.shadowBlur = 10;
      lCtx.shadowColor = "#3b82f6";
      lCtx.fill();
    });
    requestAnimationFrame(animateLoaderParticles);
  }
  animateLoaderParticles();
}

// ==================== 2. CANVAS STARS BACKGROUND ====================
const canvas = document.getElementById("bg-canvas");
if (canvas) {
  const ctx = canvas.getContext("2d");
  let stars = [], w, h;

  function resizeCanvas() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
    stars = Array.from({ length: Math.min(150, Math.floor((w * h) / 9000)) }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.3 + 0.2,
      a: Math.random() * 0.8 + 0.1,
      s: Math.random() * 0.12 + 0.02,
    }));
  }

  function drawCanvas() {
    ctx.clearRect(0, 0, w, h);
    for (const s of stars) {
      s.y += s.s;
      if (s.y > h) s.y = 0;
      ctx.globalAlpha = s.a * (0.6 + 0.4 * Math.sin(Date.now() / 800 + s.x));
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = "#ffffff";
      ctx.fill();
    }
    requestAnimationFrame(drawCanvas);
  }

  window.addEventListener("resize", resizeCanvas);
  resizeCanvas();
  drawCanvas();
}

// ==================== 3. CURSOR GLOW EFFECT ====================
const glow = document.getElementById("cursor-glow");
window.addEventListener("pointermove", (e) => {
  if (glow) {
    glow.style.left = e.clientX + "px";
    glow.style.top = e.clientY + "px";
  }
});

// ==================== 4. SMOOTH SPIDEY REVEAL (Area Kursor Menguak Spider-Man) ====================
const avatarContainer = document.getElementById("avatar-container");
const spideyImg = document.querySelector(".spidey-img.img-under");

if (avatarContainer && spideyImg) {
  let animFrameId = null;

  avatarContainer.addEventListener("mousemove", (e) => {
    const rect = avatarContainer.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (animFrameId) cancelAnimationFrame(animFrameId);

    // Sinkronkan pergerakan masking dengan GPU rendering (Smooth 60/120fps)
    animFrameId = requestAnimationFrame(() => {
      spideyImg.style.setProperty("--mask-size", "95px");
      spideyImg.style.setProperty("--mask-x", `${x}px`);
      spideyImg.style.setProperty("--mask-y", `${y}px`);
    });
  });

  avatarContainer.addEventListener("mouseleave", () => {
    // Saat kursor keluar dari foto, Spider-Man hilang kembali
    spideyImg.style.setProperty("--mask-size", "0px");
  });
}

// ==================== 5. PORTFOLIO TABS SYSTEM ====================
const tabBtns = document.querySelectorAll(".tab-btn");
const tabPanes = document.querySelectorAll(".tab-pane");

tabBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    tabBtns.forEach((b) => b.classList.remove("active"));
    tabPanes.forEach((p) => p.classList.remove("active"));

    btn.classList.add("active");
    const targetTab = btn.getAttribute("data-tab");
    document.getElementById(targetTab)?.classList.add("active");
  });
});

// ==================== 6. SCROLL REVEAL & NAVBAR ACTIVE ====================
const revealElements = document.querySelectorAll(".reveal");
const observer = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (e.isIntersecting) e.target.classList.add("show");
  });
}, { threshold: 0.1 });

revealElements.forEach((el) => observer.observe(el));

const sections = document.querySelectorAll("section[id]");
window.addEventListener("scroll", () => {
  let scrollY = window.scrollY + 200;
  sections.forEach((current) => {
    const sectionHeight = current.offsetHeight;
    const sectionTop = current.offsetTop;
    const sectionId = current.getAttribute("id");

    if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
      document.querySelector(`.nav-link[href*=${sectionId}]`)?.classList.add("active");
    } else {
      document.querySelector(`.nav-link[href*=${sectionId}]`)?.classList.remove("active");
    }
  });
});

// ==================== 7. GUESTBOOK / COMMENT FORM ====================
const commentForm = document.getElementById("comment-form");
const commentsList = document.getElementById("comments-list");
const commentCount = document.getElementById("comment-count");

if (commentForm && commentsList) {
  commentForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const nameInput = document.getElementById("comment-name");
    const textInput = document.getElementById("comment-text");

    if (!nameInput.value.trim() || !textInput.value.trim()) return;

    const newComment = document.createElement("div");
    newComment.classList.add("comment-item");
    newComment.innerHTML = `
      <div class="comment-avatar"><i class="fas fa-user-circle"></i></div>
      <div class="comment-body">
        <div class="comment-meta">
          <strong>${nameInput.value}</strong>
          <span>Baru saja</span>
        </div>
        <p>${textInput.value}</p>
      </div>
    `;

    commentsList.prepend(newComment);

    if (commentCount) {
      commentCount.textContent = parseInt(commentCount.textContent) + 1;
    }

    nameInput.value = "";
    textInput.value = "";
  });
}

// ==================== 8. CERTIFICATE MODAL POPUP ====================
const certModal = document.getElementById("cert-modal");
const certModalImg = document.getElementById("cert-modal-img");
const certCaption = document.getElementById("cert-modal-caption");
const certCloseBtn = document.querySelector(".cert-modal-close");

// Buka modal saat tombol .view-cert-btn diklik
document.querySelectorAll(".view-cert-btn").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    const imgPath = btn.getAttribute("data-img");
    const title = btn.getAttribute("data-title");

    if (certModal && certModalImg) {
      certModalImg.src = imgPath;
      if (certCaption) certCaption.textContent = title;
      certModal.style.display = "flex";
    }
  });
});

// Tutup modal saat tombol silang (X) diklik
if (certCloseBtn) {
  certCloseBtn.addEventListener("click", () => {
    if (certModal) certModal.style.display = "none";
  });
}

// Tutup modal saat area luar gambar (backdrop) diklik
if (certModal) {
  certModal.addEventListener("click", (e) => {
    if (e.target === certModal) {
      certModal.style.display = "none";
    }
  });
}