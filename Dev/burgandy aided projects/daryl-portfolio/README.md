# Daryl Mack Portfolio Website

A professional portfolio website for Daryl Mack, a Civil/Structural Engineer transitioning into software development.

## Overview

This is a static portfolio website built with HTML, CSS, and JavaScript. It showcases Daryl's engineering background, Python learning journey, and professional skills in both engineering and software development.

## Features

- **Responsive Design**: Mobile-first, fully responsive layout
- **Modern UI**: Clean, professional design with engineering aesthetic
- **Sections**:
  - Hero with dual "Civil Engineer → Software Developer" identity
  - About section with background and education
  - Engineering projects showcase
  - Python learning progress
  - Skills matrix (Engineering vs Software)
  - Contact form and information
- **Interactive Elements**:
  - Smooth scrolling navigation
  - Mobile hamburger menu
  - Form validation
  - Back-to-top button
  - Scroll animations

## Technology Stack

- **HTML5**: Semantic markup
- **CSS3**: Custom properties, Flexbox, Grid, responsive design
- **JavaScript**: Vanilla ES6 for interactivity
- **Font Awesome**: Icons
- **Google Fonts**: Inter and Roboto typography

## Project Structure

```
daryl-portfolio/
├── index.html              # Main HTML file
├── Daryl_Mack_CV.pdf       # CV (PDF)
├── css/
│   └── style.css          # Main stylesheet
├── js/
│   └── script.js          # JavaScript functionality
├── images/                 # Image assets (placeholders)
├── output/                 # Generated output (if applicable)
└── README.md              # This file
```

## Setup and Deployment

### Local Development

1. Clone or download this repository
2. Open `index.html` in a web browser
3. No build process or dependencies required

### Deployment to GitHub Pages

1. Create a new GitHub repository
2. Push all files to the repository
3. Go to repository Settings > Pages
4. Select branch: `main` and folder: `/` (root)
5. Your site will be published at `https://[username].github.io/[repository-name]/`

### Form Submission

The contact form is configured to use Formspree:

1. Create a free account at [Formspree](https://formspree.io/)
2. Create a new form and get your form ID
3. Replace `your-form-id` in the `action` attribute of the form in `index.html`
4. Test the form submission

## Customization

### Colors
Edit CSS custom properties in `css/style.css` (root variables):
- `--primary-blue`: Main brand color
- `--engineering-accent`: Engineering section accent
- `--software-accent`: Software section accent

### Content
- Update text content in `index.html`
- Replace `Daryl_Mack_CV.pdf` with updated CV
- Add project images to `images/` folder

### Contact Information
Update contact details in the Contact section:
- Phone number
- Email address
- Social media links

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance

- No external frameworks or libraries
- Minimal CSS and JavaScript
- Optimized for fast loading
- Mobile-first responsive design

## License

This project is for personal portfolio use. All rights reserved.

## Contact

Daryl Mack
- Email: dkmack22@outlook.com
- Phone: +27 61 423 6040

---

*Last updated: March 2026*