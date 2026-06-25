# Comprehensive Project Specifications for Claude: E-Commerce Website - Mariam.shop

## 1. Overview
Develop a completely production-ready e-commerce website for a portfolio showcase using Next.js 16 and Tailwind CSS. The design must be clean, highly responsive, and aimed at presenting a high-quality professional project.

## 2. Design, Colors, and Theme
- **Theme:** Strict light theme. The overall background must be pure white, and the typography must be black throughout the application.
- **Accent Color:** A subtle, sophisticated gold or gray for highlights, buttons, and specific interactive elements. No vibrant colors like purple, blue, red, or pink should be used.
- **Layout and Structure:**
  - **Navbar:** Sticky or fixed.
    - **Logo:** Located on the top left corner, designed as "Mariam" with an 'M' that artistically encompasses the name.
    - **Navigation:** Centered navigation links for the main categories.
    - **Auth & Profile:** Sign-in and sign-up buttons on the right. Upon logging in, a user profile icon/link must appear, allowing users to edit their profile details. If the logged-in user is an admin, a link to an exclusive Admin Dashboard must be visible.
  - **Hero Section:**
    - A full-view hero section that occupies the viewport without requiring any scrolling.
    - Must feature a dynamic image carousel that automatically transitions to the next slide every 5 minutes.
    - Include impactful headings and a clear Call-to-Action button within the hero.

## 3. Core Pages
The developer must build the following pages and sections with precision:
- **Homepage:**
  - Hero carousel displaying featured top products.
  - Category listings showcasing different sections of the store, dynamically managed through a Headless CMS.
  - A clean, easily accessible search bar for product discovery.
  - Product display sections populated via a loop from the CMS.
- **About Page:** A dedicated, visually appealing page explaining the store's story and mission.
- **Contact Page:** A dedicated, professional page with a functional contact form and store information.
- **Product Details (Slug) Pages:**
  - A detailed view for specific products.
  - A product review and rating system where users can view others' opinions and leave their own feedback. All review data must be stored in the database.
- **Cart and Wishlist:**
  - Functionality for adding items to the cart and a wishlist with fluid, responsive state management.
- **Checkout & Payment:** Dedicated payment page and payment detail page to complete purchases.
- **Authentication Pages:** Separate, user-friendly pages tailored for Login and Sign-up.
- **Legal Pages:** Dedicated standard e-commerce pages for legal information and Terms & Conditions.

## 4. Automation, CMS, and Data Management
- **CMS:** Integrate a Headless CMS (such as Strapi or Sanity.io) for managing the store's content dynamically.
- **Data Import:** The system must support automatic bulk imports and updates for a large catalog (over 1000 items). This must be facilitated via an API or integration script fetched by an AI automation agent to mimic a real-time, large-scale enterprise store.
- **Admin Dashboard:**
  - A secure and protected area accessible only to specific, email-verified admin accounts.
  - The dashboard must display:
    - Currently active user sessions.
    - Real-time monitoring of purchases.
    - The ability to update order statuses (e.g., changing from processing to delivered).
    - Product listings management.
  - Admins must be able to change order statuses manually and interact with the automation agent.

## 5. Technology Stack
- **Framework:** Next.js (latest stable version, currently Next.js 16)
- **Styling:** Tailwind CSS
- **Database:** Neon Database (PostgreSQL)
- **Payment Gateway:** Stripe for handling payment transactions.
- **AI Chatbot:** An embedded support chatbot integrated into the website.
  - Must be powered by OpenAI's GPT-4o-mini API.
  - Programmed to greet users by their specific name using their login data.
  - Capable of directly assisting with shopping queries, navigating the site, and issuing discounts dynamically to help drive conversions.