# COMET Q4 FY25-26 — Next.js Upskilling Roadmap

**Created:** February 04, 2026 | **Deadline:** March 31, 2026
**Status:** In Progress

---

## Week 1: Next.js Core Fundamentals
- [ ] Initialize a Next.js project using the App Router
- [ ] Understand the App Router mental model and file-based routing
- [ ] Learn Server Components vs Client Components and when to use `"use client"`
- [ ] Work with `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`, and `not-found.tsx`
- [ ] Implement shared and nested layouts
- [ ] Use built-in components: `Link`, `Image`, and `Metadata`

## Week 2: UI, Styling & Component Design
- [ ] Set up Tailwind CSS or CSS Modules
- [ ] Learn reusable component patterns and UI composition
- [ ] Build a small design system (buttons, inputs, modals, alerts)
- [ ] Implement responsive layouts and navigation
- [ ] Understand client components for interactivity only

## Week 3: Data Fetching & Rendering Strategies
- [ ] Fetch data inside Server Components
- [ ] Understand caching, revalidation, and fetch options
- [ ] Learn SSR, SSG, and ISR differences and use cases
- [ ] Implement streaming and loading states using Suspense
- [ ] Build pages using static, dynamic, and incremental data

## Week 4: Forms, Mutations & Server Actions
- [ ] Learn Server Actions for handling mutations
- [ ] Build forms with server-side submission
- [ ] Validate input using Zod on the server
- [ ] Implement optimistic updates
- [ ] Handle success and error states cleanly

## Week 5: Authentication, Middleware & Security
- [ ] Implement authentication using Auth.js / NextAuth
- [ ] Protect routes using middleware
- [ ] Manage cookies, headers, and sessions
- [ ] Implement role-based authorization
- [ ] Secure environment variables and secrets

## Week 6: Performance Optimization & SEO
- [ ] Optimize images using Next.js Image
- [ ] Implement Metadata API for SEO
- [ ] Add Open Graph and social metadata
- [ ] Analyze bundle size and performance
- [ ] Improve Core Web Vitals and Lighthouse scores

## Week 7: Architecture & Production Project
- [ ] Design a scalable folder and feature-based structure
- [ ] Separate UI, business logic, and data layers
- [ ] Organize shared utilities and server logic
- [ ] Build a real-world production app (SaaS, LMS, dashboard)
- [ ] Apply best practices for maintainability and scalability

---

## Good Practices to Follow Throughout
- Prefer Server Components over Client Components
- Keep components small and single-responsibility
- Fetch data on the server whenever possible
- Avoid unnecessary global state
- Use feature-based folder organization
- Validate all data on the server
- Optimize before adding complexity

---

## Outcome After 7 Weeks
- Strong understanding of Next.js App Router
- Ability to build scalable, production-grade applications
- Clear grasp of performance, SEO, and security best practices
- Portfolio-ready project aligned with real-world use cases
