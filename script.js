/* ============================================
   経理アウトソーシング LP — script.js
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  // ==========================================
  // Header scroll effect
  // ==========================================
  const header = document.getElementById('header');

  const handleScroll = () => {
    if (window.scrollY > 60) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // ==========================================
  // Mobile nav toggle
  // ==========================================
  const hamburger = document.getElementById('hamburger');
  const nav = document.getElementById('nav');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    nav.classList.toggle('active');
    document.body.style.overflow = nav.classList.contains('active') ? 'hidden' : '';
  });

  // Close nav on link click
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      nav.classList.remove('active');
      document.body.style.overflow = '';
    });
  });

  // ==========================================
  // Scroll animations with Intersection Observer
  // ==========================================
  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -80px 0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        // Add stagger delay based on sibling index
        const siblings = entry.target.parentElement.querySelectorAll('.animate-on-scroll');
        let siblingIndex = 0;
        siblings.forEach((s, i) => {
          if (s === entry.target) siblingIndex = i;
        });

        setTimeout(() => {
          entry.target.classList.add('visible');
        }, siblingIndex * 100);

        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.animate-on-scroll').forEach(el => {
    observer.observe(el);
  });

  // ==========================================
  // FAQ Accordion
  // ==========================================
  document.querySelectorAll('.faq-question').forEach(button => {
    button.addEventListener('click', () => {
      const item = button.closest('.faq-item');
      const isActive = item.classList.contains('active');

      // Close all
      document.querySelectorAll('.faq-item').forEach(faq => {
        faq.classList.remove('active');
      });

      // Open clicked if it wasn't active
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });

  // ==========================================
  // Smooth scroll for anchor links
  // ==========================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = anchor.getAttribute('href');

      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (target) {
        const headerHeight = header.offsetHeight;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // ==========================================
  // Contact form handling
  // ==========================================
  const form = document.getElementById('contact-form');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const submitBtn = document.getElementById('submit-btn');
    const originalContent = submitBtn.innerHTML;

    // Basic validation
    const company = document.getElementById('company').value.trim();
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();

    if (!company || !name || !email) {
      showToast('必須項目をすべてご入力ください。', 'error');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showToast('正しいメールアドレスをご入力ください。', 'error');
      return;
    }

    // Simulate submission
    submitBtn.innerHTML = '<span>送信中...</span>';
    submitBtn.disabled = true;
    submitBtn.style.opacity = '0.7';

    setTimeout(() => {
      submitBtn.innerHTML = '<span>✓ 送信完了</span>';
      submitBtn.style.background = 'linear-gradient(135deg, #22c55e, #16a34a)';
      submitBtn.style.color = '#fff';

      showToast('お問い合わせを受け付けました。担当者よりご連絡いたします。', 'success');

      setTimeout(() => {
        form.reset();
        submitBtn.innerHTML = originalContent;
        submitBtn.disabled = false;
        submitBtn.style.opacity = '1';
        submitBtn.style.background = '';
        submitBtn.style.color = '';
      }, 3000);
    }, 1500);
  });

  // ==========================================
  // Toast notification
  // ==========================================
  function showToast(message, type = 'success') {
    // Remove existing toasts
    document.querySelectorAll('.toast').forEach(t => t.remove());

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
      <span class="toast-icon">${type === 'success' ? '✓' : '⚠'}</span>
      <span class="toast-message">${message}</span>
    `;

    // Styles
    Object.assign(toast.style, {
      position: 'fixed',
      bottom: '2rem',
      right: '2rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      padding: '1rem 1.5rem',
      background: type === 'success' ? '#0f2240' : '#7f1d1d',
      color: '#fff',
      borderRadius: '12px',
      boxShadow: '0 8px 30px rgba(0,0,0,0.2)',
      fontSize: '0.9rem',
      fontFamily: "'Noto Sans JP', sans-serif",
      zIndex: '9999',
      transform: 'translateY(100px)',
      opacity: '0',
      transition: 'all 0.4s ease'
    });

    document.body.appendChild(toast);

    // Animate in
    requestAnimationFrame(() => {
      toast.style.transform = 'translateY(0)';
      toast.style.opacity = '1';
    });

    // Remove after delay
    setTimeout(() => {
      toast.style.transform = 'translateY(100px)';
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 400);
    }, 4000);
  }

  // ==========================================
  // Active nav link on scroll
  // ==========================================
  const sections = document.querySelectorAll('section[id]');

  const highlightNav = () => {
    const scrollPos = window.scrollY + header.offsetHeight + 100;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      const navLink = document.querySelector(`.nav-link[href="#${id}"]`);

      if (navLink) {
        if (scrollPos >= top && scrollPos < top + height) {
          document.querySelectorAll('.nav-link').forEach(l => l.style.color = '');
          navLink.style.color = '#e6bf5e';
        }
      }
    });
  };

  window.addEventListener('scroll', highlightNav, { passive: true });

  // ==========================================
  // Counter animation for hero stats
  // ==========================================
  const heroStats = document.querySelector('.hero-stats');
  let counterAnimated = false;

  const animateCounters = () => {
    if (counterAnimated) return;

    const statNumbers = heroStats.querySelectorAll('.hero-stat-number');

    statNumbers.forEach(stat => {
      const text = stat.textContent;
      const match = text.match(/(\d+)/);
      if (!match) return;

      const target = parseInt(match[1]);
      const suffix = text.replace(match[1], '').trim();
      const smallMatch = stat.innerHTML.match(/<small>.*?<\/small>/);
      const smallTag = smallMatch ? smallMatch[0] : '';

      let current = 0;
      const increment = target / 40;
      const duration = 1500;
      const stepTime = duration / 40;

      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        stat.innerHTML = Math.floor(current) + smallTag;
      }, stepTime);
    });

    counterAnimated = true;
  };

  // Trigger counter animation when hero stats come into view
  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounters();
        statsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  if (heroStats) {
    statsObserver.observe(heroStats);
  }
});
