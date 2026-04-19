# Website Automation Skill

## Overview
You automate the end-to-end process of building premium client websites for Daryl. This skill manages the full pipeline: client intake -> brief -> design decisions -> code generation -> delivery. Every site uses the Anti-Gravity and Spline skills to produce world-class results that command premium pricing (R5,000-R30,000+ per site).

## Client Pipeline

### Stage 1: Client Intake
When Daryl says "new client [name]" or "start website for [name]":

1. Create client folder: C:\Dev\Clients\[client-name]\
2. Create subfolders: brief\, src\, assets\, delivery\
3. Create C:\Dev\Clients\[client-name]\brief\brief.md with this template:

# Client Brief - [Client Name]

## Business Info
- Business name:
- Industry:
- Target audience:
- Location / market:
- Website goal: (leads / sales / portfolio / brand)

## Design Preferences
- Style: (modern / minimal / bold / luxury / playful)
- Colors preferred:
- Colors to avoid:
- Reference sites they like:

## Content
- Sections needed: (hero / about / services / portfolio / testimonials / contact)
- Do they have copy? Y/N
- Do they have images? Y/N
- Do they have a logo? Y/N

## Technical
- Hosting: (Netlify / Vercel / their own)
- Domain:
- CMS needed? Y/N (Sanity / Contentful / none)
- Contact form needed? Y/N

## Budget & Timeline
- Budget (ZAR):
- Deadline:

## Notes

4. Report: "Client folder created. Send me the brief details and I'll fill it in."

### Stage 2: Brief Completion
When Daryl provides client details, fill in the brief.md file completely. Then confirm: "Brief saved. Ready to build."

### Stage 3: Tech Stack Decision
Based on brief.md, automatically select the right stack:

| Site Type | Stack |
|---|---|
| Simple brochure (1-5 pages) | HTML + CSS + Vanilla JS |
| Portfolio / agency | Next.js + Tailwind CSS |
| E-commerce | Next.js + Shopify Storefront API |
| Blog / content | Next.js + Sanity CMS |
| App / dashboard | React + Tailwind + Supabase |

Always include:
- GSAP + ScrollTrigger (Anti-Gravity skill)
- Spline 3D embed (Spline skill)
- Lenis smooth scroll
- Mobile responsive (Tailwind breakpoints)

### Stage 4: Code Generation
When Daryl says "build the site" or "generate code for [client]":

1. Read C:\Dev\Clients\[client-name]\brief\brief.md
2. Generate complete project structure
3. Build each section in order: Layout -> Hero -> Sections -> Footer -> Animations -> 3D
4. Apply Anti-Gravity animations (read antigravity SKILL.md)
5. Add Spline 3D scene (read spline SKILL.md)
6. Save all files to C:\Dev\Clients\[client-name]\src\
7. Generate README.md with setup instructions
8. Report: "Site built. [X] sections. Stack: [stack]. Files in C:\Dev\Clients\[client-name]\src\"

### Stage 5: Quality Check
After building, automatically check:
- Mobile responsive (check Tailwind breakpoints)
- Images have alt text
- Forms have validation
- 3D scene has mobile fallback
- Animations use transform only (not layout props)
- Page has meta tags (title, description, og:image)
- Contact form is connected or has placeholder

Report any missing items.

### Stage 6: Delivery
When Daryl says "deliver [client name]":
1. Package src\ folder as zip to delivery\[client-name]-site.zip
2. Generate delivery\handover.md with login credentials, how to update content, how to add sections, Daryl's support contact
3. Report: "Delivery package ready at C:\Dev\Clients\[client-name]\delivery\"

## Standard Section Templates

### Hero Section
- Full-viewport height
- Spline 3D scene or video background
- Headline + subheading + CTA button
- Magnetic CTA (Anti-Gravity)
- Scroll indicator arrow

### Services Section
- 3-6 service cards
- Hover: lift + glow effect (Anti-Gravity)
- Icon per service (Lucide or custom SVG)
- Short description per service

### Portfolio / Work Section
- Masonry or grid layout
- Hover: image scale + overlay reveal
- Filter by category
- Lightbox on click

### Testimonials Section
- Auto-scrolling carousel or static grid
- Client photo + name + company + quote
- Star rating

### Contact Section
- Name, email, message fields
- Form validation
- Submit to Netlify Forms or Formspree (no backend needed)
- Map embed (optional)

## Pricing Guide (for Daryl's reference)
| Site Type | Price Range (ZAR) |
|---|---|
| Single-page brochure | R5,000 - R8,000 |
| Multi-page business site | R10,000 - R18,000 |
| Portfolio with 3D | R15,000 - R25,000 |
| E-commerce store | R20,000 - R40,000 |
| Custom web app | R30,000+ |

Maintenance retainer: R1,500 - R3,000/month

## Active Clients Tracker
Maintained at: C:\Dev\Clients\_tracker.md

Format:
| Client | Stage | Deadline | Price (ZAR) | Status |
|---|---|---|---|---|
| Example Co | Build | 2026-04-15 | R12,000 | In Progress |

Update this file whenever a client moves to a new stage.

## Commands Burgandy Responds To
- "New client [name]" -> Create folder + brief template
- "Fill brief for [client]" -> Fill in brief with details Daryl provides
- "Build site for [client]" -> Full code generation
- "Quality check [client]" -> Run checklist
- "Deliver [client]" -> Package + handover doc
- "Client status" -> Show tracker table
- "How many clients active?" -> Count in-progress from tracker

## File Locations
- Skill file: C:\Users\dkmac\.openclaw\skills\websiteautomation\SKILL.md
- All clients: C:\Dev\Clients\
- Active tracker: C:\Dev\Clients\_tracker.md
- Snippets library: C:\Dev\Snippets\
