// What to Plant page functionality with searchable dropdowns

// Track open dropdown
let currentOpenDropdown = null

// Track if user has interacted with filters (to fade out cue)
let hasInteractedWithFilters = false

/**
 * Toggle dropdown visibility
 */
function toggleDropdown(dropdownId) {
  const dropdown = document.getElementById(dropdownId)
  const trigger = dropdown.previousElementSibling

  // Close any other open dropdown
  if (currentOpenDropdown && currentOpenDropdown !== dropdown) {
    closeDropdown(currentOpenDropdown)
  }

  // Toggle current dropdown
  if (dropdown.classList.contains("hidden")) {
    openDropdown(dropdown, trigger)
  } else {
    closeDropdown(dropdown)
  }
}

/**
 * Open a dropdown
 */
function openDropdown(dropdown, trigger) {
  dropdown.classList.remove("hidden")
  trigger.classList.add("open")
  currentOpenDropdown = dropdown

  // Focus on search input
  setTimeout(() => {
    const searchInput = dropdown.querySelector(".custom-select-search-input")
    if (searchInput) {
      searchInput.focus()
    }
  }, 100)

  // Add click outside listener
  setTimeout(() => {
    document.addEventListener("click", handleClickOutside)
  }, 100)
}

/**
 * Close a dropdown
 */
function closeDropdown(dropdown) {
  const trigger = dropdown.previousElementSibling
  dropdown.classList.add("hidden")
  trigger.classList.remove("open")

  // Clear search input
  const searchInput = dropdown.querySelector(".custom-select-search-input")
  if (searchInput) {
    searchInput.value = ""
    filterOptions(dropdown.id, "")
  }

  if (currentOpenDropdown === dropdown) {
    currentOpenDropdown = null
    document.removeEventListener("click", handleClickOutside)
  }
}

/**
 * Handle clicks outside dropdown
 */
function handleClickOutside(event) {
  if (!currentOpenDropdown) return

  const trigger = currentOpenDropdown.previousElementSibling

  if (!currentOpenDropdown.contains(event.target) && !trigger.contains(event.target)) {
    closeDropdown(currentOpenDropdown)
  }
}

/**
 * Select an option from dropdown
 */
function selectOption(fieldType, value) {
  const selectedElement = document.getElementById(`${fieldType}Selected`)
  if (selectedElement) {
    selectedElement.textContent = value
    const trigger = selectedElement.closest(".custom-select-trigger")
    if (trigger) {
      trigger.classList.add("has-value")
    }
  }

  // Update crop labels for varieties
  if (fieldType === "crop1") {
    document.getElementById("crop1Label").textContent = value
  } else if (fieldType === "crop2") {
    document.getElementById("crop2Label").textContent = value
  }

  const dropdown = document.getElementById(`${fieldType}Dropdown`)
  if (dropdown) {
    closeDropdown(dropdown)
    const allOptions = dropdown.querySelectorAll(".custom-select-option")
    allOptions.forEach((option) => {
      if (option.textContent === value) {
        option.classList.add("selected")
      } else {
        option.classList.remove("selected")
      }
    })
  }
}

/**
 * Filter options based on search input
 */
function filterOptions(dropdownId, searchTerm) {
  const dropdown = document.getElementById(dropdownId)
  if (!dropdown) return

  const options = dropdown.querySelectorAll(".custom-select-option")
  const lowerSearchTerm = searchTerm.toLowerCase().trim()
  let visibleCount = 0

  options.forEach((option) => {
    const text = option.textContent.toLowerCase()
    const matches = text.includes(lowerSearchTerm)

    if (matches) {
      option.classList.remove("hidden")
      visibleCount++
    } else {
      option.classList.add("hidden")
    }
  })

  console.log("[v0] Filtered:", dropdownId, "visible:", visibleCount)
}

/**
 * Toggle results section visibility
 */
function toggleResults() {
  const resultsContent = document.getElementById("resultsContent")
  const collapseArrow = document.getElementById("collapseArrow")
  const collapseButtonText = document.getElementById("collapseButtonText")

  if (resultsContent.classList.contains("hidden")) {
    // Show results
    resultsContent.classList.remove("hidden")
    collapseArrow.style.transform = "rotate(0deg)"
    collapseButtonText.textContent = "Hide Results"
  } else {
    // Hide results
    resultsContent.classList.add("hidden")
    collapseArrow.style.transform = "rotate(180deg)"
    collapseButtonText.textContent = "Show Results"
  }
}

/**
 * Compare crops - submit form
 */
function compareCrops() {
  const county = document.getElementById("countySelected").textContent
  const crop1 = document.getElementById("crop1Selected").textContent
  const crop2 = document.getElementById("crop2Selected").textContent
  const varieties1 = document.getElementById("varieties1Selected").textContent
  const varieties2 = document.getElementById("varieties2Selected").textContent
  const harvestTime = document.getElementById("harvestTime").value

  if (county === "Select County" || crop1 === "Select Crop" || crop2 === "Select Crop") {
    alert("Please select county and both crops")
    return
  }

  if (crop1 === crop2) {
    alert("Please select two different crops")
    return
  }

  // Generate results
  generateResults(county, crop1, crop2, varieties1, varieties2, harvestTime)

  // Show results section and ensure content is visible
  const resultsSection = document.getElementById("resultsSection")
  const resultsContent = document.getElementById("resultsContent")
  const collapseArrow = document.getElementById("collapseArrow")
  const collapseButtonText = document.getElementById("collapseButtonText")

  resultsSection.classList.remove("hidden")
  resultsContent.classList.remove("hidden")
  collapseArrow.style.transform = "rotate(0deg)"
  collapseButtonText.textContent = "Hide Results"

  // Smooth scroll to results
  setTimeout(() => {
    resultsSection.scrollIntoView({ behavior: "smooth", block: "start" })
  }, 100)
}

function generateResults(county, crop1, crop2, varieties1, varieties2, harvestMonths) {
  // Determine if user selected specific varieties or "All Varieties"
  const isAllVarieties1 = varieties1 === "All Varieties"
  const isAllVarieties2 = varieties2 === "All Varieties"
  const bothAllVarieties = isAllVarieties1 && isAllVarieties2

  // Mock data for demonstration
  const crop1Data = generateCropVarietyData(crop1, county)
  const crop2Data = generateCropVarietyData(crop2, county)

  // Get best options
  const bestCrop1 = crop1Data[0]
  const bestCrop2 = crop2Data[0]

  const harvestDate = new Date()
  harvestDate.setMonth(harvestDate.getMonth() + Number.parseInt(harvestMonths || 4))
  const harvestMonthName = harvestDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })

  // Update advice message based on selection type
  if (bothAllVarieties) {
    // All Varieties view - show best option for each crop
    const adviceHTML = `
      <p><strong>For ${county}</strong> and a harvest in about <strong>${harvestMonths} months</strong>, the best <strong>${crop1}</strong> option is <strong>${bestCrop1.variety}</strong> at about <strong>${bestCrop1.price.toLocaleString()} KES per bag</strong>.</p>
      <p class="mt-3">The best <strong>${crop2}</strong> option is <strong>${bestCrop2.variety}</strong> at about <strong>${bestCrop2.price.toLocaleString()} KES per bag</strong>.</p>
      <p class="mt-3 font-semibold text-green-700">Based on price only, ${bestCrop1.price > bestCrop2.price ? crop1 + " (" + bestCrop1.variety + ")" : crop2 + " (" + bestCrop2.variety + ")"} currently looks better for this harvest time.</p>
    `
    document.getElementById("adviceMessage").innerHTML = adviceHTML
    document.getElementById("comparisonTable").classList.add("hidden")
  } else {
    // Specific Varieties view - show comparison
    const selectedVariety1 = isAllVarieties1 ? bestCrop1 : crop1Data.find((v) => v.variety === varieties1) || bestCrop1
    const selectedVariety2 = isAllVarieties2 ? bestCrop2 : crop2Data.find((v) => v.variety === varieties2) || bestCrop2

    const adviceHTML = `
      <p>For <strong>${county}</strong> and a harvest in about <strong>${harvestMonths} months</strong>, <strong>${crop1}, ${selectedVariety1.variety}</strong> is about <strong>${selectedVariety1.price.toLocaleString()} KES per bag</strong> (Trend: ${selectedVariety1.trend}, Confidence: ${selectedVariety1.confidence}), and <strong>${crop2}, ${selectedVariety2.variety}</strong> is about <strong>${selectedVariety2.price.toLocaleString()} KES per bag</strong> (Trend: ${selectedVariety2.trend}, Confidence: ${selectedVariety2.confidence}).</p>
      <p class="mt-3 font-semibold text-green-700">Based on price only, ${selectedVariety1.price > selectedVariety2.price ? crop1 + " (" + selectedVariety1.variety + ")" : crop2 + " (" + selectedVariety2.variety + ")"} currently looks better for this harvest time.</p>
    `
    document.getElementById("adviceMessage").innerHTML = adviceHTML

    // Show and populate comparison table
    document.getElementById("comparisonTable").classList.remove("hidden")
    populateComparisonTable(crop1, crop2, selectedVariety1, selectedVariety2)
  }

  populateInfoCards(
    crop1,
    crop2,
    bestCrop1,
    bestCrop2,
    harvestMonthName,
    isAllVarieties1,
    isAllVarieties2,
    varieties1,
    varieties2,
  )

  // Update table titles and subtitles
  document.getElementById("crop1TableTitle").textContent = `${crop1} in ${county} (for your harvest time)`
  document.getElementById("crop1TableSubtitle").textContent =
    `Prices below are expected selling prices per bag around when you said you will harvest (price only, other costs not included).`

  document.getElementById("crop2TableTitle").textContent = `${crop2} in ${county} (for your harvest time)`
  document.getElementById("crop2TableSubtitle").textContent =
    `Prices below are expected selling prices per bag around when you said you will harvest (price only, other costs not included).`

  // Populate crop tables - now with variety data
  populateVarietyTable("crop1", crop1Data, !isAllVarieties1 ? varieties1 : null)
  populateVarietyTable("crop2", crop2Data, !isAllVarieties2 ? varieties2 : null)
}

function populateInfoCards(
  crop1,
  crop2,
  bestCrop1,
  bestCrop2,
  harvestMonthName,
  isAllVarieties1,
  isAllVarieties2,
  varieties1,
  varieties2,
) {
  // Card 1: Best crops now
  const crop1Display = isAllVarieties1 ? `${crop1}, ${bestCrop1.variety}` : `${crop1}, ${varieties1}`
  const crop2Display = isAllVarieties2 ? `${crop2}, ${bestCrop2.variety}` : `${crop2}, ${varieties2}`

  // Determine which crop is best based on price
  const bestOverall = bestCrop1.price > bestCrop2.price ? crop1Display : crop2Display

  document.getElementById("infoBestCrops").textContent = `${bestOverall} looks strongest for this planting time.`

  // Card 2: Harvest time
  document.getElementById("infoHarvestTime").textContent =
    `If you plant now, expect harvest around ${harvestMonthName}.`

  // Card 3: Expected price
  const avgPrice = Math.round((bestCrop1.price + bestCrop2.price) / 2)
  const minPrice = Math.min(bestCrop1.price, bestCrop2.price)
  const maxPrice = Math.max(bestCrop1.price, bestCrop2.price)

  document.getElementById("infoExpectedPrice").textContent =
    `${minPrice.toLocaleString()}–${maxPrice.toLocaleString()} KES per bag around harvest.`

  // Card 4: Price risk
  const avgConfidence = [bestCrop1.confidence, bestCrop2.confidence]
  const highCount = avgConfidence.filter((c) => c === "High").length
  const lowCount = avgConfidence.filter((c) => c === "Low").length

  let riskLevel = "Medium"
  let riskReason = "prices show moderate stability"

  if (highCount === 2) {
    riskLevel = "Low"
    riskReason = "prices have been stable lately"
  } else if (lowCount >= 1) {
    riskLevel = "High"
    riskReason = "prices show more uncertainty"
  }

  document.getElementById("infoPriceRisk").textContent = `${riskLevel} – ${riskReason}.`
}

function populateVarietyTable(cropId, data, highlightVariety = null) {
  const tableBodyId = `${cropId}TableBody`
  const cardsId = `${cropId}Cards`
  const tableBody = document.getElementById(tableBodyId)
  const cardsContainer = document.getElementById(cardsId)

  // Desktop table view
  let tableHTML = ""

  data.forEach((item, index) => {
    const trendClass = item.trend.toLowerCase()
    const confidenceClass = item.confidence.toLowerCase()
    const trendIcon = item.trend === "Rising" ? "↗" : item.trend === "Falling" ? "↘" : "-"
    const isBest = index === 0
    const isHighlighted = highlightVariety && item.variety === highlightVariety
    const rowClass = isHighlighted ? "bg-yellow-50 border-l-4 border-yellow-500" : isBest ? "bg-green-50" : ""

    tableHTML += `
      <tr class="${rowClass}">
        <td class="px-6 py-4 variety-cell">
          <div class="flex items-center gap-2">
            ${isBest ? '<span class="text-green-600 text-lg">★</span>' : ""}
            ${isHighlighted && !isBest ? '<span class="text-yellow-600 text-lg">•</span>' : ""}
            <span class="${isBest ? "font-bold" : ""}">${item.variety}</span>
          </div>
        </td>
        <td class="px-6 py-4 text-right wholesale-cell">${item.price.toLocaleString()} KES</td>
        <td class="px-6 py-4 text-center">
          <span class="trend-badge trend-${trendClass}">
            <span class="trend-icon">${trendIcon}</span> ${item.trend}
          </span>
        </td>
        <td class="px-6 py-4 text-center">
          <span class="confidence-badge confidence-${confidenceClass}">
            ${item.confidence}
          </span>
        </td>
        <td class="px-6 py-4 text-sm text-neutral-600">
          ${item.meaning}
        </td>
      </tr>
    `
  })

  tableBody.innerHTML = tableHTML

  let cardsHTML = ""

  data.forEach((item, index) => {
    const trendClass = item.trend.toLowerCase()
    const confidenceClass = item.confidence.toLowerCase()
    const trendIcon = item.trend === "Rising" ? "↗" : item.trend === "Falling" ? "↘" : "-"
    const isBest = index === 0
    const isHighlighted = highlightVariety && item.variety === highlightVariety

    cardsHTML += `
      <div class="variety-mobile-card ${isBest ? "best-option" : ""} ${isHighlighted && !isBest ? "highlighted-option" : ""}">
        <div class="flex justify-between items-start mb-2">
          <div class="flex-1">
            <div class="font-bold text-neutral-900 text-base flex items-center gap-2">
              ${isBest ? '<span class="text-green-600">★</span>' : ""}
              ${isHighlighted && !isBest ? '<span class="text-yellow-600">•</span>' : ""}
              ${item.variety}
            </div>
            <div class="text-lg font-bold text-green-600 mt-1">${item.price.toLocaleString()} KES/bag</div>
          </div>
          ${isBest ? '<div class="best-badge">BEST</div>' : ""}
          ${isHighlighted && !isBest ? '<div class="highlighted-badge">YOUR CHOICE</div>' : ""}
        </div>
        <div class="flex gap-2 mt-3">
          <span class="trend-badge trend-${trendClass}">
            <span class="trend-icon">${trendIcon}</span> ${item.trend}
          </span>
          <span class="confidence-badge confidence-${confidenceClass}">
            ${item.confidence}
          </span>
        </div>
        <div class="text-sm text-neutral-600 leading-relaxed">
          ${item.meaning}
        </div>
      </div>
    `
  })

  cardsContainer.innerHTML = cardsHTML
}

// Mobile menu toggle
function toggleMobileMenu() {
  const menu = document.getElementById("mobileMenu")
  menu.classList.toggle("hidden")
}

// Prevent form submission on enter key in search inputs
document.addEventListener("DOMContentLoaded", () => {
  const searchInputs = document.querySelectorAll(".custom-select-search-input")
  searchInputs.forEach((input) => {
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault()
      }
    })
  })
})

// Toggle custom filter dropdown
function toggleFilterDropdown(dropdownId) {
  const dropdown = document.getElementById(dropdownId)
  const trigger = dropdown.previousElementSibling

  // Close other filter dropdowns
  document.querySelectorAll(".custom-filter-dropdown").forEach((d) => {
    if (d.id !== dropdownId) {
      d.classList.add("hidden")
      d.previousElementSibling.classList.remove("open")
    }
  })

  // Toggle current dropdown
  dropdown.classList.toggle("hidden")
  trigger.classList.toggle("open")

  // Add overlay to close on click outside
  if (!dropdown.classList.contains("hidden")) {
    const overlay = document.createElement("div")
    overlay.className = "custom-select-overlay"
    overlay.onclick = () => {
      dropdown.classList.add("hidden")
      trigger.classList.remove("open")
      overlay.remove()
    }
    document.body.appendChild(overlay)
  }
}

// Select filter option
function selectFilterOption(filterId, value, variety) {
  const selectedSpan = document.getElementById(filterId + "Selected")
  const dropdown = document.getElementById(filterId + "Dropdown")
  const trigger = dropdown.previousElementSibling

  // Update displayed value
  selectedSpan.textContent = variety

  // Update selected state
  dropdown.querySelectorAll(".custom-filter-option").forEach((opt) => {
    opt.classList.remove("selected")
    if (opt.dataset.value === value) {
      opt.classList.add("selected")
    }
  })

  // Close dropdown
  dropdown.classList.add("hidden")
  trigger.classList.remove("open")

  // Remove overlay
  const overlay = document.querySelector(".custom-select-overlay")
  if (overlay) overlay.remove()

  if (!hasInteractedWithFilters) {
    hasInteractedWithFilters = true
    const filterZoneCue = document.getElementById("filterZoneCue")
    if (filterZoneCue && !filterZoneCue.classList.contains("hidden")) {
      filterZoneCue.classList.add("fade-out")
      setTimeout(() => {
        filterZoneCue.classList.add("hidden")
        filterZoneCue.classList.remove("fade-out")
      }, 500)
    }
  }

  // Update compact summary
  updateCompactSummary()

  // Trigger the filter change
  handleFilterChange(filterId, value)
}

// Handle filter changes
function handleFilterChange(filterId) {
  const crop1Filter = document.getElementById("crop1FilterSelected")
  const crop2Filter = document.getElementById("crop2FilterSelected")

  const crop1 = crop1Filter.textContent
  const crop2 = crop2Filter.textContent

  // Get the current county
  const county = document.getElementById("countySelected").textContent || "Nairobi"

  // Get crop names from the labels
  const crop1Name = document.getElementById("crop1FilterLabel").textContent.trim().replace(" Variety", "")
  const crop2Name = document.getElementById("crop2FilterLabel").textContent.trim().replace(" Variety", "")

  // Generate data for both crops
  const crop1Data = generateCropVarietyData(crop1Name, county)
  const crop2Data = generateCropVarietyData(crop2Name, county)

  // Find selected varieties
  const variety1Data = crop1Data.find((v) => v.variety === crop1) || crop1Data[0]
  const variety2Data = crop2Data.find((v) => v.variety === crop2) || crop2Data[0]

  // Update the comparison display
  updateComparisonDisplay(crop1Name, crop2Name, variety1Data, variety2Data)
}

function populateComparisonTable(crop1, crop2, variety1Data, variety2Data) {
  const county = document.getElementById("countySelected").textContent || "Nairobi"
  const crop1Data = generateCropVarietyData(crop1, county)
  const crop2Data = generateCropVarietyData(crop2, county)

  // Update filter labels with crop names
  document.getElementById("crop1FilterLabel").innerHTML = `
    <span class="inline-flex items-center gap-2">
      <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4"/>
      </svg>
      ${crop1} Variety
    </span>
  `

  document.getElementById("crop2FilterLabel").innerHTML = `
    <span class="inline-flex items-center gap-2">
      <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4"/>
      </svg>
      ${crop2} Variety
    </span>
  `

  // Populate crop 1 custom filter dropdown
  const crop1FilterOptions = document.querySelector("#crop1FilterDropdown .custom-filter-options")
  crop1FilterOptions.innerHTML = crop1Data
    .map(
      (v) =>
        `<div class="custom-filter-option ${v.variety === variety1Data.variety ? "selected" : ""}" 
              data-value="${v.variety}" 
              onclick="selectFilterOption('crop1Filter', '${v.variety}', '${v.variety}')">
          ${v.variety}
        </div>`,
    )
    .join("")

  // Set initial selected value for crop 1
  document.getElementById("crop1FilterSelected").textContent = variety1Data.variety

  // Populate crop 2 custom filter dropdown
  const crop2FilterOptions = document.querySelector("#crop2FilterDropdown .custom-filter-options")
  crop2FilterOptions.innerHTML = crop2Data
    .map(
      (v) =>
        `<div class="custom-filter-option ${v.variety === variety2Data.variety ? "selected" : ""}" 
              data-value="${v.variety}" 
              onclick="selectFilterOption('crop2Filter', '${v.variety}', '${v.variety}')">
          ${v.variety}
        </div>`,
    )
    .join("")

  // Set initial selected value for crop 2
  document.getElementById("crop2FilterSelected").textContent = variety2Data.variety

  // Initial display
  updateComparisonDisplay(crop1, crop2, variety1Data, variety2Data)
}

function generateCropVarietyData(cropName, county) {
  const varieties = {
    Maize: [
      {
        variety: "Dry Maize - White",
        price: 5200,
        trend: "Rising",
        confidence: "High",
        meaning: "Best maize option for your harvest time; price is stable and high.",
      },
      {
        variety: "Dry Maize - Yellow",
        price: 5000,
        trend: "Stable",
        confidence: "High",
        meaning: "Strong alternative; slightly lower price but very reliable.",
      },
      {
        variety: "Dry Maize - Mixed",
        price: 4700,
        trend: "Stable",
        confidence: "Medium",
        meaning: "Lower price; choose only if you prefer this variety.",
      },
      {
        variety: "Green Maize",
        price: 4400,
        trend: "Falling",
        confidence: "Low",
        meaning: "Lower price and more uncertain; riskier option.",
      },
    ],
    Beans: [
      {
        variety: "Rosecoco",
        price: 6800,
        trend: "Rising",
        confidence: "High",
        meaning: "Best beans option; price higher than most maize for this time.",
      },
      {
        variety: "Canadian Wonder",
        price: 6500,
        trend: "Stable",
        confidence: "High",
        meaning: "Strong beans option; reliable and high-value.",
      },
      {
        variety: "Yellow Beans",
        price: 6200,
        trend: "Rising",
        confidence: "Medium",
        meaning: "Good option with rising prices but moderate confidence.",
      },
      {
        variety: "Mwitemania",
        price: 5900,
        trend: "Stable",
        confidence: "Medium",
        meaning: "Lower priced bean variety but stable.",
      },
    ],
    "Green Grams": [
      {
        variety: "N26",
        price: 7200,
        trend: "Rising",
        confidence: "High",
        meaning: "Excellent option; highest price and rising trend.",
      },
      {
        variety: "KAT/60",
        price: 6900,
        trend: "Stable",
        confidence: "High",
        meaning: "Strong alternative with stable high price.",
      },
      {
        variety: "Local Variety",
        price: 6400,
        trend: "Stable",
        confidence: "Medium",
        meaning: "Lower price but still profitable.",
      },
    ],
    Cowpeas: [
      {
        variety: "KVU 27-1",
        price: 5800,
        trend: "Rising",
        confidence: "High",
        meaning: "Best cowpeas option with rising prices.",
      },
      {
        variety: "M66",
        price: 5500,
        trend: "Stable",
        confidence: "High",
        meaning: "Reliable option with stable pricing.",
      },
      {
        variety: "Local Variety",
        price: 5200,
        trend: "Falling",
        confidence: "Medium",
        meaning: "Lower and declining price; less recommended.",
      },
    ],
    Sorghum: [
      {
        variety: "Gadam",
        price: 4900,
        trend: "Stable",
        confidence: "High",
        meaning: "Best sorghum option with stable prices.",
      },
      {
        variety: "Serena",
        price: 4700,
        trend: "Rising",
        confidence: "Medium",
        meaning: "Rising prices but moderate confidence.",
      },
      {
        variety: "Local Variety",
        price: 4400,
        trend: "Stable",
        confidence: "Medium",
        meaning: "Lower price but acceptable option.",
      },
    ],
  }

  const cropVarieties = varieties[cropName] || [
    {
      variety: "Standard",
      price: 5000,
      trend: "Stable",
      confidence: "Medium",
      meaning: "Standard variety for this crop.",
    },
  ]

  // Sort by price descending (highest first)
  return [...cropVarieties].sort((a, b) => b.price - a.price)
}

function updateComparisonDisplay(crop1, crop2, variety1Data, variety2Data) {
  // Desktop table view
  const tableBody = document.getElementById("comparisonTableBody")
  let html = ""

  const data = [
    { crop: crop1, ...variety1Data },
    { crop: crop2, ...variety2Data },
  ]

  // Sort by price to highlight the better option
  data.sort((a, b) => b.price - a.price)

  data.forEach((item, index) => {
    const isBest = index === 0
    const trendClass = item.trend.toLowerCase()
    const confidenceClass = item.confidence.toLowerCase()
    const trendIcon = item.trend === "Rising" ? "↗" : item.trend === "Falling" ? "↘" : "-"
    const bestClass = isBest ? "bg-green-50 font-semibold" : ""

    html += `
      <tr class="${bestClass}">
        <td class="px-6 py-4">
          <div class="flex items-center gap-2">
            ${isBest ? '<span class="text-green-600">★</span>' : ""}
            <div>
              <div class="font-bold text-neutral-900">${item.crop}</div>
              <div class="text-sm text-neutral-600">${item.variety}</div>
            </div>
          </div>
        </td>
        <td class="px-6 py-4 text-right font-bold text-lg text-neutral-900">${item.price.toLocaleString()} KES</td>
        <td class="px-6 py-4 text-center">
          <span class="trend-badge trend-${trendClass}">
            <span class="trend-icon">${trendIcon}</span> ${item.trend}
          </span>
        </td>
        <td class="px-6 py-4 text-center">
          <span class="confidence-badge confidence-${confidenceClass}">
            ${item.confidence}
          </span>
        </td>
      </tr>
    `
  })

  tableBody.innerHTML = html

  // Mobile card view
  const cardsContainer = document.getElementById("comparisonCards")
  let cardsHTML = ""

  data.forEach((item, index) => {
    const isBest = index === 0
    const trendClass = item.trend.toLowerCase()
    const confidenceClass = item.confidence.toLowerCase()
    const trendIcon = item.trend === "Rising" ? "↗" : item.trend === "Falling" ? "↘" : "-"

    cardsHTML += `
      <div class="comparison-mobile-card ${isBest ? "best-option" : ""}">
        <div class="flex justify-between items-start mb-2">
          <div class="flex-1">
            <div class="font-bold text-neutral-900 text-base">${item.crop} - ${item.variety}</div>
            <div class="text-lg font-bold text-green-600 mt-1">${item.price.toLocaleString()} KES/bag</div>
          </div>
          ${isBest ? '<div class="best-badge">BEST</div>' : ""}
        </div>
        <div class="flex gap-2 mt-3">
          <span class="trend-badge trend-${trendClass}">
            <span class="trend-icon">${trendIcon}</span> ${item.trend}
          </span>
          <span class="confidence-badge confidence-${confidenceClass}">
            ${item.confidence}
          </span>
        </div>
      </div>
    `
  })

  cardsContainer.innerHTML = cardsHTML
}

// Detect when filter container becomes sticky and manage UI states
function handleFilterStickyState() {
  if (window.innerWidth > 768) return // Only for mobile

  const filterContainer = document.querySelector(".variety-filters-container")
  const filterZoneCue = document.getElementById("filterZoneCue")
  const compactSummary = document.getElementById("filterCompactSummary")
  const backToFiltersBtn = document.getElementById("backToFiltersButton")
  const comparisonTable = document.getElementById("comparisonTable")

  if (!filterContainer || !comparisonTable) return

  const containerRect = filterContainer.getBoundingClientRect()
  const tableRect = comparisonTable.getBoundingClientRect()

  // Check if filter is sticky (at top of viewport)
  const isSticky = containerRect.top <= 0

  // Check if user has scrolled past the comparison cards
  const hasPastCards = tableRect.bottom < window.innerHeight

  // Manage sticky state class
  if (isSticky) {
    filterContainer.classList.add("is-sticky")

    // Show filter zone cue if user hasn't interacted yet
    if (!hasInteractedWithFilters && filterZoneCue) {
      filterZoneCue.classList.remove("hidden")
    }

    // Show compact summary
    updateCompactSummary()
  } else {
    filterContainer.classList.remove("is-sticky")
    if (filterZoneCue) {
      filterZoneCue.classList.add("hidden")
    }
    if (compactSummary) {
      compactSummary.classList.add("hidden")
    }
  }

  // Show/hide back to filters button
  if (hasPastCards && backToFiltersBtn) {
    backToFiltersBtn.classList.remove("hidden")
  } else if (backToFiltersBtn) {
    backToFiltersBtn.classList.add("hidden")
  }
}

// Update compact summary text
function updateCompactSummary() {
  const compactSummaryText = document.getElementById("compactSummaryText")
  const crop1Selected = document.getElementById("crop1FilterSelected")
  const crop2Selected = document.getElementById("crop2FilterSelected")
  const crop1Label = document.getElementById("crop1FilterLabel")
  const crop2Label = document.getElementById("crop2FilterLabel")

  if (compactSummaryText && crop1Selected && crop2Selected) {
    // Extract crop names from labels (first part before "Variety")
    const crop1Name = crop1Label?.textContent.split(" Variety")[0].replace("Filter ", "").trim() || "Crop 1"
    const crop2Name = crop2Label?.textContent.split(" Variety")[0].replace("Filter ", "").trim() || "Crop 2"

    const summary = `${crop1Name}: ${crop1Selected.textContent} · ${crop2Name}: ${crop2Selected.textContent}`
    compactSummaryText.textContent = summary
    document.getElementById("filterCompactSummary").classList.remove("hidden")
  }
}

// Scroll smoothly to filters and highlight them
function scrollToFilters() {
  const filterContainer = document.querySelector(".variety-filters-container")
  const comparisonTable = document.getElementById("comparisonTable")

  if (filterContainer && comparisonTable) {
    // Scroll to the comparison table (which contains filters)
    comparisonTable.scrollIntoView({ behavior: "smooth", block: "start" })

    // Highlight the filters briefly after scrolling
    setTimeout(() => {
      filterContainer.classList.add("highlight")
      setTimeout(() => {
        filterContainer.classList.remove("highlight")
      }, 1000)
    }, 500)
  }
}

// Add scroll listener for mobile filter enhancements
window.addEventListener("scroll", handleFilterStickyState)
window.addEventListener("resize", handleFilterStickyState)
