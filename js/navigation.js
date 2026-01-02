const mobileToggle = document.getElementById("mobileToggle")
const mobileMenu = document.getElementById("mobileMenu")

function toggleMobileMenu() {
  if (mobileToggle && mobileMenu) {
    console.log("[v0] Toggle Mobile Menu - Active before:", mobileMenu.classList.contains("active"))
    mobileToggle.classList.toggle("active")
    mobileMenu.classList.toggle("active")
    console.log("[v0] Toggle Mobile Menu - Active after:", mobileMenu.classList.contains("active"))
  }
}

// Close mobile menu when a link is clicked
const mobileLinks = document.querySelectorAll(".mobile-nav-link")
mobileLinks.forEach((link) => {
  link.addEventListener("click", () => {
    if (mobileToggle && mobileMenu) {
      mobileToggle.classList.remove("active")
      mobileMenu.classList.remove("active")
    }
  })
})

function setActiveLink() {
  const currentPath = window.location.pathname.toLowerCase()

  // Normalize path - remove trailing slashes for consistent matching
  const normalizedPath = currentPath.endsWith("/") && currentPath !== "/" ? currentPath.slice(0, -1) : currentPath

  // Desktop links
  const desktopLinks = document.querySelectorAll(".navbar-link")
  desktopLinks.forEach((link) => {
    const linkPath = link.getAttribute("href").toLowerCase()
    const normalizedLinkPath = linkPath.endsWith("/") && linkPath !== "/" ? linkPath.slice(0, -1) : linkPath

    link.classList.remove("active")

    // Check if current path matches link path or any page containing that keyword
    if (
      normalizedPath === normalizedLinkPath ||
      normalizedPath.includes(normalizedLinkPath.replace("/", "")) ||
      (normalizedPath === "/" && normalizedLinkPath === "/") ||
      (normalizedPath === "" && normalizedLinkPath === "/")
    ) {
      link.classList.add("active")
    }
  })

  // Mobile links - same logic
  mobileLinks.forEach((link) => {
    const linkPath = link.getAttribute("href").toLowerCase()
    const normalizedLinkPath = linkPath.endsWith("/") && linkPath !== "/" ? linkPath.slice(0, -1) : linkPath

    link.classList.remove("active")

    if (
      normalizedPath === normalizedLinkPath ||
      normalizedPath.includes(normalizedLinkPath.replace("/", "")) ||
      (normalizedPath === "/" && normalizedLinkPath === "/") ||
      (normalizedPath === "" && normalizedLinkPath === "/")
    ) {
      link.classList.add("active")
    }
  })
}

setActiveLink()

// Close menu when clicking outside
document.addEventListener("click", (e) => {
  const navbar = document.querySelector(".navbar")
  if (navbar && !navbar.contains(e.target)) {
    if (mobileToggle && mobileMenu) {
      mobileToggle.classList.remove("active")
      mobileMenu.classList.remove("active")
    }
  }
})

// Close menu on ESC key
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && mobileToggle && mobileMenu) {
    mobileToggle.classList.remove("active")
    mobileMenu.classList.remove("active")
  }
})

// Placeholder functions for county selector
function openCountySelector() {
  console.log("County selector clicked")
}
