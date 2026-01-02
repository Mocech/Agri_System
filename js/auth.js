// ============================================
// AUTHENTICATION FORM HANDLING
// ============================================

/**
 * Toggle password visibility
 */
function togglePasswordVisibility(fieldId) {
  const input = document.getElementById(fieldId)
  if (input.type === "password") {
    input.type = "text"
  } else {
    input.type = "password"
  }
}

/**
 * Clear error message
 */
function clearError(errorElementId) {
  const errorElement = document.getElementById(errorElementId)
  if (errorElement) {
    errorElement.textContent = ""
    errorElement.classList.remove("show")
  }
}

/**
 * Show error message
 */
function showError(errorElementId, message) {
  const errorElement = document.getElementById(errorElementId)
  if (errorElement) {
    errorElement.textContent = message
    errorElement.classList.add("show")
  }
}

/**
 * Validate email format
 */
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validate password strength
 */
function validatePasswordStrength(password) {
  return password.length >= 8 && /[A-Z]/.test(password) && /[a-z]/.test(password) && /[0-9]/.test(password)
}

/**
 * Handle login form submission
 */
function handleLogin(event) {
  event.preventDefault()

  const email = document.getElementById("email").value.trim()
  const password = document.getElementById("password").value
  const formError = document.getElementById("formError")

  // Clear previous errors
  clearError("emailError")
  clearError("passwordError")
  formError.classList.remove("show")

  let isValid = true

  // Validate email
  if (!email) {
    showError("emailError", "Email is required")
    isValid = false
  } else if (!validateEmail(email)) {
    showError("emailError", "Please enter a valid email")
    isValid = false
  }

  // Validate password
  if (!password) {
    showError("passwordError", "Password is required")
    isValid = false
  } else if (password.length < 6) {
    showError("passwordError", "Password must be at least 6 characters")
    isValid = false
  }

  if (!isValid) return

  /*
    // Send login request to backend
    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                password: password,
                rememberMe: document.getElementById('rememberMe').checked
            }),
            credentials: 'include'
        });

        const data = await response.json();

        if (response.ok) {
            console.log('[v0] Login successful');
            window.location.href = '/dashboard';
        } else {
            formError.textContent = data.message || 'Login failed. Please try again.';
            formError.classList.add('show');
        }
    } catch (error) {
        console.error('[v0] Login error:', error);
        formError.textContent = 'An error occurred. Please try again.';
        formError.classList.add('show');
    }
    */

  // Temporary success message for demo
  formError.style.background = "#dcfce7"
  formError.style.borderColor = "#86efac"
  formError.style.color = "#166534"
  formError.textContent = "Login would be processed here (backend customization needed)"
  formError.classList.add("show")
}

/**
 * Handle signup form submission
 */
function handleSignup(event) {
  event.preventDefault()

  const fullName = document.getElementById("fullName").value.trim()
  const email = document.getElementById("signupEmail").value.trim()
  const password = document.getElementById("signupPassword").value
  const confirmPassword = document.getElementById("confirmPassword").value
  const county = document.getElementById("county").value.trim()
  const agreeTerms = document.getElementById("agreeTerms").checked
  const formError = document.getElementById("formError")

  // Clear previous errors
  clearError("nameError")
  clearError("signupEmailError")
  clearError("passwordError")
  clearError("confirmPasswordError")
  clearError("countyError")
  clearError("termsError")
  formError.classList.remove("show")

  let isValid = true

  // Validate full name
  if (!fullName) {
    showError("nameError", "Full name is required")
    isValid = false
  } else if (fullName.length < 2) {
    showError("nameError", "Name must be at least 2 characters")
    isValid = false
  }

  // Validate email
  if (!email) {
    showError("signupEmailError", "Email is required")
    isValid = false
  } else if (!validateEmail(email)) {
    showError("signupEmailError", "Please enter a valid email")
    isValid = false
  }

  // Validate county
  if (!county) {
    showError("countyError", "Please select a county")
    isValid = false
  }

  // Validate password strength
  if (!password) {
    showError("passwordError", "Password is required")
    isValid = false
  } else if (!validatePasswordStrength(password)) {
    showError("passwordError", "Password must have 8+ chars, uppercase, lowercase, and number")
    isValid = false
  }

  // Validate password match
  if (password !== confirmPassword) {
    showError("confirmPasswordError", "Passwords do not match")
    isValid = false
  }

  // Validate terms
  if (!agreeTerms) {
    showError("termsError", "You must agree to the terms")
    isValid = false
  }

  if (!isValid) return

  /*
    // Send signup request to backend with county
    try {
        const response = await fetch('/api/auth/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                fullName: fullName,
                email: email,
                password: password,
                county: county
            }),
            credentials: 'include'
        });

        const data = await response.json();

        if (response.ok) {
            console.log('[v0] Signup successful');
            window.location.href = '/dashboard';
        } else {
            formError.textContent = data.message || 'Signup failed. Please try again.';
            formError.classList.add('show');
        }
    } catch (error) {
        console.error('[v0] Signup error:', error);
        formError.textContent = 'An error occurred. Please try again.';
        formError.classList.add('show');
    }
    */

  // Temporary success message for demo
  formError.style.background = "#dcfce7"
  formError.style.borderColor = "#86efac"
  formError.style.color = "#166534"
  formError.textContent = "Account would be created with county: " + county + " (backend customization needed)"
  formError.classList.add("show")
}

/**
 * Handle Google login
 */
function handleGoogleLogin() {
  console.log("[v0] Google login initiated")

  /*
    // Redirect to Google OAuth
    const clientId = 'YOUR_GOOGLE_CLIENT_ID';
    const redirectUri = encodeURIComponent(window.location.origin + '/api/auth/google/callback');
    const scope = encodeURIComponent('profile email');
    
    window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}`;
    */

  alert("Google login integration - customize with your OAuth credentials")
}

/**
 * Handle Google signup
 */
function handleGoogleSignup() {
  console.log("[v0] Google signup initiated")

  /*
    // Redirect to Google OAuth for signup
    const clientId = 'YOUR_GOOGLE_CLIENT_ID';
    const redirectUri = encodeURIComponent(window.location.origin + '/api/auth/google/callback');
    const scope = encodeURIComponent('profile email');
    
    window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}`;
    */

  alert("Google signup integration - customize with your OAuth credentials")
}

/**
 * County data array
 */
const counties = [
  "Baringo",
  "Bomet",
  "Bungoma",
  "Busia",
  "Carmine",
  "Isiolo",
  "Itumbi",
  "Kajiado",
  "Kakamega",
  "Kambaa",
  "Kambe",
  "Kangema",
  "Kanyadhiang",
  "Kericho",
  "Kerugoya",
  "Kilifi",
  "Kinna",
  "Kisii",
  "Kisumu",
  "Kitale",
  "Kitui",
  "Koinange",
  "Koloa",
  "Kongowea",
  "Kora",
  "Korma",
  "Koti",
  "Koziwa",
  "Kuku",
  "Kwale",
  "Kyambi",
  "Kyamwangi",
  "Kyoto",
  "Kyuso",
  "Laikipia",
  "Lamu",
  "Langata",
  "Langilo",
  "Lanjiwai",
  "Larkman",
  "Larnaka",
  "Lasilei",
  "Lasia",
  "Lasoi",
  "Latema",
  "Latipa",
  "Latsuko",
  "Lauwa",
  "Lava",
  "Laval",
  "Lavasia",
  "Laveria",
  "Lavetta",
  "Lavikone",
  "Lavira",
  "Lavisia",
  "Lawonji",
  "Laxer",
  "Layaa",
  "Layana",
  "Layani",
  "Layaza",
  "Layek",
  "Layema",
  "Layeni",
  "Layera",
  "Layia",
  "Layini",
  "Layo",
  "Layola",
  "Leira",
  "Leisio",
  "Leiwaji",
  "Leka",
  "Lekei",
  "Leki",
  "Lekipia",
  "Lekitone",
  "Lekoni",
  "Lekoniti",
  "Lekwa",
  "Lelana",
  "Lelecha",
  "Leleji",
  "Lelelo",
  "Lelema",
  "Leleni",
  "Lelepi",
  "Leletia",
  "Leliona",
  "Leliora",
  "Leliosi",
  "Lelita",
  "Lelitia",
  "Lelitio",
  "Lelitoi",
  "Lema",
  "Lemakose",
  "Lemakwa",
  "Lemalia",
  "Lemanio",
  "Lemanya",
  "Lemanyia",
  "Lemariach",
  "Lemarkia",
  "Lemario",
  "Lemarua",
  "Lematea",
  "Lematicha",
  "Lematua",
  "Lemawa",
  "Lemawe",
  "Lembakio",
  "Lembakwa",
  "Lembalia",
  "Lemban",
  "Lembania",
  "Lembarcio",
  "Lemberio",
  "Lembeyu",
  "Lembiga",
  "Lembo",
  "Lembonio",
  "Lembuya",
  "Lembuyan",
  "Lemchai",
  "Lemchama",
  "Lemchania",
  "Lemchara",
  "Lemcharia",
  "Lemchia",
  "Lemchicho",
  "Lemchiela",
  "Lemchiga",
  "Lemchipi",
  "Lemchiri",
  "Lemchirua",
  "Lemchita",
  "Lemchiyio",
  "Lemchiyiwa",
  "Lemchiyoa",
  "Maidstone",
  "Makimei",
  "Mamburi",
  "Mambrui",
  "Samburu",
  "Siaya",
  "Sinya",
  "Sirikwa",
  "Siringet",
  "Siror",
  "Sirta",
  "Trans Nzoia",
  "Turkana",
  "Uasin Gishu",
  "Vihiga",
  "Wajir",
  "West Pokot",
  "Yatta",
]

/**
 * Initialize county dropdown for signup form
 * Separated county dropdown functionality for backend-ready form
 */
function initializeCountyDropdown() {
  const countySearch = document.getElementById("countySearch")
  const countyDropdown = document.getElementById("countyDropdown")
  const countySelected = document.getElementById("countySelected")
  const countyInput = document.getElementById("county")

  if (!countySearch) return // Exit if on login page

  // Populate dropdown with all counties
  function renderCounties(filter = "") {
    countyDropdown.innerHTML = ""
    const filtered = counties.filter((county) => county.toLowerCase().includes(filter.toLowerCase()))

    if (filtered.length === 0) {
      countyDropdown.innerHTML =
        '<div style="padding: 1rem; color: #9ca3af; text-align: center;">No counties found</div>'
      return
    }

    filtered.forEach((county) => {
      const item = document.createElement("div")
      item.className = "county-dropdown-item"
      item.textContent = county
      item.onclick = () => window.selectCounty(county)
      countyDropdown.appendChild(item)
    })
  }

  // Show dropdown on focus
  countySearch.addEventListener("focus", () => {
    countyDropdown.classList.add("show")
    renderCounties(countySearch.value)
  })

  // Filter counties as user types
  countySearch.addEventListener("input", (e) => {
    const filter = e.target.value
    renderCounties(filter)
    if (filter.length > 0) {
      countyDropdown.classList.add("show")
    }
  })

  // Hide dropdown when clicking outside
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".county-search-group")) {
      countyDropdown.classList.remove("show")
    }
  })
}

/**
 * Select county from dropdown
 */
window.selectCounty = (county) => {
  const countySearch = document.getElementById("countySearch")
  const countySelected = document.getElementById("countySelected")
  const countyInput = document.getElementById("county")
  const countyDropdown = document.getElementById("countyDropdown")

  countySearch.value = ""
  countySelected.textContent = county
  countySelected.classList.remove("empty")
  countyInput.value = county
  countyDropdown.classList.remove("show")
}

/**
 * Initialize forms on page load
 */
document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm")
  const signupForm = document.getElementById("signupForm")

  if (loginForm) {
    // Clear form on page load
    loginForm.reset()
  }

  if (signupForm) {
    // Clear form on page load
    signupForm.reset()
    initializeCountyDropdown()
  }
})
