// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// Active nav link
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('nav a');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(sec => {
    const top = sec.offsetTop - 200;
    if (window.scrollY >= top) current = sec.getAttribute('id');
  });
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === '#' + current) link.classList.add('active');
  });
});

// Fade-in on scroll
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.project-card, .service-card').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(30px)';
  el.style.transition = 'opacity .6s ease, transform .6s ease';
  observer.observe(el);
});

// Falling petals — 青花碎纹
function createPetals() {
  const count = 12;
  for (let i = 0; i < count; i++) {
    const petal = document.createElement('div');
    petal.className = 'petal';
    petal.style.left = Math.random() * 100 + '%';
    petal.style.animationDuration = (8 + Math.random() * 12) + 's';
    petal.style.animationDelay = (Math.random() * 15) + 's';
    petal.style.width = (6 + Math.random() * 6) + 'px';
    petal.style.height = (6 + Math.random() * 6) + 'px';
    document.body.appendChild(petal);
  }
}
createPetals();

// ============================================================
// 媒体交互 — 视频播放 / 图片查看 双按钮系统
// ============================================================
document.querySelectorAll('.project-card[data-video]').forEach(card => {
  const thumb = card.querySelector('.project-thumb');
  const overlay = card.querySelector('.media-overlay');
  const btnVideo = overlay?.querySelector('.media-btn-video');
  const btnImage = overlay?.querySelector('.media-btn-image');
  if (!overlay || !btnVideo) return;

  // 存储 emoji 原文，用于恢复
  const emojiText = thumb.textContent.trim();

  // 关闭按钮 — 右上角 ✕，恢复 emoji
  function addCloseBtn() {
    const closeBtn = document.createElement('div');
    closeBtn.className = 'media-close';
    closeBtn.innerHTML = '✕';
    closeBtn.style.cssText = `
      position:absolute;top:8px;right:8px;z-index:5;
      width:28px;height:28px;border-radius:50%;
      background:rgba(255,255,255,.9);backdrop-filter:blur(4px);
      display:flex;align-items:center;justify-content:center;
      font-size:.85rem;color:var(--blue-ink);cursor:pointer;
      transition:transform .2s,background .2s;
      box-shadow:0 2px 8px rgba(0,0,0,.15);
    `;
    closeBtn.addEventListener('mouseenter', () => {
      closeBtn.style.transform = 'scale(1.15)';
      closeBtn.style.background = '#fff';
    });
    closeBtn.addEventListener('mouseleave', () => {
      closeBtn.style.transform = 'scale(1)';
      closeBtn.style.background = 'rgba(255,255,255,.9)';
    });
    closeBtn.addEventListener('click', restoreEmoji);
    thumb.appendChild(closeBtn);
  }

  // 恢复 emoji + overlay
  function restoreEmoji() {
    // 移除视频/图片/关闭按钮
    thumb.querySelectorAll('video, img.media-img, .media-close').forEach(el => el.remove());
    thumb.classList.remove('playing');
    overlay.classList.remove('hidden');
    // 恢复 emoji 文字
    thumb.textContent = emojiText;
    thumb.appendChild(overlay);
  }

  // ===== 点击 ▶ 视频按钮 =====
  btnVideo.addEventListener('click', () => {
    const videoSrc = card.dataset.video;
    // 如果视频已存在，直接播放
    const existingVideo = thumb.querySelector('video');
    if (existingVideo) {
      existingVideo.play();
      overlay.classList.add('hidden');
      thumb.classList.add('playing');
      return;
    }
    // 先移除已有的图片（如果有）
    thumb.querySelectorAll('img.media-img, .media-close').forEach(el => el.remove());

    const video = document.createElement('video');
    video.src = videoSrc;
    video.controls = true;
    video.autoplay = true;
    video.muted = false;
    video.playsInline = true;
    video.style.cssText = 'width:100%;height:100%;object-fit:cover;position:absolute;inset:0;';
    video.setAttribute('preload', 'metadata');
    video.addEventListener('ended', restoreEmoji);

    thumb.textContent = '';
    thumb.appendChild(video);
    thumb.appendChild(overlay);
    addCloseBtn();
    overlay.classList.add('hidden');
    thumb.classList.add('playing');
  });

  // ===== 点击 📷 图片按钮 =====
  if (btnImage && card.dataset.image) {
    btnImage.addEventListener('click', () => {
      const imageSrc = card.dataset.image;
      // 如果图片已存在，不重复创建
      const existingImg = thumb.querySelector('img.media-img');
      if (existingImg) return;

      // 先移除已有的视频（如果有）
      thumb.querySelectorAll('video, .media-close').forEach(el => el.remove());

      const img = document.createElement('img');
      img.src = imageSrc;
      img.className = 'media-img';
      img.alt = card.querySelector('.project-info h4')?.textContent || '作品展示';
      img.draggable = false;

      thumb.textContent = '';
      thumb.appendChild(img);
      thumb.appendChild(overlay);
      addCloseBtn();
      overlay.classList.add('hidden');
    });
  }
});

