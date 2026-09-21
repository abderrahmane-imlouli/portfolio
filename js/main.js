/**
 * Main Application Logic & Interactivity
 * Abderrahmane Imlouli Portfolio
 */

document.addEventListener('DOMContentLoaded', () => {
  // Mobile Nav Toggle
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const navLinks = document.getElementById('nav-links');

  if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', () => {
      const isExpanded = navLinks.style.display === 'flex';
      navLinks.style.display = isExpanded ? 'none' : 'flex';
      if (!isExpanded) {
        navLinks.style.flexDirection = 'column';
        navLinks.style.position = 'absolute';
        navLinks.style.top = '76px';
        navLinks.style.left = '0';
        navLinks.style.width = '100%';
        navLinks.style.background = 'var(--bg-secondary)';
        navLinks.style.padding = '24px';
        navLinks.style.borderBottom = '1px solid var(--border-color)';
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
});
