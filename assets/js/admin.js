/**
 * ESTEPA MARKETING - ADMIN UI FUNCTIONALITY
 * Sistema de Gestión Administrativa - Interface Logic
 */

// ============================================
// SIDEBAR & NAVIGATION
// ============================================

/**
 * Inicializar sidebar y navegación
 */
function initSidebar() {
  const toggle = document.querySelector('.btn-menu-toggle');
  const sidebar = document.querySelector('.admin-sidebar');
  const overlay = document.querySelector('.sidebar-overlay');
  
  // Toggle sidebar en móvil
  toggle?.addEventListener('click', () => {
    sidebar?.classList.toggle('open');
    if (overlay) {
      overlay.style.display = sidebar.classList.contains('open') ? 'block' : 'none';
    }
  });
  
  // Cerrar sidebar al hacer click en overlay
  overlay?.addEventListener('click', () => {
    sidebar?.classList.remove('open');
    overlay.style.display = 'none';
  });
  
  // Marcar elemento activo en navegación
  const currentPath = window.location.pathname;
  document.querySelectorAll('.nav-item').forEach(item => {
    if (item.getAttribute('href') === currentPath) {
      item.classList.add('active');
    }
  });
}

// ============================================
// THEME TOGGLE
// ============================================

/**
 * Inicializar toggle de tema claro/oscuro
 */
function initTheme() {
  const toggle = document.querySelector('.theme-toggle');
  
  // Cargar tema guardado
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    document.body.classList.add('dark-mode');
    if (toggle) toggle.innerHTML = '☀️';
  }
  
  // Toggle tema
  toggle?.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    toggle.innerHTML = isDark ? '☀️' : '🌙';
  });
}

// ============================================
// MODALS
// ============================================

/**
 * Abrir modal por ID
 * @param {string} modalId - ID del modal
 */
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

/**
 * Cerrar modal por ID
 * @param {string} modalId - ID del modal
 */
function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

/**
 * Inicializar modales
 */
function initModals() {
  // Cerrar modal al hacer click en el backdrop
  document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal(modal.id);
      }
    });
  });
  
  // Cerrar modal con botones de cerrar
  document.querySelectorAll('.modal-close, [data-modal-close]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const modal = btn.closest('.modal');
      if (modal) closeModal(modal.id);
    });
  });
  
  // Abrir modal con botones data-modal-open
  document.querySelectorAll('[data-modal-open]').forEach(btn => {
    btn.addEventListener('click', () => {
      const modalId = btn.getAttribute('data-modal-open');
      openModal(modalId);
    });
  });
  
  // Cerrar modal con tecla ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const activeModal = document.querySelector('.modal.active');
      if (activeModal) closeModal(activeModal.id);
    }
  });
}

// ============================================
// NOTIFICATIONS / TOASTS
// ============================================

/**
 * Mostrar notificación toast
 * @param {string} message - Mensaje a mostrar
 * @param {string} type - Tipo: 'success', 'error', 'warning', 'info'
 * @param {number} duration - Duración en ms (default: 3000)
 */
function showNotification(message, type = 'info', duration = 3000) {
  const toast = document.createElement('div');
  toast.className = `notification-toast ${type}`;
  
  // Icono según tipo
  const icons = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ'
  };
  
  toast.innerHTML = `
    <div style="display: flex; align-items: center; gap: 0.75rem;">
      <span style="font-size: 1.25rem;">${icons[type] || icons.info}</span>
      <span>${message}</span>
    </div>
  `;
  
  document.body.appendChild(toast);
  
  // Animar entrada
  setTimeout(() => toast.classList.add('show'), 100);
  
  // Animar salida y remover
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

// ============================================
// DRAG & DROP
// ============================================

/**
 * Inicializar zona de drag & drop para archivos
 * @param {string} dropZoneId - ID del elemento drop zone
 * @param {Function} onFilesDropped - Callback cuando se sueltan archivos
 */
function initDragDrop(dropZoneId, onFilesDropped) {
  const dropZone = document.getElementById(dropZoneId);
  if (!dropZone) return;
  
  // Prevenir comportamiento por defecto
  ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dropZone.addEventListener(eventName, e => {
      e.preventDefault();
      e.stopPropagation();
    });
  });
  
  // Agregar clase al entrar
  ['dragenter', 'dragover'].forEach(eventName => {
    dropZone.addEventListener(eventName, () => {
      dropZone.classList.add('drag-over');
    });
  });
  
  // Quitar clase al salir
  ['dragleave', 'drop'].forEach(eventName => {
    dropZone.addEventListener(eventName, () => {
      dropZone.classList.remove('drag-over');
    });
  });
  
  // Manejar drop
  dropZone.addEventListener('drop', e => {
    const files = Array.from(e.dataTransfer.files);
    if (onFilesDropped && typeof onFilesDropped === 'function') {
      onFilesDropped(files);
    }
  });
  
  // También permitir click para seleccionar archivos
  dropZone.addEventListener('click', () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = true;
    input.onchange = e => {
      const files = Array.from(e.target.files);
      if (onFilesDropped && typeof onFilesDropped === 'function') {
        onFilesDropped(files);
      }
    };
    input.click();
  });
}

// ============================================
// SEARCH & FILTER
// ============================================

/**
 * Inicializar búsqueda en tabla
 * @param {string} inputId - ID del input de búsqueda
 * @param {string} tableId - ID de la tabla
 */
function initSearch(inputId, tableId) {
  const input = document.getElementById(inputId);
  const table = document.getElementById(tableId);
  
  if (!input || !table) return;
  
  input.addEventListener('input', e => {
    const term = e.target.value.toLowerCase().trim();
    const rows = table.querySelectorAll('tbody tr');
    
    rows.forEach(row => {
      const text = row.textContent.toLowerCase();
      row.style.display = text.includes(term) ? '' : 'none';
    });
  });
}

/**
 * Filtrar elementos por múltiples criterios
 * @param {string} containerId - ID del contenedor
 * @param {Object} filters - Objeto con filtros
 */
function filterElements(containerId, filters) {
  const container = document.getElementById(containerId);
  if (!container) return;
  
  const elements = container.querySelectorAll('[data-filterable]');
  
  elements.forEach(element => {
    let show = true;
    
    Object.keys(filters).forEach(key => {
      const filterValue = filters[key];
      if (!filterValue) return;
      
      const elementValue = element.getAttribute(`data-${key}`);
      if (elementValue && elementValue !== filterValue) {
        show = false;
      }
    });
    
    element.style.display = show ? '' : 'none';
  });
}

// ============================================
// FORM VALIDATION
// ============================================

/**
 * Validar formulario
 * @param {string} formId - ID del formulario
 * @returns {boolean} - true si es válido
 */
function validateForm(formId) {
  const form = document.getElementById(formId);
  if (!form) return false;
  
  const inputs = form.querySelectorAll('[required]');
  let valid = true;
  
  inputs.forEach(input => {
    if (!input.value.trim()) {
      input.classList.add('error');
      valid = false;
      
      // Quitar error al escribir
      input.addEventListener('input', () => {
        input.classList.remove('error');
      }, { once: true });
    } else {
      input.classList.remove('error');
    }
  });
  
  if (!valid) {
    showNotification('Por favor completa todos los campos requeridos', 'error');
  }
  
  return valid;
}

/**
 * Validar email
 * @param {string} email - Email a validar
 * @returns {boolean}
 */
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

/**
 * Validar URL
 * @param {string} url - URL a validar
 * @returns {boolean}
 */
function validateURL(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

// ============================================
// DROPDOWN MENUS
// ============================================

/**
 * Inicializar dropdowns
 */
function initDropdowns() {
  document.querySelectorAll('.dropdown-toggle').forEach(toggle => {
    toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const dropdown = toggle.closest('.dropdown');
      
      // Cerrar otros dropdowns
      document.querySelectorAll('.dropdown.active').forEach(other => {
        if (other !== dropdown) other.classList.remove('active');
      });
      
      dropdown?.classList.toggle('active');
    });
  });
  
  // Cerrar dropdown al hacer click fuera
  document.addEventListener('click', () => {
    document.querySelectorAll('.dropdown.active').forEach(dropdown => {
      dropdown.classList.remove('active');
    });
  });
}

// ============================================
// TABS
// ============================================

/**
 * Inicializar tabs
 */
function initTabs() {
  document.querySelectorAll('[data-tab]').forEach(tab => {
    tab.addEventListener('click', () => {
      const tabGroup = tab.closest('[data-tab-group]');
      const tabId = tab.getAttribute('data-tab');
      
      if (!tabGroup) return;
      
      // Desactivar todos los tabs y paneles
      tabGroup.querySelectorAll('[data-tab]').forEach(t => {
        t.classList.remove('active');
      });
      document.querySelectorAll(`[data-tab-panel]`).forEach(panel => {
        panel.classList.remove('active');
        panel.style.display = 'none';
      });
      
      // Activar tab y panel actual
      tab.classList.add('active');
      const panel = document.querySelector(`[data-tab-panel="${tabId}"]`);
      if (panel) {
        panel.classList.add('active');
        panel.style.display = 'block';
      }
    });
  });
}

// ============================================
// LOADING STATES
// ============================================

/**
 * Mostrar loading en un elemento
 * @param {string} elementId - ID del elemento
 */
function showLoading(elementId) {
  const element = document.getElementById(elementId);
  if (!element) return;
  
  element.innerHTML = `
    <div style="display: flex; justify-content: center; align-items: center; padding: 2rem;">
      <div class="spinner"></div>
      <span style="margin-left: 1rem;">Cargando...</span>
    </div>
  `;
}

/**
 * Mostrar loading en botón
 * @param {HTMLElement} button - Elemento botón
 * @param {boolean} loading - Estado de loading
 */
function setButtonLoading(button, loading) {
  if (loading) {
    button.disabled = true;
    button.dataset.originalText = button.innerHTML;
    button.innerHTML = '<span class="spinner"></span> Cargando...';
  } else {
    button.disabled = false;
    button.innerHTML = button.dataset.originalText || button.innerHTML;
  }
}

// ============================================
// UTILITIES
// ============================================

/**
 * Formatear fecha
 * @param {string|Date} date - Fecha a formatear
 * @returns {string}
 */
function formatDate(date) {
  const d = new Date(date);
  return d.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

/**
 * Formatear fecha y hora
 * @param {string|Date} date - Fecha a formatear
 * @returns {string}
 */
function formatDateTime(date) {
  const d = new Date(date);
  return d.toLocaleString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

/**
 * Formatear número
 * @param {number} num - Número a formatear
 * @returns {string}
 */
function formatNumber(num) {
  return new Intl.NumberFormat('es-ES').format(num);
}

/**
 * Formatear tamaño de archivo
 * @param {number} bytes - Tamaño en bytes
 * @returns {string}
 */
function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Debounce function
 * @param {Function} func - Función a debounce
 * @param {number} wait - Tiempo de espera en ms
 * @returns {Function}
 */
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Copiar texto al portapapeles
 * @param {string} text - Texto a copiar
 */
async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    showNotification('Copiado al portapapeles', 'success');
  } catch (err) {
    showNotification('Error al copiar', 'error');
  }
}

/**
 * Confirmar acción
 * @param {string} message - Mensaje de confirmación
 * @returns {boolean}
 */
function confirm(message) {
  return window.confirm(message);
}

/**
 * Scroll suave a elemento
 * @param {string} elementId - ID del elemento
 */
function scrollToElement(elementId) {
  const element = document.getElementById(elementId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

// ============================================
// INICIALIZACIÓN
// ============================================

/**
 * Inicializar todas las funcionalidades al cargar el DOM
 */
document.addEventListener('DOMContentLoaded', () => {
  initSidebar();
  initTheme();
  initModals();
  initDropdowns();
  initTabs();
  
  console.log('Admin UI initialized');
});

// ============================================
// EXPORTAR FUNCIONES
// ============================================

// Hacer funciones disponibles globalmente
window.AdminUI = {
  // Modals
  openModal,
  closeModal,
  
  // Notifications
  showNotification,
  
  // Drag & Drop
  initDragDrop,
  
  // Search & Filter
  initSearch,
  filterElements,
  
  // Validation
  validateForm,
  validateEmail,
  validateURL,
  
  // Loading
  showLoading,
  setButtonLoading,
  
  // Utilities
  formatDate,
  formatDateTime,
  formatNumber,
  formatFileSize,
  debounce,
  copyToClipboard,
  confirm,
  scrollToElement
};
