// WHERE TO SELL PAGE FUNCTIONALITY
// This file handles all client-side interactions for the Where to Sell page

// Sample data for demonstration (In production, this comes from backend via AJAX)
const SAMPLE_DATA = {
  counties: ["Kitui", "Machakos", "Makueni", "Nairobi", "Meru"],
  crops: {
    maize: { name: "Dry Maize", varieties: ["all", "white", "yellow", "mixed"] },
    beans: { name: "Beans", varieties: ["all", "red", "yellow", "rosecoco"] },
    "green-grams": { name: "Green Grams", varieties: ["all"] },
    cowpeas: { name: "Cowpeas", varieties: ["all"] },
    sorghum: { name: "Sorghum", varieties: ["all", "red", "white"] },
  },
  markets: {
    now: [
      { market: "Kitui Town", variety: "yellow", wholesale: 5000, retail: 5400, trend: "rising", confidence: "high" },
      { market: "Mwingi", variety: "white", wholesale: 4800, retail: 5200, trend: "stable", confidence: "high" },
      { market: "Mutomo", variety: "yellow", wholesale: 4600, retail: 5000, trend: "falling", confidence: "medium" },
      { market: "Ikutha", variety: "mixed", wholesale: 4700, retail: 5100, trend: "stable", confidence: "medium" },
      { market: "Kyuso", variety: "white", wholesale: 4500, retail: 4900, trend: "rising", confidence: "low" },
    ],
  },
}

// State management
const currentState = {
  county: "kitui",
  crop: "maize",
  variety: "all",
  sellingTime: "now",
  selectedMarkets: [],
  numberOfBags: 10,
}

// Initialize page
document.addEventListener("DOMContentLoaded", () => {
  initializeFormHandlers()
  initializeSellingTimeButtons()
  initializeVarietyFilterButtons()
  initializeCheckboxHandlers()
  initializeTransportCalculator()
})

// ============================================
// FORM SUBMISSION HANDLER
// ============================================
function initializeFormHandlers() {
  const searchForm = document.getElementById("searchForm")
  if (searchForm) {
    searchForm.addEventListener("submit", (e) => {
      e.preventDefault()

      // Get form values
      currentState.county = document.getElementById("countySelect").value
      currentState.crop = document.getElementById("cropSelect").value
      currentState.variety = document.getElementById("varietySelect").value

      // Show loading state (optional)
      // showLoadingState();

      // AJAX CALL COMMENT:
      // In production, make an AJAX request to backend here:
      /*
      fetch('/api/markets/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          county: currentState.county,
          crop: currentState.crop,
          variety: currentState.variety,
          selling_time: currentState.sellingTime
        })
      })
      .then(response => response.json())
      .then(data => {
        populateResults(data);
        showResultsSection();
      })
      .catch(error => {
        console.error('Error fetching market data:', error);
        showErrorMessage();
      });
      */

      // For now, use sample data
      setTimeout(() => {
        populateResults(SAMPLE_DATA.markets.now)
        showResultsSection()
      }, 500)
    })
  }
}

// ============================================
// SHOW RESULTS SECTION
// ============================================
function showResultsSection() {
  const resultsSection = document.getElementById("resultsSection")
  if (resultsSection) {
    resultsSection.classList.remove("hidden")
    resultsSection.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  // Update recommendation strip
  updateRecommendationStrip()

  // Update table title
  updateTableTitle()
}

// ============================================
// UPDATE RECOMMENDATION STRIP
// ============================================
function updateRecommendationStrip() {
  const adviceTitle = document.getElementById("adviceTitle")
  const adviceText = document.getElementById("adviceText")

  const timeLabels = {
    now: "Sell now (today)",
    "2weeks": "Sell in about 2 weeks",
    "1month": "Sell in about 1 month",
    "2-3months": "Sell in 2–3 months",
  }

  if (adviceTitle) {
    adviceTitle.textContent = `Advice for: ${timeLabels[currentState.sellingTime]}`
  }

  if (adviceText) {
    // Get the best market (highest price)
    const markets = SAMPLE_DATA.markets.now
    const bestMarket = markets.reduce((best, current) => (current.wholesale > best.wholesale ? current : best))

    const cropName = SAMPLE_DATA.crops[currentState.crop].name
    const varietyName = currentState.variety === "all" ? "" : ` – ${capitalizeFirst(currentState.variety)} Maize`
    const countyName = capitalizeFirst(currentState.county)
    const timePhrase =
      currentState.sellingTime === "now"
        ? "today"
        : timeLabels[currentState.sellingTime].toLowerCase().replace("sell ", "")

    adviceText.innerHTML = `For <strong>${cropName}${varietyName}</strong> in <strong>${countyName}</strong>, the best price per bag <strong>${timePhrase}</strong> is in <strong>${bestMarket.market}</strong> at about <strong class="text-primary">${bestMarket.wholesale.toLocaleString()} KES per bag (wholesale)</strong>.`
  }
}

// ============================================
// UPDATE TABLE TITLE
// ============================================
function updateTableTitle() {
  const tableTitle = document.getElementById("tableTitle")
  const timeLabels = {
    now: "Now",
    "2weeks": "In 2 weeks",
    "1month": "In 1 month",
    "2-3months": "In 2–3 months",
  }

  if (tableTitle) {
    const cropName = SAMPLE_DATA.crops[currentState.crop].name
    const countyName = capitalizeFirst(currentState.county)
    tableTitle.textContent = `Markets for ${cropName} in ${countyName} – ${timeLabels[currentState.sellingTime]}`
  }
}

// ============================================
// POPULATE RESULTS TABLE
// ============================================
function populateResults(marketsData) {
  const tableBody = document.getElementById("priceTableBody")
  const cardsList = document.getElementById("priceCardsList")

  if (!tableBody || !cardsList) return

  // Clear existing content
  tableBody.innerHTML = ""
  cardsList.innerHTML = ""

  // AJAX CALL COMMENT:
  // In production, marketsData comes from the backend response
  // Backend should return: { markets: [...], recommendation: {...}, metadata: {...} }

  marketsData.forEach((market) => {
    // Desktop table row
    const row = createTableRow(market)
    tableBody.appendChild(row)

    // Mobile card
    const card = createMobileCard(market)
    cardsList.appendChild(card)
  })

  // Reset variety filter
  resetVarietyFilter()
}

// ============================================
// CREATE TABLE ROW
// ============================================
function createTableRow(market) {
  const row = document.createElement("tr")
  row.className = "hover:bg-primary/5 transition-colors"
  row.setAttribute("data-variety", market.variety)

  const trendIcon =
    market.trend === "rising"
      ? '<svg class="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M7 14l5-5 5 5H7z"/></svg>'
      : market.trend === "falling"
        ? '<svg class="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M7 10l5 5 5-5H7z"/></svg>'
        : '<svg class="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M7 10h10v4H7v-4z"/></svg>'

  const trendClass =
    market.trend === "rising"
      ? "bg-green-100 text-green-800"
      : market.trend === "falling"
        ? "bg-red-100 text-red-800"
        : "bg-neutral-100 text-neutral-800"

  const confidenceClass =
    market.confidence === "high"
      ? "bg-blue-100 text-blue-800"
      : market.confidence === "medium"
        ? "bg-amber-100 text-amber-800"
        : "bg-neutral-100 text-neutral-600"

  row.innerHTML = `
    <td class="px-4 py-4">
      <input type="checkbox" class="market-checkbox w-4 h-4 rounded border-neutral-300 text-primary focus:ring-primary" 
             data-market="${market.market}" data-variety="${capitalizeFirst(market.variety)} Maize" 
             data-price="${market.wholesale}" data-type="wholesale">
    </td>
    <td class="px-4 py-4 text-neutral-900 font-medium">${market.market}</td>
    <td class="px-4 py-4 text-neutral-700">${capitalizeFirst(market.variety)} Maize</td>
    <td class="px-4 py-4 text-right text-neutral-900 font-semibold">${market.wholesale.toLocaleString()}</td>
    <td class="px-4 py-4 text-right text-neutral-700">${market.retail.toLocaleString()}</td>
    <td class="px-4 py-4 text-center">
      <span class="inline-flex items-center gap-1 px-3 py-1 ${trendClass} text-xs font-semibold rounded-full">
        ${trendIcon}
        ${capitalizeFirst(market.trend)}
      </span>
    </td>
    <td class="px-4 py-4 text-center">
      <span class="inline-block px-3 py-1 ${confidenceClass} text-xs font-semibold rounded-full">${capitalizeFirst(market.confidence)}</span>
    </td>
  `

  return row
}

// ============================================
// CREATE MOBILE CARD
// ============================================
function createMobileCard(market) {
  const card = document.createElement("div")
  card.className = "border-2 border-neutral-200 rounded-xl p-4 hover:border-primary transition-all"
  card.setAttribute("data-variety", market.variety)

  const trendIcon =
    market.trend === "rising"
      ? '<svg class="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M7 14l5-5 5 5H7z"/></svg>'
      : market.trend === "falling"
        ? '<svg class="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M7 10l5 5 5-5H7z"/></svg>'
        : '<svg class="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M7 10h10v4H7v-4z"/></svg>'

  const trendClass =
    market.trend === "rising"
      ? "bg-green-100 text-green-800"
      : market.trend === "falling"
        ? "bg-red-100 text-red-800"
        : "bg-neutral-100 text-neutral-800"

  const confidenceClass =
    market.confidence === "high"
      ? "bg-blue-100 text-blue-800"
      : market.confidence === "medium"
        ? "bg-amber-100 text-amber-800"
        : "bg-neutral-100 text-neutral-600"

  card.innerHTML = `
    <div class="flex items-start gap-3 mb-3">
      <input type="checkbox" class="market-checkbox w-5 h-5 rounded border-neutral-300 text-primary focus:ring-primary mt-1"
             data-market="${market.market}" data-variety="${capitalizeFirst(market.variety)} Maize" 
             data-price="${market.wholesale}" data-type="wholesale">
      <div class="flex-1">
        <div class="flex justify-between items-start mb-2">
          <div>
            <div class="font-semibold text-base text-neutral-900">${market.market}</div>
            <div class="text-sm text-neutral-600">${capitalizeFirst(market.variety)} Maize</div>
          </div>
          <div class="text-right">
            <div class="text-lg font-bold text-primary">KES ${market.wholesale.toLocaleString()}</div>
            <div class="text-xs text-neutral-600">Retail: ${market.retail.toLocaleString()}</div>
          </div>
        </div>
        <div class="flex gap-2 flex-wrap">
          <span class="inline-flex items-center gap-1 px-2.5 py-1 ${trendClass} text-xs font-semibold rounded-full">
            ${trendIcon}
            ${capitalizeFirst(market.trend)}
          </span>
          <span class="px-2.5 py-1 ${confidenceClass} text-xs font-semibold rounded-full">${capitalizeFirst(market.confidence)}</span>
        </div>
      </div>
    </div>
  `

  return card
}

// ============================================
// SELLING TIME BUTTONS
// ============================================
function initializeSellingTimeButtons() {
  const buttons = document.querySelectorAll(".selling-time-btn")
  buttons.forEach((btn) => {
    btn.addEventListener("click", function () {
      // Remove active class from all buttons
      buttons.forEach((b) => b.classList.remove("active"))

      // Add active class to clicked button
      this.classList.add("active")

      // Update state
      currentState.sellingTime = this.getAttribute("data-time")

      // AJAX CALL COMMENT:
      // Fetch updated market data for the new selling time
      /*
      fetch('/api/markets/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          county: currentState.county,
          crop: currentState.crop,
          variety: currentState.variety,
          selling_time: currentState.sellingTime
        })
      })
      .then(response => response.json())
      .then(data => {
        populateResults(data.markets);
        updateRecommendationStrip();
        updateTableTitle();
      });
      */

      // For demo, just update the UI
      updateRecommendationStrip()
      updateTableTitle()
    })
  })
}

// ============================================
// VARIETY FILTER BUTTONS
// ============================================
function initializeVarietyFilterButtons() {
  const buttons = document.querySelectorAll(".variety-filter-btn")
  buttons.forEach((btn) => {
    btn.addEventListener("click", function () {
      // Remove active class from all buttons
      buttons.forEach((b) => b.classList.remove("active"))

      // Add active class to clicked button
      this.classList.add("active")

      // Get selected variety
      const selectedVariety = this.getAttribute("data-variety")

      // Filter table rows and cards
      filterMarketsByVariety(selectedVariety)
    })
  })
}

function filterMarketsByVariety(variety) {
  const tableRows = document.querySelectorAll("#priceTableBody tr")
  const mobileCards = document.querySelectorAll("#priceCardsList > div")

  tableRows.forEach((row) => {
    const rowVariety = row.getAttribute("data-variety")
    if (variety === "all" || rowVariety === variety) {
      row.style.display = ""
    } else {
      row.style.display = "none"
    }
  })

  mobileCards.forEach((card) => {
    const cardVariety = card.getAttribute("data-variety")
    if (variety === "all" || cardVariety === variety) {
      card.style.display = ""
    } else {
      card.style.display = "none"
    }
  })
}

function resetVarietyFilter() {
  const buttons = document.querySelectorAll(".variety-filter-btn")
  buttons.forEach((b) => b.classList.remove("active"))
  const allBtn = document.querySelector('.variety-filter-btn[data-variety="all"]')
  if (allBtn) {
    allBtn.classList.add("active")
  }
  filterMarketsByVariety("all")
}

// ============================================
// CHECKBOX HANDLERS
// ============================================
function initializeCheckboxHandlers() {
  document.addEventListener("change", (e) => {
    if (e.target.classList.contains("market-checkbox")) {
      updateSelectedMarkets()
    }
  })

  // Select all checkbox
  const selectAllDesktop = document.getElementById("selectAllDesktop")
  if (selectAllDesktop) {
    selectAllDesktop.addEventListener("change", function () {
      const checkboxes = document.querySelectorAll(".market-checkbox")
      checkboxes.forEach((cb) => {
        cb.checked = this.checked
      })
      updateSelectedMarkets()
    })
  }
}

function updateSelectedMarkets() {
  const checkboxes = document.querySelectorAll(".market-checkbox:checked")
  currentState.selectedMarkets = Array.from(checkboxes).map((cb) => ({
    market: cb.getAttribute("data-market"),
    variety: cb.getAttribute("data-variety"),
    price: Number.parseInt(cb.getAttribute("data-price")),
    type: cb.getAttribute("data-type"),
  }))

  updateTransportSection()
}

// ============================================
// TRANSPORT CALCULATOR
// ============================================
function initializeTransportCalculator() {
  const calculateBtn = document.getElementById("calculateBtn")
  if (calculateBtn) {
    calculateBtn.addEventListener("click", calculateNetProfit)
  }
}

function updateTransportSection() {
  const selectedMarketsList = document.getElementById("selectedMarketsList")
  const transportInputs = document.getElementById("transportInputs")
  const transportCostsContainer = document.getElementById("transportCostsContainer")

  if (currentState.selectedMarkets.length === 0) {
    // Show empty state
    if (selectedMarketsList) {
      selectedMarketsList.innerHTML =
        '<p class="text-sm text-neutral-600 italic">Select at least one market from the table above to compare after transport.</p>'
    }
    if (transportInputs) {
      transportInputs.classList.add("hidden")
    }
  } else {
    // Show selected markets
    if (selectedMarketsList) {
      selectedMarketsList.innerHTML = `
        <div class="space-y-2">
          <p class="text-sm font-semibold text-neutral-700 mb-3">Selected markets (${currentState.selectedMarkets.length}):</p>
          ${currentState.selectedMarkets
            .map(
              (m) => `
            <div class="flex items-center gap-2 text-sm text-neutral-700 bg-white px-3 py-2 rounded-lg border border-neutral-200">
              <svg class="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
              </svg>
              <span><strong>${m.market}</strong> – ${m.variety} (${m.price.toLocaleString()} KES per bag)</span>
            </div>
          `,
            )
            .join("")}
        </div>
      `
    }

    // Show transport inputs
    if (transportInputs) {
      transportInputs.classList.remove("hidden")
    }

    // Generate transport cost inputs for each market
    if (transportCostsContainer) {
      transportCostsContainer.innerHTML = currentState.selectedMarkets
        .map(
          (m, index) => `
        <div class="bg-white p-4 rounded-lg border border-neutral-200">
          <h4 class="font-semibold text-neutral-900 mb-3">${m.market} – ${m.variety}</h4>
          <p class="text-xs text-neutral-600 mb-3">${m.price.toLocaleString()} KES per bag at ${currentState.sellingTime}</p>
          <div class="grid sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-medium text-neutral-700 mb-1.5">Transport per bag (KES)</label>
              <input type="number" id="transport-per-bag-${index}" min="0" step="10" placeholder="e.g., 150"
                     class="w-full px-3 py-2.5 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent min-h-[44px]">
            </div>
            <div>
              <label class="block text-xs font-medium text-neutral-700 mb-1.5">OR Total transport (KES)</label>
              <input type="number" id="transport-total-${index}" min="0" step="100" placeholder="e.g., 1500"
                     class="w-full px-3 py-2.5 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent min-h-[44px]">
            </div>
          </div>
        </div>
      `,
        )
        .join("")
    }
  }
}

function calculateNetProfit() {
  const numberOfBags = Number.parseInt(document.getElementById("numberOfBags").value) || 0

  if (numberOfBags === 0) {
    alert("Please enter the number of bags")
    return
  }

  // Calculate net for each selected market
  const results = currentState.selectedMarkets.map((market, index) => {
    const perBagInput = document.getElementById(`transport-per-bag-${index}`)
    const totalInput = document.getElementById(`transport-total-${index}`)

    let transportPerBag = 0

    if (perBagInput && perBagInput.value) {
      transportPerBag = Number.parseFloat(perBagInput.value)
    } else if (totalInput && totalInput.value) {
      const totalTransport = Number.parseFloat(totalInput.value)
      transportPerBag = totalTransport / numberOfBags
    }

    const netPerBag = market.price - transportPerBag
    const totalNet = netPerBag * numberOfBags

    return {
      market: market.market,
      variety: market.variety,
      price: market.price,
      transportPerBag,
      netPerBag,
      totalNet,
      hasTransport: transportPerBag > 0,
    }
  })

  // Sort by net per bag (highest first)
  results.sort((a, b) => b.netPerBag - a.netPerBag)

  // Display results
  displayNetResults(results, numberOfBags)
}

function displayNetResults(results, numberOfBags) {
  const netResultsSection = document.getElementById("netResultsSection")
  const netResultsTableBody = document.getElementById("netResultsTableBody")
  const netResultsCardsList = document.getElementById("netResultsCardsList")

  if (!netResultsSection || !netResultsTableBody || !netResultsCardsList) return

  // Clear existing content
  netResultsTableBody.innerHTML = ""
  netResultsCardsList.innerHTML = ""

  // Populate desktop table
  results.forEach((result, index) => {
    const row = document.createElement("tr")
    row.className =
      index === 0 && result.hasTransport
        ? "net-result-best hover:bg-green-100/50 transition-colors"
        : "hover:bg-neutral-50 transition-colors"

    const note = !result.hasTransport ? "No transport added" : index === 0 ? "Best after transport" : ""

    row.innerHTML = `
      <td class="px-4 py-4 text-neutral-900 font-medium">${result.market} – ${result.variety}</td>
      <td class="px-4 py-4 text-right text-neutral-900 font-semibold">${result.price.toLocaleString()} KES</td>
      <td class="px-4 py-4 text-right text-neutral-700">${result.hasTransport ? result.transportPerBag.toLocaleString() : "–"} KES</td>
      <td class="px-4 py-4 text-right text-primary font-bold">${result.netPerBag.toLocaleString()} KES</td>
      <td class="px-4 py-4 text-right text-neutral-900 font-semibold">${result.totalNet.toLocaleString()} KES</td>
      <td class="px-4 py-4 text-center">
        ${note ? `<span class="${index === 0 && result.hasTransport ? "net-result-best-badge" : "px-3 py-1 bg-neutral-100 text-neutral-700 rounded-full text-xs font-semibold"}">${note}</span>` : ""}
      </td>
    `

    netResultsTableBody.appendChild(row)
  })

  // Populate mobile cards
  results.forEach((result, index) => {
    const card = document.createElement("div")
    card.className =
      index === 0 && result.hasTransport
        ? "border-2 border-green-500 bg-green-50 rounded-xl p-4"
        : "border-2 border-neutral-200 rounded-xl p-4"

    const note = !result.hasTransport ? "No transport added" : index === 0 ? "Best after transport" : ""

    card.innerHTML = `
      <div class="flex justify-between items-start mb-3">
        <div class="flex-1">
          <div class="font-semibold text-base text-neutral-900">${result.market}</div>
          <div class="text-sm text-neutral-600">${result.variety}</div>
        </div>
        ${note ? `<span class="${index === 0 && result.hasTransport ? "net-result-best-badge" : "px-2.5 py-1 bg-neutral-100 text-neutral-700 rounded-full text-xs font-semibold"}">${note}</span>` : ""}
      </div>
      <div class="grid grid-cols-2 gap-3 text-sm mb-2">
        <div>
          <div class="text-neutral-600">Price per bag</div>
          <div class="font-semibold">${result.price.toLocaleString()} KES</div>
        </div>
        <div>
          <div class="text-neutral-600">Transport per bag</div>
          <div class="font-semibold">${result.hasTransport ? result.transportPerBag.toLocaleString() : "–"} KES</div>
        </div>
      </div>
      <div class="pt-3 border-t border-neutral-200">
        <div class="flex justify-between items-center">
          <div>
            <div class="text-xs text-neutral-600">Net per bag</div>
            <div class="text-lg font-bold text-primary">${result.netPerBag.toLocaleString()} KES</div>
          </div>
          <div class="text-right">
            <div class="text-xs text-neutral-600">Total (${numberOfBags} bags)</div>
            <div class="text-lg font-bold text-neutral-900">${result.totalNet.toLocaleString()} KES</div>
          </div>
        </div>
      </div>
    `

    netResultsCardsList.appendChild(card)
  })

  // Show results section
  netResultsSection.classList.remove("hidden")
  netResultsSection.scrollIntoView({ behavior: "smooth", block: "start" })
}

// ============================================
// UTILITY FUNCTIONS
// ============================================
function capitalizeFirst(str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}



// Toggle custom dropdown visibility
function toggleDropdown(type) {
  const menu = document.getElementById(`${type}DropdownMenu`)
  const trigger = menu.previousElementSibling
  const allMenus = document.querySelectorAll(".custom-dropdown-menu")

  // Close all other dropdowns
  allMenus.forEach((m) => {
    if (m !== menu) {
      m.classList.add("hidden")
      m.previousElementSibling.setAttribute("aria-expanded", "false")
    }
  })

  // Toggle current dropdown
  const isHidden = menu.classList.contains("hidden")
  menu.classList.toggle("hidden")
  trigger.setAttribute("aria-expanded", isHidden ? "true" : "false")

  // Focus search input when opening
  if (isHidden) {
    setTimeout(() => {
      const searchInput = document.getElementById(`${type}Search`)
      if (searchInput) searchInput.focus()
    }, 100)
  }
}

/**
 * Filter dropdown items based on search input
 */
function filterDropdown(type) {
  const searchInput = document.getElementById(`${type}Search`)
  const list = document.getElementById(`${type}List`)
  const noResults = document.getElementById(`${type}NoResults`)
  const items = list.querySelectorAll(".dropdown-item")

  const searchTerm = searchInput.value.toLowerCase().trim()
  let visibleCount = 0

  items.forEach((item) => {
    const text = item.textContent.toLowerCase()
    const matches = text.includes(searchTerm)

    if (matches) {
      item.style.display = "block"
      visibleCount++
    } else {
      item.style.display = "none"
    }
  })

  // Show/hide no results message
  if (noResults) {
    if (visibleCount === 0 && searchTerm !== "") {
      noResults.classList.remove("hidden")
    } else {
      noResults.classList.add("hidden")
    }
  }

  console.log(`[v0] Filtered ${type}:`, visibleCount, "visible")
}

/**
 * Select item from dropdown
 */
function selectDropdownItem(type, displayText, value) {
  // Update display text
  const displayElement = document.getElementById(`${type}Value`)
  displayElement.textContent = displayText
  displayElement.classList.add("selected")

  // Update hidden input value
  const hiddenInput = document.getElementById(`${type}Select`)
  hiddenInput.value = value

  // Close dropdown
  const menu = document.getElementById(`${type}DropdownMenu`)
  menu.classList.add("hidden")
  menu.previousElementSibling.setAttribute("aria-expanded", "false")

  // Clear search
  const searchInput = document.getElementById(`${type}Search`)
  if (searchInput) {
    searchInput.value = ""
    filterDropdown(type)
  }

  // Update active state
  const items = document.getElementById(`${type}List`).querySelectorAll(".dropdown-item")
  items.forEach((item) => {
    if (item.textContent === displayText) {
      item.classList.add("active")
    } else {
      item.classList.remove("active")
    }
  })

  console.log(`[v0] Selected ${type}:`, displayText, value)
}

// Close dropdowns when clicking outside
document.addEventListener("click", (event) => {
  if (!event.target.closest(".custom-dropdown")) {
    const allMenus = document.querySelectorAll(".custom-dropdown-menu")
    allMenus.forEach((menu) => {
      menu.classList.add("hidden")
      menu.previousElementSibling.setAttribute("aria-expanded", "false")
    })
  }
})

// Close dropdowns on ESC key
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    const allMenus = document.querySelectorAll(".custom-dropdown-menu")
    allMenus.forEach((menu) => {
      menu.classList.add("hidden")
      menu.previousElementSibling.setAttribute("aria-expanded", "false")
    })
  }
})
