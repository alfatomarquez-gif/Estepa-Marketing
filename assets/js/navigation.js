/* ===================================
   NAVIGATION.JS - Menu & Scroll Behavior
   =================================== */

document.addEventListener('DOMContentLoaded', function() {
  initNavigation();
  initMobileMenu();
  initHeaderScroll();
  initActivePageIndicator();
});

/* ===================================
   NAVIGATION INITIALIZATION
   =================================== */
function initNavigation() {
  // Handle dropdown menus
  const navItems = document.querySelectorAll('.nav-item');
  
  navItems.forEach(item => {
    const dropdown = item.querySelector('.dropdown-menu, .mega-menu');
    
    if (dropdown) {
      let timeout;
      
      item.addEventListener('mouseenter', function() {
        clearTimeout(timeout);
        dropdown.style.display = 'block';
      });
      
      item.addEventListener('mouseleave', function() {
        timeout = setTimeout(() => {
          dropdown.style.display = 'none';
        }, 200);
      });
    }
  });
}

/* ===================================
   MOBILE MENU
   =================================== */
function initMobileMenu() {
  const mobileToggle = document.querySelector('.mobile-menu-toggle');
  const mobileNav = document.querySelector('.mobile-nav');
  
  if (mobileToggle && mobileNav) {
    mobileToggle.addEventListener('click', function() {
      this.classList.toggle('active');
      mobileNav.classList.toggle('active');
      document.body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : '';
    });
    
    // Handle mobile dropdown toggles
    const mobileNavLinks = mobileNav.querySelectorAll('.nav-link');
    
    mobileNavLinks.forEach(link => {
      const navItem = link.closest('.mobile-nav-item');
      const dropdown = navItem.querySelector('.mobile-dropdown');
      
      if (dropdown) {
        link.addEventListener('click', function(e) {
          e.preventDefault();
          dropdown.classList.toggle('active');
          
          const icon = this.querySelector('svg');
          if (icon) {
            icon.style.transform = dropdown.classList.contains('active') ? 'rotate(180deg)' : 'rotate(0)';
          }
        });
      }
    });
    
    // Close mobile menu when clicking on a link (for anchor links)
    mobileNav.querySelectorAll('.dropdown-item').forEach(item => {
      item.addEventListener('click', function() {
        if (this.getAttribute('href').startsWith('#')) {
          mobileToggle.classList.remove('active');
          mobileNav.classList.remove('active');
          document.body.style.overflow = '';
        }
      });
    });
  }
}

/* ===================================
   HEADER SCROLL BEHAVIOR
   =================================== */
function initHeaderScroll() {
  const header = document.querySelector('.header');
  
  if (header) {
    let lastScroll = 0;
    
    window.addEventListener('scroll', throttle(function() {
      const currentScroll = window.pageYOffset;
      
      // Add scrolled class for styling
      if (currentScroll > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
      
      // Optional: Hide header on scroll down, show on scroll up
      // if (currentScroll > lastScroll && currentScroll > 100) {
      //   header.style.transform = 'translateY(-100%)';
      // } else {
      //   header.style.transform = 'translateY(0)';
      // }
      
      lastScroll = currentScroll;
    }, 100));
  }
}

/* ===================================
   ACTIVE PAGE INDICATOR
   =================================== */
function initActivePageIndicator() {
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('.nav-link');
  
  navLinks.forEach(link => {
    const linkPath = new URL(link.href).pathname;
    
    // Check if current page matches link
    if (linkPath === currentPath) {
      link.classList.add('active');
    }
    
    // Also check for index.html default
    if (currentPath === '/' || currentPath.endsWith('/index.html')) {
      if (linkPath === '/' || linkPath.endsWith('/index.html')) {
        link.classList.add('active');
      }
    }
  });
  
  // Handle scroll spy for sections on same page
  if (document.querySelectorAll('[id]').length > 0) {
    window.addEventListener('scroll', throttle(updateActiveSection, 100));
  }
}

function updateActiveSection() {
  const sections = document.querySelectorAll('[id]');
  const scrollY = window.pageYOffset;
  
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 100;
    const sectionHeight = section.offsetHeight;
    const sectionId = section.getAttribute('id');
    
    if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
      // Find nav link with href to this section
      const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
      if (navLink) {
        document.querySelectorAll('.nav-link').forEach(link => {
          if (link.getAttribute('href').startsWith('#')) {
            link.classList.remove('active');
          }
        });
        navLink.classList.add('active');
      }
    }
  });
}

/* ===================================
   SEARCH FUNCTIONALITY
   =================================== */
function initSearch() {
  const searchBtn = document.querySelector('.search-btn');
  const searchModal = document.getElementById('searchModal');
  
  if (searchBtn && searchModal) {
    searchBtn.addEventListener('click', function() {
      openModal('searchModal');
      setTimeout(() => {
        const searchInput = searchModal.querySelector('input');
        if (searchInput) searchInput.focus();
      }, 100);
    });
    
    // Keyboard shortcut (Ctrl/Cmd + K)
    document.addEventListener('keydown', function(e) {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        openModal('searchModal');
      }
    });
  }
}

// Initialize search if elements exist
if (document.querySelector('.search-btn')) {
  initSearch();
}
