# Paul Teye — Comprehensive Portfolio Website

A responsive multi-page academic and professional portfolio built with static HTML, CSS, and JavaScript.

## Pages
- `index.html` — homepage, about, education, featured research, experience
- `research.html` — research profile and research pathway
- `projects.html` — detailed projects and outreach
- `publications.html` — publication and conference presentation records
- `cv.html` — CV summary and downloadable PDF
- `contact.html` — contact routes (email placeholder must be replaced)
- `assets/Paul_Teye_CV.pdf` — CV draft
- `data/*.csv` — starter tables ready to import into Airtable
- `robots.txt` and `sitemap.xml` — update domain placeholders before launch

## Preview locally
Extract the ZIP and open `index.html` in a browser. For editing, open the folder in VS Code; Live Server is a convenient preview option.

## Mandatory pre-publication checklist
1. The contact page now uses `teikwekupaul@gmail.com`.
2. The sitemap and robots file are prepared for `paulteye.net`; publish only after the domain is registered and DNS is configured.
3. LinkedIn, Facebook, X, and Instagram links supplied by Paul are included on the Contact page.
4. Verify the formal degree title, dates, publication author list, proceedings link/DOI, and presentation details.
5. Conference photographs supplied by Paul are included in the homepage gallery. The formal conference portrait is used as the lead image.
6. Link papers, slides, repositories, and demos only when public and safe to share.
7. Test all links and the mobile layout before launch.

## Publishing
This package is ready to deploy as a static website to GitHub Pages, Netlify, or Vercel. You need an account with the hosting service and a domain name you control. This package does not purchase or configure a domain.

## Airtable content management
Import the CSV files in `data/` into Airtable as starter tables for Projects, Publications, Education, and Experience. The current site is static: the CSV files do not automatically update the pages. To make content dynamically editable through Airtable, a further integration step is required through a website builder or secure server-side API. Never put an Airtable personal access token in browser JavaScript or commit secrets to GitHub.

## Privacy and accuracy
Verify each statement before public use. Do not upload student identifiers, private data, credentials, API keys, access tokens, or confidential research material.
