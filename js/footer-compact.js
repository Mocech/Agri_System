// Minimal JS for compact footer - handles any dynamic links if needed
document.addEventListener("DOMContentLoaded", () => {
  // Add smooth scroll behavior for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const href = this.getAttribute("href")
      if (href !== "#" && document.querySelector(href)) {
        e.preventDefault()
        document.querySelector(href).scrollIntoView({
          behavior: "smooth",
        })
      }
    })
  })

  console.log("[v0] Compact footer initialized")
})
