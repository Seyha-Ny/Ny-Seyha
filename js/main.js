document.addEventListener('DOMContentLoaded', function () {
  // Animate letters in heading one by one
  const animateTextElement = document.querySelector('.animate-text');
  if (animateTextElement) {
    const processTextNode = (node, startDelay = 0) => {
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent;
        const delayStep = 0.35; // slower reveal per letter
        const gapBetweenSegments = 0.6; // pause between separate text segments
        const fragment = document.createDocumentFragment();

        for (let i = 0; i < text.length; i++) {
          const span = document.createElement('span');
          span.className = 'letter';
          span.textContent = text[i];
          span.style.animationDelay = (startDelay + i * delayStep) + 's';
          fragment.appendChild(span);
        }

        node.parentNode.replaceChild(fragment, node);
        return startDelay + text.length * delayStep + gapBetweenSegments;
      }
      return startDelay;
    };

    // Process direct text and accent span
    let currentDelay = 0;
    for (let child of animateTextElement.childNodes) {
      if (child.nodeType === Node.TEXT_NODE) {
        currentDelay = processTextNode(child, currentDelay);
      } else if (child.className === 'accent') {
        for (let node of child.childNodes) {
          if (node.nodeType === Node.TEXT_NODE) {
            currentDelay = processTextNode(node, currentDelay);
          }
        }
      }
    }
  }

  // Add looping glow animations to hero heading on load
  const heroHeading = document.querySelector('.hero-text h2 .accent');
  if (heroHeading) {
    heroHeading.style.animation = 'text-glow-loop 3s ease-in-out infinite';
  }

  // Add floating animation to profile photo on page load
  const profilePhoto = document.querySelector('.profile-photo');
  if (profilePhoto && !profilePhoto.style.animation.includes('float')) {
    const existingAnim = profilePhoto.style.animation;
    profilePhoto.style.animation = existingAnim ? existingAnim + ', float 4s ease-in-out infinite' : 'float 4s ease-in-out infinite';
  }

  // Add looping color shift to stat numbers
  const statNumbers = document.querySelectorAll('.stat-number');
  statNumbers.forEach((stat, idx) => {
    stat.style.animation = 'color-shift 4s ease-in-out infinite';
  });

  // Add continuous glow pulse to section headings
  const sectionHeadings = document.querySelectorAll('section h2 .accent');
  sectionHeadings.forEach(heading => {
    heading.style.animation = 'text-glow-loop 3.5s ease-in-out infinite';
  });

  // Add continuous pulsing animation to CTA button
  const ctaButton = document.querySelector('.nav .cta-btn');
  if (ctaButton) {
    ctaButton.style.animation = 'pulse 2s ease-in-out infinite';
  }

  // animate counters
  const counters = document.querySelectorAll('.stat-number');
  counters.forEach((counter, idx) => {
    if (!counter.hasAttribute('data-target')) return;
    const target = +counter.getAttribute('data-target') || 0;
    let current = 0;
    const step = Math.max(1, Math.floor(target / 20));
    setTimeout(() => {
      const interval = setInterval(() => {
        current += step;
        if (current >= target) {
          counter.textContent = target;
          clearInterval(interval);
        } else {
          counter.textContent = current;
        }
      }, 40);
    }, idx * 150);
  });

  // fill skill progress bars with scroll trigger
  const progressEls = document.querySelectorAll('.progress');
  const observerOptions = { threshold: 0.5 };
  const progressObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const pct = +entry.target.getAttribute('data-percent') || 0;
        const bar = entry.target.querySelector('.progress-bar');
        setTimeout(() => { bar.style.width = pct + '%'; }, 100);
        progressObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);
  progressEls.forEach(el => progressObserver.observe(el));

  // smooth scroll active nav highlighting
  const navLinks = document.querySelectorAll('.nav a');
  const sections = Array.from(document.querySelectorAll('main section, main [id]'))
    .filter(s => s.id);

  function setActive() {
    const y = window.scrollY + 120;
    let current = sections[0] && sections[0].id;
    for (const sec of sections) {
      if (sec.offsetTop <= y) current = sec.id;
    }
    navLinks.forEach(a => {
      const isActive = a.getAttribute('href') === ('#' + current);
      a.classList.toggle('active', isActive);
      if (isActive) a.style.textShadow = '0 0 20px rgba(0,212,255,0.8)';
      else a.style.textShadow = '';
    });
  }

  setActive();
  window.addEventListener('scroll', setActive);

  // make nav links smooth scroll with offset
  navLinks.forEach(link => {
    if (!link.hash) return;
    link.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(link.hash);
      if (!target) return;
      const offset = 90;
      const top = Math.max(0, target.offsetTop - offset);
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  // Stagger animations for cards on scroll
  const cards = document.querySelectorAll('.education-item, .service');
  const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, idx) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }, idx * 100);
        cardObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  cards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'all 0.6s cubic-bezier(0.34,1.56,0.64,1)';
    cardObserver.observe(card);
  });

  // Add subtle pulse animation on button hover
  const buttons = document.querySelectorAll('.hero-buttons a, form button');
  buttons.forEach(btn => {
    btn.addEventListener('mouseenter', function () {
      this.style.animation = 'pulse 1.5s ease-in-out';
    });
    btn.addEventListener('mouseleave', function () {
      this.style.animation = 'none';
    });
  });

  // Enhance form input interactions
  const inputs = document.querySelectorAll('form input, form textarea');
  inputs.forEach(input => {
    input.addEventListener('focus', function () {
      this.parentElement.style.transform = 'translateX(4px)';
    });
    input.addEventListener('blur', function () {
      this.parentElement.style.transform = 'translateX(0)';
    });
  });

  // Mobile & Tablet hamburger menu functionality
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('nav-menu');
  const mobileNavLinks = navMenu.querySelectorAll('a');

  // Toggle menu on hamburger click
  if (hamburger) {
    hamburger.addEventListener('click', function (e) {
      e.stopPropagation();
      hamburger.classList.toggle('active');
      navMenu.classList.toggle('active');
      document.body.classList.toggle('menu-open');
    });
  }

  // Close menu when a link is clicked
  mobileNavLinks.forEach(link => {
    link.addEventListener('click', function () {
      hamburger.classList.remove('active');
      navMenu.classList.remove('active');
      document.body.classList.remove('menu-open');
    });
  });

  // Close menu when clicking outside
  document.addEventListener('click', function (event) {
    if (hamburger && hamburger.offsetParent !== null && !event.target.closest('.site-header') && navMenu.classList.contains('active')) {
      hamburger.classList.remove('active');
      navMenu.classList.remove('active');
      document.body.classList.remove('menu-open');
    }
  });

  // Close menu on window resize if resizing back to desktop
  window.addEventListener('resize', function () {
    if (window.innerWidth > 900) {
      hamburger.classList.remove('active');
      navMenu.classList.remove('active');
      document.body.classList.remove('menu-open');
    }
  });
});
