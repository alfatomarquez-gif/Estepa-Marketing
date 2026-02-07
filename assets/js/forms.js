/* ===================================
   FORMS.JS - Form Validation & Handling
   =================================== */

document.addEventListener('DOMContentLoaded', function() {
  initForms();
  initMultiStepForms();
  initPricingToggle();
});

/* ===================================
   FORM VALIDATION
   =================================== */
function initForms() {
  const forms = document.querySelectorAll('form[data-validate]');
  
  forms.forEach(form => {
    // Real-time validation
    const inputs = form.querySelectorAll('.form-control');
    inputs.forEach(input => {
      input.addEventListener('blur', function() {
        validateInput(this);
      });
      
      input.addEventListener('input', function() {
        if (this.classList.contains('is-invalid')) {
          validateInput(this);
        }
      });
    });
    
    // Form submission
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      
      let isValid = true;
      inputs.forEach(input => {
        if (!validateInput(input)) {
          isValid = false;
        }
      });
      
      if (isValid) {
        handleFormSubmit(form);
      } else {
        showToast('Por favor, corrige los errores en el formulario', 'error');
      }
    });
  });
}

function validateInput(input) {
  const value = input.value.trim();
  const type = input.type;
  const required = input.hasAttribute('required');
  
  let isValid = true;
  let errorMessage = '';
  
  // Check if required
  if (required && !value) {
    isValid = false;
    errorMessage = 'Este campo es requerido';
  }
  
  // Validate email
  else if (type === 'email' && value) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      isValid = false;
      errorMessage = 'Ingresa un email válido';
    }
  }
  
  // Validate phone
  else if (input.name === 'phone' && value) {
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    if (!phoneRegex.test(value) || value.length < 8) {
      isValid = false;
      errorMessage = 'Ingresa un teléfono válido';
    }
  }
  
  // Validate minimum length
  else if (input.hasAttribute('minlength')) {
    const minLength = parseInt(input.getAttribute('minlength'));
    if (value.length < minLength) {
      isValid = false;
      errorMessage = `Mínimo ${minLength} caracteres`;
    }
  }
  
  // Update UI
  const formGroup = input.closest('.form-group');
  let feedback = formGroup.querySelector('.form-feedback');
  
  if (!feedback) {
    feedback = document.createElement('div');
    feedback.className = 'form-feedback';
    input.parentNode.appendChild(feedback);
  }
  
  if (isValid) {
    input.classList.remove('is-invalid');
    input.classList.add('is-valid');
    feedback.classList.remove('invalid-feedback');
    feedback.classList.add('valid-feedback');
    feedback.textContent = '';
  } else {
    input.classList.remove('is-valid');
    input.classList.add('is-invalid');
    feedback.classList.remove('valid-feedback');
    feedback.classList.add('invalid-feedback');
    feedback.textContent = errorMessage;
  }
  
  return isValid;
}

/* ===================================
   FORM SUBMISSION
   =================================== */
function handleFormSubmit(form) {
  const submitBtn = form.querySelector('[type="submit"]');
  const originalText = submitBtn.textContent;
  
  // Show loading state
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<span class="spinner"></span> Enviando...';
  
  // Get form data
  const formData = new FormData(form);
  const data = Object.fromEntries(formData);
  
  // Simulate API call
  setTimeout(() => {
    console.log('Form submitted:', data);
    
    // Show success message
    showToast('¡Formulario enviado exitosamente!', 'success');
    
    // Reset form
    form.reset();
    form.querySelectorAll('.form-control').forEach(input => {
      input.classList.remove('is-valid', 'is-invalid');
    });
    
    // Reset button
    submitBtn.disabled = false;
    submitBtn.textContent = originalText;
    
    // Optional: Show success modal
    const successModal = document.getElementById('successModal');
    if (successModal) {
      openModal('successModal');
    }
  }, 1500);
}

/* ===================================
   MULTI-STEP FORMS
   =================================== */
function initMultiStepForms() {
  const multiStepForms = document.querySelectorAll('[data-multi-step]');
  
  multiStepForms.forEach(form => {
    let currentStep = 0;
    const steps = form.querySelectorAll('.form-step-content');
    const progressSteps = form.querySelectorAll('.form-step');
    const nextBtns = form.querySelectorAll('[data-next]');
    const prevBtns = form.querySelectorAll('[data-prev]');
    
    // Show first step
    showStep(currentStep);
    
    // Next button handlers
    nextBtns.forEach(btn => {
      btn.addEventListener('click', function() {
        const currentStepElement = steps[currentStep];
        const inputs = currentStepElement.querySelectorAll('.form-control[required]');
        
        let isValid = true;
        inputs.forEach(input => {
          if (!validateInput(input)) {
            isValid = false;
          }
        });
        
        if (isValid && currentStep < steps.length - 1) {
          currentStep++;
          showStep(currentStep);
        }
      });
    });
    
    // Previous button handlers
    prevBtns.forEach(btn => {
      btn.addEventListener('click', function() {
        if (currentStep > 0) {
          currentStep--;
          showStep(currentStep);
        }
      });
    });
    
    function showStep(stepIndex) {
      // Hide all steps
      steps.forEach(step => {
        step.classList.remove('active');
      });
      
      // Show current step
      steps[stepIndex].classList.add('active');
      
      // Update progress indicators
      progressSteps.forEach((step, index) => {
        if (index < stepIndex) {
          step.classList.add('completed');
          step.classList.remove('active');
        } else if (index === stepIndex) {
          step.classList.add('active');
          step.classList.remove('completed');
        } else {
          step.classList.remove('active', 'completed');
        }
      });
      
      // Scroll to top of form
      form.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
}

/* ===================================
   PRICING TOGGLE (Monthly/Annual)
   =================================== */
function initPricingToggle() {
  const toggleSwitch = document.querySelector('.toggle-switch');
  const monthlyPrices = document.querySelectorAll('[data-monthly]');
  const annualPrices = document.querySelectorAll('[data-annual]');
  
  if (toggleSwitch) {
    toggleSwitch.addEventListener('click', function() {
      this.classList.toggle('active');
      const isAnnual = this.classList.contains('active');
      
      // Update labels
      document.querySelectorAll('.toggle-label').forEach(label => {
        label.classList.remove('active');
      });
      
      if (isAnnual) {
        document.querySelector('.toggle-label:last-child').classList.add('active');
      } else {
        document.querySelector('.toggle-label:first-child').classList.add('active');
      }
      
      // Update prices with animation
      monthlyPrices.forEach(price => {
        price.style.display = isAnnual ? 'none' : 'block';
      });
      
      annualPrices.forEach(price => {
        price.style.display = isAnnual ? 'block' : 'none';
      });
    });
  }
}

/* ===================================
   NEWSLETTER FORM
   =================================== */
const newsletterForms = document.querySelectorAll('.newsletter-form');

newsletterForms.forEach(form => {
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const input = this.querySelector('.newsletter-input');
    const email = input.value.trim();
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!emailRegex.test(email)) {
      showToast('Por favor, ingresa un email válido', 'error');
      return;
    }
    
    // Show loading
    const btn = this.querySelector('.newsletter-btn');
    const originalText = btn.textContent;
    btn.textContent = 'Suscribiendo...';
    btn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
      showToast('¡Gracias por suscribirte!', 'success');
      input.value = '';
      btn.textContent = originalText;
      btn.disabled = false;
    }, 1000);
  });
});
