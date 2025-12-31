// Navigation functionality for FarmDecide Kenya

let selectedCounty = localStorage.getItem("selectedCounty") || null

/**
 * Show county selection popup on page load if not selected
 */
window.addEventListener("DOMContentLoaded", () => {
  if (!selectedCounty) {
    // Small delay to ensure DOM is fully ready
    setTimeout(() => {
      showCountyPopup()
    }, 100)
  } else {
    updateCountyDisplay(selectedCounty)
  }
})

/**
 * Show county selection popup
 */
function showCountyPopup() {
  const popup = document.getElementById("countyPopup")
  if (popup) {
    popup.classList.remove("hidden")
    document.body.style.overflow = "hidden"

    // Focus on search input
    setTimeout(() => {
      const searchInput = document.getElementById("countySearchInput")
      if (searchInput) {
        searchInput.focus()
      }
    }, 100)
  }
}

/**
 * Hide county selection popup
 */
function hideCountyPopup() {
  const popup = document.getElementById("countyPopup")
  if (popup) {
    popup.classList.add("hidden")
    document.body.style.overflow = ""
  }
}

/**
 * Close county popup without selecting (allows user to dismiss)
 */
function closeCountyPopup() {
  hideCountyPopup()
}

/**
 * Handle county selection from dropdown
 */
function handleCountyChange() {
  const select = document.getElementById("countySelect")
  const submitBtn = document.getElementById("countySubmitBtn")

  if (select && submitBtn) {
    selectedCounty = select.value
    // Enable submit button if a county is selected
    submitBtn.disabled = !selectedCounty
  }
}

/**
 * Confirm county selection
 */
function confirmCountySelection() {
  if (selectedCounty) {
    // Save to localStorage
    localStorage.setItem("selectedCounty", selectedCounty)

    // Update display in navbar
    updateCountyDisplay(selectedCounty)

    // Hide popup
    hideCountyPopup()

    // Reload data for selected county (hook for future implementation)
    console.log("[v0] County selected:", selectedCounty)
  }
}

/**
 * Update county display in navbar
 */
function updateCountyDisplay(countyName) {
  const countyDisplay = document.getElementById("countyDisplay")
  const countyDisplayMobile = document.getElementById("countyDisplayMobile")

  if (countyDisplay) {
    countyDisplay.textContent = countyName
  }

  if (countyDisplayMobile) {
    countyDisplayMobile.textContent = countyName
  }
}

/**
 * Open county selector from navbar
 */
function openCountySelector() {
  // Pre-populate the dropdown with current selection
  const select = document.getElementById("countySelect")
  if (select && selectedCounty) {
    select.value = selectedCounty
    document.getElementById("countySubmitBtn").disabled = false
  }
  showCountyPopup()
}

/**
 * Toggle mobile menu visibility
 */
function toggleMobileMenu() {
  const menu = document.getElementById("mobileMenu")
  if (menu) {
    menu.classList.toggle("hidden")
  }
}

/**
 * Close mobile menu when clicking outside
 */
document.addEventListener("click", (event) => {
  const menu = document.getElementById("mobileMenu")
  const menuButton = event.target.closest("button")

  if (menu && !menu.contains(event.target) && !menuButton) {
    menu.classList.add("hidden")
  }
})

/**
 * Filter counties based on search input
 */
function filterCounties() {
  const searchInput = document.getElementById("countySearchInput")
  const countyList = document.getElementById("countyList")
  const noCountiesMessage = document.getElementById("noCountiesMessage")
  const countyItems = countyList.getElementsByClassName("county-item")

  if (!searchInput || !countyList) return

  const searchTerm = searchInput.value.toLowerCase().trim()
  let visibleCount = 0

  // Filter county items
  Array.from(countyItems).forEach((item) => {
    const countyName = item.textContent.toLowerCase()
    const matches = countyName.includes(searchTerm)

    if (matches) {
      item.style.display = "block"
      visibleCount++
    } else {
      item.style.display = "none"
    }
  })

  // Show/hide "no results" message
  if (noCountiesMessage) {
    if (visibleCount === 0 && searchTerm !== "") {
      noCountiesMessage.classList.remove("hidden")
    } else {
      noCountiesMessage.classList.add("hidden")
    }
  }

  console.log("[v0] Filtered counties:", visibleCount, "visible")
}

/**
 * Select a county from the list
 */
function selectCounty(countyName) {
  selectedCounty = countyName

  // Save to localStorage
  localStorage.setItem("selectedCounty", selectedCounty)

  // Update display in navbar
  updateCountyDisplay(selectedCounty)

  // Hide popup
  hideCountyPopup()

  // Clear search input
  const searchInput = document.getElementById("countySearchInput")
  if (searchInput) {
    searchInput.value = ""
  }

  // Reset filter
  filterCounties()

  console.log("[v0] County selected:", selectedCounty)
}
