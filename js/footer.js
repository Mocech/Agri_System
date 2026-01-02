// Footer Accordion Toggle Function
function toggleFooterAccordion(button) {
  const content = button.nextElementSibling
  const isActive = content.classList.contains("active")

  // Close all other accordions
  const allAccordions = document.querySelectorAll(".footer-accordion-content")
  allAccordions.forEach((acc) => {
    if (acc !== content) {
      acc.classList.remove("active")
      acc.previousElementSibling.classList.remove("active")
    }
  })

  // Toggle current accordion
  if (isActive) {
    content.classList.remove("active")
    button.classList.remove("active")
  } else {
    content.classList.add("active")
    button.classList.add("active")
  }
}

// Initialize footer on page load
document.addEventListener("DOMContentLoaded", () => {
  console.log("[v0] Footer initialized")
})
