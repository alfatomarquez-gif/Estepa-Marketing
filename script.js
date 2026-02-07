// ============================================
// MOBILE MENU TOGGLE
// ============================================
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');

if (navToggle) {
  navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
    
    // Update ARIA attribute
    const isExpanded = navMenu.classList.contains('active');
    navToggle.setAttribute('aria-expanded', isExpanded);
  });
}

// Close mobile menu when clicking on a nav link
const navLinks = document.querySelectorAll('.nav__link');
navLinks.forEach(link => {
  link.addEventListener('click', () => {
    navMenu.classList.remove('active');
    navToggle.classList.remove('active');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

// ============================================
// SMOOTH SCROLL
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    
    // Skip if it's just "#"
    if (href === '#' || !href) return;
    
    e.preventDefault();
    
    const targetId = href.substring(1);
    const targetElement = document.getElementById(targetId);
    
    if (targetElement) {
      // Get header height for offset
      const header = document.getElementById('header');
      const headerHeight = header ? header.offsetHeight : 80;
      
      const targetPosition = targetElement.offsetTop - headerHeight;
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  });
});

// ============================================
// ACTIVE NAVIGATION
// ============================================
const sections = document.querySelectorAll('section[id]');

function highlightNavigation() {
  const scrollY = window.pageYOffset;
  
  sections.forEach(section => {
    const sectionHeight = section.offsetHeight;
    const sectionTop = section.offsetTop - 100;
    const sectionId = section.getAttribute('id');
    const navLink = document.querySelector(`.nav__link[href="#${sectionId}"]`);
    
    if (navLink) {
      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLink.classList.add('active');
      } else {
        navLink.classList.remove('active');
      }
    }
  });
}

window.addEventListener('scroll', highlightNavigation);

// ============================================
// HEADER SCROLL EFFECT
// ============================================
const header = document.getElementById('header');

function headerScrollEffect() {
  if (window.scrollY > 50) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
}

window.addEventListener('scroll', headerScrollEffect);

// ============================================
// FAQ ACCORDION
// ============================================
const faqQuestions = document.querySelectorAll('.faq__question');

faqQuestions.forEach(question => {
  question.addEventListener('click', () => {
    const item = question.parentElement;
    const answer = item.querySelector('.faq__answer');
    const isExpanded = question.getAttribute('aria-expanded') === 'true';
    
    // Close all other FAQs
    faqQuestions.forEach(otherQuestion => {
      if (otherQuestion !== question) {
        otherQuestion.setAttribute('aria-expanded', 'false');
        otherQuestion.parentElement.querySelector('.faq__answer').classList.remove('active');
      }
    });
    
    // Toggle current FAQ
    if (isExpanded) {
      question.setAttribute('aria-expanded', 'false');
      answer.classList.remove('active');
    } else {
      question.setAttribute('aria-expanded', 'true');
      answer.classList.add('active');
    }
  });
});

// ============================================
// FORM VALIDATION
// ============================================
const contactForm = document.getElementById('contact-form');

if (contactForm) {
  // Email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  // Real-time validation
  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const messageInput = document.getElementById('message');
  
  function validateField(input, errorId, validationFn) {
    const errorElement = document.getElementById(errorId);
    const value = input.value.trim();
    
    if (!validationFn(value)) {
      input.style.borderColor = '#ef4444';
      return false;
    } else {
      input.style.borderColor = '#10b981';
      errorElement.textContent = '';
      return true;
    }
  }
  
  function showError(input, errorId, message) {
    const errorElement = document.getElementById(errorId);
    input.style.borderColor = '#ef4444';
    errorElement.textContent = message;
  }
  
  function clearError(input, errorId) {
    const errorElement = document.getElementById(errorId);
    input.style.borderColor = '#e2e8f0';
    errorElement.textContent = '';
  }
  
  // Form submit handler
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Clear previous errors
    clearError(nameInput, 'name-error');
    clearError(emailInput, 'email-error');
    clearError(messageInput, 'message-error');
    
    let isValid = true;
    
    // Validate name
    if (nameInput.value.trim() === '') {
      showError(nameInput, 'name-error', 'Por favor, ingresa tu nombre completo');
      isValid = false;
    } else if (nameInput.value.trim().length < 3) {
      showError(nameInput, 'name-error', 'El nombre debe tener al menos 3 caracteres');
      isValid = false;
    }
    
    // Validate email
    if (emailInput.value.trim() === '') {
      showError(emailInput, 'email-error', 'Por favor, ingresa tu email');
      isValid = false;
    } else if (!emailRegex.test(emailInput.value.trim())) {
      showError(emailInput, 'email-error', 'Por favor, ingresa un email válido');
      isValid = false;
    }
    
    // Validate message
    if (messageInput.value.trim() === '') {
      showError(messageInput, 'message-error', 'Por favor, escribe un mensaje');
      isValid = false;
    } else if (messageInput.value.trim().length < 10) {
      showError(messageInput, 'message-error', 'El mensaje debe tener al menos 10 caracteres');
      isValid = false;
    }
    
    // If form is valid, show success message
    if (isValid) {
      // Clear form
      contactForm.reset();
      
      // Clear border colors
      nameInput.style.borderColor = '#e2e8f0';
      emailInput.style.borderColor = '#e2e8f0';
      messageInput.style.borderColor = '#e2e8f0';
      
      // Show success message
      const successMessage = document.getElementById('form-success');
      successMessage.classList.add('active');
      
      // Hide success message after 5 seconds
      setTimeout(() => {
        successMessage.classList.remove('active');
      }, 5000);
      
      // In a real application, you would send the form data to a server here
      console.log('Form submitted successfully!');
      console.log({
        name: nameInput.value,
        email: emailInput.value,
        phone: document.getElementById('phone').value,
        company: document.getElementById('company').value,
        message: messageInput.value
      });
    }
  });
  
  // Real-time validation on blur
  nameInput.addEventListener('blur', function() {
    if (this.value.trim() !== '') {
      if (this.value.trim().length < 3) {
        showError(this, 'name-error', 'El nombre debe tener al menos 3 caracteres');
      } else {
        clearError(this, 'name-error');
        this.style.borderColor = '#10b981';
      }
    }
  });
  
  emailInput.addEventListener('blur', function() {
    if (this.value.trim() !== '') {
      if (!emailRegex.test(this.value.trim())) {
        showError(this, 'email-error', 'Por favor, ingresa un email válido');
      } else {
        clearError(this, 'email-error');
        this.style.borderColor = '#10b981';
      }
    }
  });
  
  messageInput.addEventListener('blur', function() {
    if (this.value.trim() !== '') {
      if (this.value.trim().length < 10) {
        showError(this, 'message-error', 'El mensaje debe tener al menos 10 caracteres');
      } else {
        clearError(this, 'message-error');
        this.style.borderColor = '#10b981';
      }
    }
  });
}

// ============================================
// BACK TO TOP BUTTON
// ============================================
const backToTopButton = document.getElementById('back-to-top');

function toggleBackToTop() {
  if (window.scrollY > 300) {
    backToTopButton.classList.add('visible');
  } else {
    backToTopButton.classList.remove('visible');
  }
}

window.addEventListener('scroll', toggleBackToTop);

if (backToTopButton) {
  backToTopButton.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

// ============================================
// FADE IN ON SCROLL (Optional Enhancement)
// ============================================
function fadeInOnScroll() {
  const elements = document.querySelectorAll('.card, .benefit-item');
  
  elements.forEach(element => {
    const elementTop = element.getBoundingClientRect().top;
    const windowHeight = window.innerHeight;
    
    if (elementTop < windowHeight - 100) {
      element.classList.add('fade-in');
    }
  });
}

// Initial check
fadeInOnScroll();

// Check on scroll
window.addEventListener('scroll', fadeInOnScroll);

// ============================================
// INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', function() {
  console.log('Estepa Marketing landing page loaded successfully!');
  
  // Initialize scroll effects
  headerScrollEffect();
  highlightNavigation();
  toggleBackToTop();
  fadeInOnScroll();
});
