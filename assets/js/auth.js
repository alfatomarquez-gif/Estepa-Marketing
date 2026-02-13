/* ===================================
   AUTH.JS - Authentication Management
   =================================== */

// Check authentication status
function checkAuth() {
  const session = localStorage.getItem('estepa_admin_session');
  
  if (!session) {
    // Not logged in - redirect to login
    window.location.href = 'login.html';
    return null;
  }
  
  try {
    const sessionData = JSON.parse(session);
    
    // Check if session is valid (you can add expiration logic here)
    if (sessionData && sessionData.user) {
      return sessionData;
    } else {
      // Invalid session - clear and redirect
      localStorage.removeItem('estepa_admin_session');
      window.location.href = 'login.html';
      return null;
    }
  } catch (error) {
    // Invalid session data - clear and redirect
    localStorage.removeItem('estepa_admin_session');
    window.location.href = 'login.html';
    return null;
  }
}

// Logout function
function logout() {
  localStorage.removeItem('estepa_admin_session');
  window.location.href = 'login.html';
}

// Get current user
function getCurrentUser() {
  const session = localStorage.getItem('estepa_admin_session');
  if (session) {
    try {
      const sessionData = JSON.parse(session);
      return sessionData.user;
    } catch (error) {
      return null;
    }
  }
  return null;
}

// Export functions
window.checkAuth = checkAuth;
window.logout = logout;
window.getCurrentUser = getCurrentUser;
