# Spring/Summer Design Agency - 1:1 Replica

## Overview
This is a 1:1 replica of the Spring/Summer design agency website (https://springsummer.dk) created as a test project. The replica captures the minimalist, elegant design aesthetic of the original site with attention to detail.

## Features Replicated

### 1. **Layout & Structure**
- Fixed header with logo and navigation
- Cookie consent banner (functional)
- Hero section with agency tagline
- Project showcase grid (masonry-style)
- Client logos section
- Newsletter signup
- About/Team section
- Contact section with address and contact methods
- Footer with social links and copyright

### 2. **Design Elements**
- **Typography**: Inter font family (clean, modern sans-serif)
- **Color Scheme**: Black text on white background with minimal accents
- **Spacing**: Ample white space for elegant, airy feel
- **Interactive Elements**: Hover effects on navigation and project tags
- **Responsive Design**: Mobile-friendly layout

### 3. **Functionality**
- Real-time clock display (Copenhagen time)
- Cookie acceptance/decline with localStorage persistence
- Smooth scrolling navigation
- Newsletter form submission
- Responsive design for all screen sizes

## Technical Implementation

### Files Structure
```
springsummer-replica/
├── index.html          # Main HTML file with inline CSS
├── server.js           # Simple Node.js HTTP server
├── run.bat             # Windows batch file to start server
└── README.md           # This documentation
```

### Technologies Used
- **HTML5**: Semantic markup
- **CSS3**: Modern layout with Grid and Flexbox
- **JavaScript**: Interactive features
- **Node.js**: Local development server
- **Google Fonts**: Inter font family

### Key CSS Features
- CSS Grid for project and client layouts
- Flexbox for navigation and spacing
- CSS Variables for consistent theming
- Media queries for responsive design
- CSS transitions for smooth hover effects

### JavaScript Features
- Real-time clock updates
- Cookie management with localStorage
- Smooth scrolling navigation
- Form validation and submission
- Dynamic year display in footer

## How to Run

### Option 1: Direct File Opening
Simply open `index.html` in any modern web browser.

### Option 2: Local Server (Recommended)
1. Ensure Node.js is installed
2. Open terminal in the project directory
3. Run: `node server.js`
4. Open browser to: `http://localhost:3000`

### Option 3: Windows Batch File
Double-click `run.bat` to start the server automatically.

## Comparison with Original

### ✅ Successfully Replicated
- Overall layout and structure
- Typography and spacing
- Color scheme and minimalist aesthetic
- Navigation and header behavior
- Project grid layout
- Contact section layout
- Responsive design principles

### ⚠️ Differences (Due to Test Nature)
- **Images**: Placeholder gray boxes instead of actual project images
- **Client Logos**: Text placeholders instead of actual logos
- **Content**: Sample content structure matches but not identical text
- **Interactive Features**: Basic implementations of core functionality

## Design Principles Applied

### 1. **Minimalism**
- Clean typography hierarchy
- Ample white space
- Limited color palette
- Simple, intuitive navigation

### 2. **User Experience**
- Clear visual hierarchy
- Intuitive navigation
- Responsive design
- Accessible color contrast

### 3. **Performance**
- Single HTML file with inline CSS/JS
- Minimal external dependencies
- Fast loading times
- Efficient rendering

## Learning Outcomes

This replication demonstrates:
1. **Layout Analysis**: Deconstructing complex website layouts
2. **CSS Grid/Flexbox**: Modern layout techniques
3. **Responsive Design**: Mobile-first approach
4. **JavaScript Integration**: Adding interactivity to static designs
5. **Attention to Detail**: Matching spacing, typography, and micro-interactions

## Future Enhancements

To make this a perfect 1:1 replica:
1. Add actual project images
2. Implement actual client logos
3. Add smooth scroll animations
4. Implement more advanced hover effects
5. Add loading states and transitions
6. Optimize for performance and SEO

## License
Educational project - For demonstration purposes only.

## Credits
Original design: Spring/Summer Design Agency (https://springsummer.dk)
Replica created as a technical exercise.