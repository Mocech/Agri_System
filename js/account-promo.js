// Account Promo Popup functionality

const PROMO_SEEN_KEY = "accountPromoSeen"
const PROMO_DELAY_MS = 3000 // 3 seconds delay

/**
 * Check if user is logged in (AJAX call)
 * This is commented for now - you can implement backend checking later
 */
/*
async function checkUserLoggedIn() {
  try {
    const response = await fetch('/api/check-auth', {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    const data = await response.json();
    return data.isLoggedIn || false;
  } catch (error) {
    console.error('[v0] Error checking login status:', error);
    return false;
  }
}
*/

/**
 * Check if promo has been seen
 */
function hasSeenPromo() {
  return localStorage.getItem(PROMO_SEEN_KEY) === "true"
}

/**
 * Mark promo as seen
 */
function markPromoAsSeen() {
  localStorage.setItem(PROMO_SEEN_KEY, "true")
}

/**
 * Show account promo popup
 */
function showAccountPromo() {
  const popup = document.getElementById("accountPromoPopup")
  if (popup) {
    popup.classList.remove("hidden")
    document.body.style.overflow = "hidden"
  }
}

/**
 * Close account promo popup
 */
function closeAccountPromo() {
  const popup = document.getElementById("accountPromoPopup")
  if (popup) {
    popup.classList.add("hidden")
    document.body.style.overflow = ""
  }
}

/**
 * Continue as guest - close popup and mark as seen
 */
function continueAsGuest() {
  markPromoAsSeen()
  closeAccountPromo()
}

/**
 * Handle create account action
 */
function handleCreateAccount() {
  markPromoAsSeen()
  closeAccountPromo()

  // Redirect to signup page
  // window.location.href = '/signup';

  alert("Redirecting to Create Account page...\n(You can implement the actual redirect)")
}

/**
 * Handle login action
 */
function handleLogin() {
  markPromoAsSeen()
  closeAccountPromo()

  // Redirect to login page
  // window.location.href = '/login';

  alert("Redirecting to Login page...\n(You can implement the actual redirect)")
}

/**
 * Initialize promo popup on page load
 */
window.addEventListener("DOMContentLoaded", () => {
  // For now, show randomly after delay
  // Later, you can uncomment the checkUserLoggedIn() function

  /*
  // Backend implementation (uncomment when ready):
  setTimeout(async () => {
    const isLoggedIn = await checkUserLoggedIn();
    const hasSeenIt = hasSeenPromo();
    
    if (!isLoggedIn && !hasSeenIt) {
      showAccountPromo();
    }
  }, PROMO_DELAY_MS);
  */

  // Current implementation (shows after delay if not seen before):
  setTimeout(() => {
    const hasSeenIt = hasSeenPromo()

    if (!hasSeenIt) {
      showAccountPromo()
    }
  }, PROMO_DELAY_MS)
})

// Close modal when clicking outside content
document.addEventListener("click", (event) => {
  const popup = document.getElementById("accountPromoPopup")
  const modal = document.querySelector(".account-promo-modal")

  if (event.target === popup) {
    continueAsGuest()
  }
})

// Close modal on Escape key
document.addEventListener("keydown", (event) => {
  const popup = document.getElementById("accountPromoPopup")

  if (event.key === "Escape" && popup && !popup.classList.contains("hidden")) {
    continueAsGuest()
  }
})
