// What to Plant page functionality

/**
 * Toggle custom crop selector visibility
 */
function toggleCropSelector() {
  const selector = document.getElementById("customCropSelector")
  if (selector) {
    selector.classList.toggle("hidden")
  }
}

/**
 * Show income estimator section
 */
function showIncomeEstimator() {
  const section = document.getElementById("incomeEstimator")
  if (section) {
    section.classList.remove("hidden")
    section.scrollIntoView({ behavior: "smooth", block: "start" })
  }
}

/**
 * Calculate estimated income
 */
function calculateIncome() {
  // Get input values
  const bagsInput = document.querySelector('#incomeEstimator input[type="number"]')
  const bags = bagsInput ? Number.parseInt(bagsInput.value) || 0 : 0

  const cropSelect = document.querySelector("#incomeEstimator select")
  const crop = cropSelect ? cropSelect.value : ""

  // Show results
  const resultsDiv = document.getElementById("incomeResults")
  if (resultsDiv) {
    resultsDiv.classList.remove("hidden")
    resultsDiv.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  // In a real application, this would perform actual calculations
  // based on crop prices and number of bags
}

/**
 * Show crop checker section
 */
function showCropChecker() {
  const section = document.getElementById("cropChecker")
  if (section) {
    section.classList.remove("hidden")
    section.scrollIntoView({ behavior: "smooth", block: "start" })
  }
}

/**
 * Check specific crop
 */
function checkCrop() {
  // Get selected crop
  const cropSelect = document.querySelector("#cropChecker select")
  const crop = cropSelect ? cropSelect.value : ""

  // Show results
  const resultsDiv = document.getElementById("cropCheckResults")
  if (resultsDiv) {
    resultsDiv.classList.remove("hidden")
    resultsDiv.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  // In a real application, this would fetch specific crop data
}
