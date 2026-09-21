/**
 * Main Application Logic & Interactivity
 * Abderrahmane Imlouli Portfolio
 */

document.addEventListener('DOMContentLoaded', () => {
  // Mobile Nav Toggle with accessible class-based drawer
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const navLinks = document.getElementById('nav-links');

  function closeMobileMenu() {
    if (navLinks && navLinks.classList.contains('nav-open')) {
      navLinks.classList.remove('nav-open');
      if (mobileMenuBtn) {
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
        mobileMenuBtn.classList.remove('active');
      }
    }
  }

  function toggleMobileMenu() {
    if (!navLinks) return;
    const isOpen = navLinks.classList.toggle('nav-open');
    if (mobileMenuBtn) {
      mobileMenuBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      mobileMenuBtn.classList.toggle('active', isOpen);
    }
  }

  if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMobileMenu();
    });

    // Close mobile menu when a nav link is clicked
    navLinks.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        closeMobileMenu();
      });
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
      if (!navLinks.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
        closeMobileMenu();
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeMobileMenu();
      }
    });

    // Reset mobile menu state on window resize across breakpoints
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768) {
        closeMobileMenu();
      }
    });
  }

  // Smooth scroll active state tracking
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;
    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');
      const navItem = document.querySelector(`.nav-link[href*="${sectionId}"]`);
      
      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        if (navItem) navItem.classList.add('active');
      } else {
        if (navItem) navItem.classList.remove('active');
      }
    });
  });

  // Project Filtering Mechanism
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const categoryAttr = card.getAttribute('data-category') || '';
        const categories = categoryAttr.split(' ').map(c => c.trim()).filter(Boolean);
        
        if (filter === 'all' || categories.includes(filter) || card.classList.contains(`cat-${filter}`)) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // Secure Client-Side Contact Form Handling & Input Sanitization
  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');

  if (contactForm && formStatus) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('name');
      const emailInput = document.getElementById('email');
      const subjectInput = document.getElementById('subject');
      const messageInput = document.getElementById('message');

      // Basic HTML Entity Sanitizer to prevent XSS
      const sanitize = (str) => {
        return str
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&#x27;')
          .trim();
      };

      const name = sanitize(nameInput.value);
      const email = sanitize(emailInput.value);
      const subject = sanitize(subjectInput.value);
      const message = sanitize(messageInput.value);

      // Email Validation Regex
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!name || !email || !subject || !message) {
        formStatus.style.display = 'block';
        formStatus.style.color = 'var(--status-error)';
        formStatus.textContent = 'Please fill out all required fields.';
        return;
      }

      if (!emailRegex.test(email)) {
        formStatus.style.display = 'block';
        formStatus.style.color = 'var(--status-error)';
        formStatus.textContent = 'Please provide a valid email address.';
        return;
      }

      // Safe Direct Mail Client Fallback Trigger
      formStatus.style.display = 'block';
      formStatus.style.color = 'var(--accent-primary)';
      formStatus.textContent = '✓ Opening your email client to send message...';

      const mailtoUrl = `mailto:abderrahmaneimlouli0@gmail.com?subject=${encodeURIComponent('[Portfolio] ' + subject)}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`)}`;

      setTimeout(() => {
        window.location.href = mailtoUrl;
      }, 600);
    });
  }

  // ═══════════════════════════════════════════════════════════
  // Experience Section Mobile Accordion
  // ═══════════════════════════════════════════════════════════
  const expItems = document.querySelectorAll('.experience-item');

  function updateAccordionAria(isDesktop) {
    expItems.forEach(item => {
      const trigger = item.querySelector('.exp-header-trigger');
      const indicator = item.querySelector('.exp-toggle-indicator');
      if (isDesktop) {
        if (trigger) trigger.setAttribute('aria-expanded', 'true');
      } else {
        const isExpanded = item.classList.contains('is-expanded');
        if (trigger) trigger.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');
        if (indicator) indicator.textContent = isExpanded ? '−' : '+';
      }
    });
  }

  expItems.forEach(item => {
    const trigger = item.querySelector('.exp-header-trigger');
    const indicator = item.querySelector('.exp-toggle-indicator');
    if (!trigger) return;

    function toggleCard(e) {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      // Accordion only operates on mobile / tablet viewports (<= 768px)
      if (window.innerWidth > 768) return;

      const isCurrentlyExpanded = item.classList.contains('is-expanded');

      // Close all other experience cards to maintain compact mobile height
      expItems.forEach(other => {
        if (other !== item && other.classList.contains('is-expanded')) {
          other.classList.remove('is-expanded');
          const otherTrigger = other.querySelector('.exp-header-trigger');
          const otherInd = other.querySelector('.exp-toggle-indicator');
          if (otherTrigger) otherTrigger.setAttribute('aria-expanded', 'false');
          if (otherInd) otherInd.textContent = '+';
        }
      });

      // Toggle current card
      if (isCurrentlyExpanded) {
        // Return to small box
        item.classList.remove('is-expanded');
        trigger.setAttribute('aria-expanded', 'false');
        if (indicator) indicator.textContent = '+';
      } else {
        // Expand card
        item.classList.add('is-expanded');
        trigger.setAttribute('aria-expanded', 'true');
        if (indicator) indicator.textContent = '−';
      }
    }

    // Clicking header trigger (title, role, date, or + / − indicator)
    trigger.addEventListener('click', toggleCard);

    // Clicking anywhere on the surface of a collapsed card on mobile expands it
    item.addEventListener('click', (e) => {
      if (window.innerWidth > 768) return;
      if (!item.classList.contains('is-expanded')) {
        toggleCard(e);
      }
    });
  });

  // Sync initial ARIA state based on viewport width
  updateAccordionAria(window.innerWidth > 768);

  // Sync on resize across 768px boundary
  window.addEventListener('resize', () => {
    updateAccordionAria(window.innerWidth > 768);
  });
});
