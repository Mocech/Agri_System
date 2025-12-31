// Modal functionality for video and other modals

/**
 * Open video modal
 */
function openVideoModal() {
  const modal = document.getElementById("videoModal")
  if (modal) {
    modal.classList.remove("hidden")
    document.body.style.overflow = "hidden" // Prevent background scrolling
  }
}

/**
 * Close video modal
 */
function closeVideoModal() {
  const modal = document.getElementById("videoModal")
  const video = document.getElementById("tutorialVideo")
  if (modal) {
    modal.classList.add("hidden")
    document.body.style.overflow = "" // Restore scrolling

    // Pause the video and reset to beginning for better UX
    if (video) {
      video.pause()
      video.currentTime = 0
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const openVideoBtn = document.getElementById("openVideoModalBtn")
  if (openVideoBtn) {
    openVideoBtn.addEventListener("click", openVideoModal)
  }
})

// Close modal when clicking outside content
document.addEventListener("click", (event) => {
  const modal = document.getElementById("videoModal")
  if (event.target === modal) {
    closeVideoModal()
  }
})

// Close modal on Escape key
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeVideoModal()
  }
})
