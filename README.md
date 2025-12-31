# FarmDecide Kenya

A professional farmer decision support system for Kenya with market price comparison and crop planning tools.

## Project Structure

```
farmer-decision-support/
├── index.html              # Home page
├── where-to-sell.html      # Market price comparison page
├── what-to-plant.html      # Crop planning page
├── css/
│   └── main.css            # Main stylesheet
├── js/
│   ├── navigation.js       # Navigation functionality
│   ├── modal.js            # Modal dialogs
│   ├── where-to-sell.js    # Where to Sell page logic
│   ├── what-to-plant.js    # What to Plant page logic
│   └── tailwind-config.js  # Tailwind configuration
└── README.md               # This file
```

## Features

### Home Page (index.html)
- Hero section with county detection and CTAs
- Video tutorial modal
- Action cards for main features
- How it works section
- Sample prices teaser
- Benefits section with limitations notice

### Where to Sell (where-to-sell.html)
- Search form for market comparison
- Results table with prices, trends, and confidence levels
- Transport cost calculator with net profit comparison
- Mobile-responsive tables that transform into cards

### What to Plant (what-to-plant.html)
- Quick plan table ranking crops by expected harvest price
- Customization form with growing period and crop selection
- Income estimator based on bag quantity
- Specific crop checker with detailed forecasts

## Technology Stack

- **HTML5** - Semantic markup
- **CSS3** - Custom styles
- **Tailwind CSS v4** - Utility-first CSS framework
- **Vanilla JavaScript** - No framework dependencies

## Getting Started

1. Clone or download this repository
2. Open `index.html` in a modern web browser
3. No build process or dependencies required!

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Customization

### Colors
Edit `js/tailwind-config.js` to change the color scheme:
- Primary: Green (#16a34a)
- Accent: Amber (#f59e0b)

### Styles
Edit `css/main.css` for custom styles

### Functionality
Edit the respective JavaScript files in `js/` folder for each page's logic

## Future Enhancements

- Backend integration with Django or similar framework
- Real-time KAMIS price data integration
- User authentication and saved preferences
- SMS/WhatsApp notifications
- Multi-language support (English/Swahili)

## License

All rights reserved.
