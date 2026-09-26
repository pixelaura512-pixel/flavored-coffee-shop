/* Interaction code retained from the two original exports. */
let currentView = 'menu';
  let isTransitioning = false;

  function updateNavState(target) {
    const homeBtn = document.getElementById('nav-btn-home');
    const menuBtn = document.getElementById('nav-btn-menu');
    const aboutBtn = document.getElementById('nav-btn-about');
    const contactBtn = document.getElementById('nav-btn-contact');

    [homeBtn, menuBtn, aboutBtn, contactBtn].forEach(btn => {
      if (btn) {
        btn.classList.remove('text-brand-espresso', 'font-semibold', 'after:w-full');
        btn.classList.add('text-brand-espresso/70', 'font-medium', 'after:w-0');
      }
    });

    let activeBtn;
    if (target === 'home') activeBtn = homeBtn;
    else if (target === 'menu') activeBtn = menuBtn;
    else if (target === 'about') activeBtn = aboutBtn;
    else if (target === 'contact') activeBtn = contactBtn;

    if (activeBtn) {
      activeBtn.classList.remove('text-brand-espresso/70', 'font-medium', 'after:w-0');
      activeBtn.classList.add('text-brand-espresso', 'font-semibold', 'after:w-full');
    }
  }

  function getViewElement(view) {
    if (view === 'home') return document.getElementById('view-home');
    if (view === 'menu') return document.getElementById('view-menu');
    if (view === 'about') return document.getElementById('view-about');
    if (view === 'contact') return document.getElementById('view-contact');
    return null;
  }

  function navigateTo(targetView) {
    if (currentView === targetView || isTransitioning) return;
    isTransitioning = true;

    const fromEl = getViewElement(currentView);
    const toEl = getViewElement(targetView);

    if (!fromEl || !toEl) {
      isTransitioning = false;
      return;
    }

    updateNavState(targetView);

    // Smoothly scroll towards top of page
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Determine exit direction
    const order = { 'home': 1, 'menu': 2, 'about': 3, 'contact': 4 };
    const movingForward = (order[targetView] || 1) > (order[currentView] || 1);

    if (movingForward) {
      fromEl.classList.remove('view-active');
      fromEl.classList.add('view-hidden-left');
    } else {
      fromEl.classList.remove('view-active');
      fromEl.classList.add('view-hidden-right');
    }

    setTimeout(() => {
      fromEl.style.display = 'none';

      // Prepare target view entrance
      toEl.style.display = 'block';
      if (movingForward) {
        toEl.classList.remove('view-hidden-left');
        toEl.classList.add('view-hidden-right');
      } else {
        toEl.classList.remove('view-hidden-right');
        toEl.classList.add('view-hidden-left');
      }

      // Trigger reflow for CSS transition
      void toEl.offsetWidth;

      // Glide in target view
      toEl.classList.remove('view-hidden-left', 'view-hidden-right');
      toEl.classList.add('view-active');

      currentView = targetView;
      setTimeout(() => {
        isTransitioning = false;
      }, 650);
    }, 320);
  }

  function handleReservationSubmit(e) {
    e.preventDefault();
    const btn = document.getElementById('res-submit-btn');
    const banner = document.getElementById('reservation-confirmation');
    if (!btn || !banner) return;

    btn.disabled = true;
    btn.innerHTML = `<span>Reserving table...</span>`;

    setTimeout(() => {
      btn.innerHTML = `<span>Request Sent ✓</span>`;
      banner.classList.remove('hidden');
    }, 600);
  }

let modalState = {
    name: '',
    basePrice: 0,
    sizeSurcharge: 0,
    quantity: 1,
    isBakery: false
  };

  function openProductModal(name, price, img, desc, category, isBakery = false) {
    modalState.name = name;
    modalState.basePrice = price;
    modalState.sizeSurcharge = 0;
    modalState.quantity = 1;
    modalState.isBakery = isBakery;

    document.getElementById('modal-title').textContent = name;
    document.getElementById('modal-desc').textContent = desc;
    document.getElementById('modal-category').textContent = category;
    document.getElementById('modal-image').src = img;
    document.getElementById('modal-image').alt = name;
    document.getElementById('modal-base-price').textContent = '$' + price.toFixed(2);
    document.getElementById('modal-qty').textContent = '1';

    const optLabel = document.getElementById('modal-option-label');
    const sName1 = document.getElementById('size-name-1');
    const sName2 = document.getElementById('size-name-2');
    const sDiff2 = document.getElementById('size-diff-2');

    if (isBakery) {
      optLabel.textContent = 'Preparation Style';
      sName1.textContent = 'Standard';
      sName2.textContent = 'Warm & Toasted';
      sDiff2.textContent = '+$0.50';
    } else {
      optLabel.textContent = 'Select Size';
      sName1.textContent = 'Regular';
      sName2.textContent = 'Large (+100ml)';
      sDiff2.textContent = '+$0.75';
    }

    selectModalSize('regular', 0);

    const modal = document.getElementById('product-modal-container');
    const card = document.getElementById('modal-card');
    modal.classList.remove('pointer-events-none', 'opacity-0');
    modal.classList.add('pointer-events-auto', 'opacity-100');
    card.classList.remove('scale-95');
    card.classList.add('scale-100');
  }

  function closeProductModal() {
    const modal = document.getElementById('product-modal-container');
    const card = document.getElementById('modal-card');
    if (!modal) return;
    modal.classList.remove('pointer-events-auto', 'opacity-100');
    modal.classList.add('pointer-events-none', 'opacity-0');
    card.classList.remove('scale-100');
    card.classList.add('scale-95');
  }

  function selectModalSize(type, surcharge) {
    modalState.sizeSurcharge = surcharge;
    const btnReg = document.getElementById('size-opt-regular');
    const btnLrg = document.getElementById('size-opt-large');

    if (type === 'regular') {
      btnReg.className = 'py-2.5 px-4 rounded-2xl border border-brand-espresso bg-brand-espresso text-white text-xs font-semibold flex items-center justify-between transition-all';
      btnLrg.className = 'py-2.5 px-4 rounded-2xl border border-stone-300/60 bg-white/70 text-brand-espresso text-xs font-semibold flex items-center justify-between hover:bg-white transition-all';
    } else {
      btnLrg.className = 'py-2.5 px-4 rounded-2xl border border-brand-espresso bg-brand-espresso text-white text-xs font-semibold flex items-center justify-between transition-all';
      btnReg.className = 'py-2.5 px-4 rounded-2xl border border-stone-300/60 bg-white/70 text-brand-espresso text-xs font-semibold flex items-center justify-between hover:bg-white transition-all';
    }
    recalculateModalTotal();
  }

  function updateModalQuantity(delta) {
    const nextQty = modalState.quantity + delta;
    if (nextQty >= 1 && nextQty <= 20) {
      modalState.quantity = nextQty;
      document.getElementById('modal-qty').textContent = nextQty;
      recalculateModalTotal();
    }
  }

  function recalculateModalTotal() {
    const total = (modalState.basePrice + modalState.sizeSurcharge) * modalState.quantity;
    document.getElementById('modal-total-price').textContent = '$' + total.toFixed(2);
  }

  function handleModalAddToCart() {
    const btn = document.getElementById('modal-add-btn');
    const originalContent = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = '<span>Added to Cart ✓</span>';

    setTimeout(() => {
      closeProductModal();
      setTimeout(() => {
        btn.disabled = false;
        btn.innerHTML = originalContent;
      }, 350);
    }, 600);
  }

(function initHero3DTilt() {
    const tiltArea = document.getElementById('hero-tilt-area');
    const cup = document.getElementById('hero-3d-cup');
    if (!tiltArea || !cup) return;

    let isHovered = false;
    let currentRotX = 0;
    let currentRotY = 0;

    tiltArea.addEventListener('mouseenter', () => {
      isHovered = true;
      cup.style.transition = 'transform 0.15s ease-out';
    });

    tiltArea.addEventListener('mousemove', (e) => {
      if (!isHovered) return;
      const rect = tiltArea.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const percentX = (x - centerX) / centerX;
      const percentY = (y - centerY) / centerY;

      const rotY = percentX * 18;
      const rotX = -percentY * 18;
      const transZ = 24;

      cup.style.transform = `perspective(1000px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) translateZ(${transZ}px) scale(1.04)`;
    });

    tiltArea.addEventListener('mouseleave', () => {
      isHovered = false;
      cup.style.transition = 'transform 0.8s cubic-bezier(0.2, 0.8, 0.4, 1)';
      cup.style.transform = '';
    });
  })();

(function() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    // 1. Reveal Animations with IntersectionObserver
    const revealElements = document.querySelectorAll('.reveal-elem');
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -40px 0px'
    });
    revealElements.forEach(el => revealObserver.observe(el));

    if (prefersReducedMotion) return;

    // 2. Interactive Scroll & Mouse 3D Hero Cup Motion
    const heroCup = document.getElementById('interactive-3d-cup');
    const heroStage = document.getElementById('hero-cup-stage');
    const parallaxBeans = document.querySelectorAll('[data-parallax]');
    
    let targetMouseX = 0, targetMouseY = 0;
    let currentMouseX = 0, currentMouseY = 0;
    let scrollY = window.scrollY;
    let targetScrollY = window.scrollY;

    // Mouse tilt tracking on hero stage
    if (heroStage) {
      window.addEventListener('mousemove', (e) => {
        const { innerWidth, innerHeight } = window;
        // Range from -1 to 1
        targetMouseX = (e.clientX / innerWidth - 0.5) * 2;
        targetMouseY = (e.clientY / innerHeight - 0.5) * 2;
      }, { passive: true });
    }

    // Scroll listener with passive flag
    window.addEventListener('scroll', () => {
      targetScrollY = window.scrollY;
    }, { passive: true });

    // Smooth Lerp Animation Loop
    function lerp(start, end, factor) {
      return start + (end - start) * factor;
    }

    function renderLoop() {
      currentMouseX = lerp(currentMouseX, targetMouseX, 0.08);
      currentMouseY = lerp(currentMouseY, targetMouseY, 0.08);
      scrollY = lerp(scrollY, targetScrollY, 0.09);

      if (heroCup) {
        // Calculate scroll-driven 3D arc motion
        const scrollFactor = Math.min(scrollY / 900, 1.2);
        
        // Gentle organic curve: moves down, slightly swings horizontally and rotates in 3D
        const transY = scrollFactor * 130;
        const transX = Math.sin(scrollFactor * Math.PI) * -35;
        const rotZ = scrollFactor * 24 + currentMouseX * 5;
        const rotX = -currentMouseY * 18 + (scrollFactor * 14);
        const rotY = currentMouseX * 22;
        const scale = 1 + scrollFactor * 0.08;

        heroCup.style.transform = `translate3d(${transX}px, ${transY}px, 0) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) rotateZ(${rotZ.toFixed(2)}deg) scale(${scale.toFixed(3)})`;
      }

      // Parallax floating bean drift
      parallaxBeans.forEach(bean => {
        const speed = parseFloat(bean.getAttribute('data-parallax') || 0.1);
        const offset = scrollY * speed;
        const mouseShiftX = currentMouseX * 14 * speed;
        const mouseShiftY = currentMouseY * 14 * speed;
        bean.style.transform = `translate3d(${mouseShiftX.toFixed(1)}px, ${offset.toFixed(1)}px, 0)`;
      });

      requestAnimationFrame(renderLoop);
    }
    requestAnimationFrame(renderLoop);

    // 3. 3D Card Hover Tilt Micro-Interactions
    const cards = document.querySelectorAll('.interactive-card');
    cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -9;
        const rotateY = ((x - centerX) / centerX) * 9;

        // Set dynamic highlight reflection coordinates
        const percentX = (x / rect.width) * 100;
        const percentY = (y / rect.height) * 100;
        card.style.setProperty('--card-x', `${percentX}%`);
        card.style.setProperty('--card-y', `${percentY}%`);

        card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateZ(10px) scale3d(1.02, 1.02, 1.02)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });

  })();

// Always open the merged premium home view first.
document.addEventListener('DOMContentLoaded', () => {
  if (typeof navigateTo === 'function') navigateTo('home');

  // Product menu: remove generated 3D pointer listeners and keep a subtle CSS hover only.
  document.querySelectorAll('#view-menu .cascade-item').forEach((card) => {
    card.removeAttribute('onmousemove');
    card.removeAttribute('onmouseleave');
    card.style.removeProperty('transform');
    card.style.removeProperty('transform-style');
    const imageFrame = card.querySelector(':scope > div:first-child');
    if (imageFrame) imageFrame.style.removeProperty('transform');
  });

  const header = document.getElementById('site-header');
  const updateStickyHeader = () => header?.classList.toggle('is-scrolled', window.scrollY > 44);
  updateStickyHeader();
  window.addEventListener('scroll', updateStickyHeader, { passive: true });

  const mobileToggle = document.getElementById('mobile-nav-toggle');
  const mobilePanel = document.getElementById('mobile-nav-panel');
  // Move the floating panel outside the glass shell so scrolling never changes its viewport position.
  if (mobilePanel && mobilePanel.parentElement !== document.body) document.body.appendChild(mobilePanel);
  const positionMobileNav = () => {
    if (!mobileToggle || !mobilePanel) return;
    const rect = mobileToggle.getBoundingClientRect();
    mobilePanel.style.top = `${Math.min(rect.bottom + 10, window.innerHeight - 72)}px`;
    mobilePanel.style.right = `${Math.max(14, window.innerWidth - rect.right)}px`;
  };
  const setMobileNav = (open) => {
    if (open) positionMobileNav();
    mobilePanel?.classList.toggle('is-open', open);
    mobileToggle?.setAttribute('aria-expanded', String(open));
    mobileToggle?.classList.toggle('is-open', open);
  };
  mobileToggle?.addEventListener('click', () => setMobileNav(!mobilePanel?.classList.contains('is-open')));
  window.addEventListener('resize', () => {
    if (mobilePanel?.classList.contains('is-open')) positionMobileNav();
  }, { passive: true });
  document.addEventListener('click', (event) => {
    if (!mobilePanel?.classList.contains('is-open')) return;
    if (!mobilePanel.contains(event.target) && !mobileToggle?.contains(event.target)) setMobileNav(false);
  });
  window.mobileNavigate = (view) => {
    setMobileNav(false);
    navigateTo(view);
  };
});

/* STEP 3 — Keep navbar visible while scrolling on every screen size */
document.addEventListener('DOMContentLoaded', () => {
  const header = document.getElementById('site-header');
  const shell = document.getElementById('site-shell');

  if (!header || !shell) return;

  const originalParent = header.parentNode;
  const marker = document.createElement('div');
  marker.style.display = 'none';
  originalParent.insertBefore(marker, header);

  let placeholder = null;
  let isFloating = false;
  let ticking = false;

  function positionFloatingNavbar() {
    if (!isFloating) return;

    const shellBox = shell.getBoundingClientRect();
    const shellStyle = window.getComputedStyle(shell);
    const paddingLeft = parseFloat(shellStyle.paddingLeft) || 0;
    const paddingRight = parseFloat(shellStyle.paddingRight) || 0;
    const sideGap = window.innerWidth <= 640 ? 8 : 12;

    const left = Math.max(sideGap, shellBox.left + paddingLeft);
    const width = Math.min(
      window.innerWidth - sideGap * 2,
      shellBox.width - paddingLeft - paddingRight
    );

    header.style.left = `${left}px`;
    header.style.width = `${width}px`;
  }

  function makeNavbarFloating() {
    if (isFloating) return;

    placeholder = document.createElement('div');
    placeholder.style.height = `${header.offsetHeight}px`;
    marker.parentNode.insertBefore(placeholder, marker.nextSibling);

    document.body.appendChild(header);
    header.classList.add('viewport-floating-nav', 'is-scrolled');

    isFloating = true;
    positionFloatingNavbar();
  }

  function restoreNavbar() {
    if (!isFloating) return;

    marker.parentNode.insertBefore(header, placeholder);
    placeholder.remove();
    placeholder = null;

    header.classList.remove('viewport-floating-nav');
    header.style.left = '';
    header.style.width = '';

    isFloating = false;
  }

  function updateFloatingNavbar() {
    const shouldFloat = window.scrollY > 80;

    if (shouldFloat) {
      makeNavbarFloating();
      positionFloatingNavbar();
    } else {
      restoreNavbar();
    }
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        updateFloatingNavbar();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  window.addEventListener('resize', () => {
    updateFloatingNavbar();
    positionFloatingNavbar();
  });

  updateFloatingNavbar();
});

/* Minimal animated chocolate cursor — desktop only */
document.addEventListener('DOMContentLoaded', () => {
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  document.getElementById('chocolate-cursor')?.remove();

  const cursor = document.createElement('div');
  cursor.id = 'chocolate-cursor';
  cursor.innerHTML = '<span></span>';
  document.body.appendChild(cursor);
  document.body.classList.add('chocolate-cursor-active');

  let targetX = -100;
  let targetY = -100;
  let currentX = -100;
  let currentY = -100;

  function animateCursor() {
    currentX += (targetX - currentX) * 0.18;
    currentY += (targetY - currentY) * 0.18;
    cursor.style.transform = `translate(${currentX}px, ${currentY}px) translate(-50%, -50%)`;
    requestAnimationFrame(animateCursor);
  }

  animateCursor();

  window.addEventListener('mousemove', (event) => {
    targetX = event.clientX;
    targetY = event.clientY;
    cursor.classList.add('is-visible');

    const interactiveElement = event.target.closest(
      'a, button, input, textarea, select, [role="button"]'
    );

    cursor.classList.toggle('is-hover', Boolean(interactiveElement));
  });

  window.addEventListener('mousedown', () => {
    cursor.classList.add('is-clicking');
  });

  window.addEventListener('mouseup', () => {
    cursor.classList.remove('is-clicking');
  });

  document.addEventListener('mouseleave', () => {
    cursor.classList.remove('is-visible');
  });
});