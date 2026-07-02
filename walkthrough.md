# Library Management Frontend Walkthrough

## Project Overview

This project is a single-page library management frontend built with React, TypeScript, Vite, Tailwind CSS, Redux Toolkit Query, and React Router. It supports two roles: employee and admin. The employee experience focuses on browsing books, borrowing, wishlist management, reviews, notifications, and profile management. The admin experience focuses on dashboard analytics, inventory, audit logs, and recent activity monitoring.

The app is built as a backend-driven UI. Most screens fetch data from REST endpoints through RTK Query slices, and most actions such as login, borrowing, returning, creating books, creating shelves, wishlist changes, reviews, and notifications are delegated to the API.

## Tech Stack

The main technologies used in the project are:

- React 19
- TypeScript
- Vite
- React Router
- Redux Toolkit Query
- Tailwind CSS
- Recharts
- React Icons and Lucide icons
- Shadcn/Radix UI primitives for reusable UI building blocks
- Zxing / react-zxing for ISBN scanning
- PapaParse for CSV parsing

## Application Architecture

The app boots from [src/main.tsx](src/main.tsx) and renders [src/App.tsx](src/App.tsx), which wraps the router with:

- Redux provider
- Toast provider
- Error boundary
- React Router provider

The route tree is defined in [src/routes.tsx](src/routes.tsx). It splits the app into:

- public routes for login and signup
- protected employee routes under `/`
- protected admin routes under `/admin`

Role checking is handled client-side in [src/pages/ProtectedRoute.tsx](src/pages/ProtectedRoute.tsx) using localStorage tokens and the stored role.

Data fetching is centralized through the shared RTK Query base API in [src/api-service/api.ts](src/api-service/api.ts). Feature-specific slices inject endpoints into that base API.

## Authentication And Session Flow

Authentication is handled in [src/pages/Login.tsx](src/pages/Login.tsx) and [src/pages/Signup.tsx](src/pages/Signup.tsx).

What the login flow does:

- posts credentials to `/auth/login`
- stores access token, refresh token, role, name, email, and contact information in localStorage
- redirects to `/admin` for admin users or `/` for employee users

What the signup flow does:

- creates a new employee account through `/auth/signup`
- stores returned tokens in localStorage
- redirects into the employee experience

The helper utilities in [src/lib/auth.ts](src/lib/auth.ts) manage token presence, logout cleanup, and role retrieval.

## Routing Structure

The route map in [src/routes.tsx](src/routes.tsx) shows the main app layout:

- employee shell: home, catalog, book details, shelves, my reads, profile, settings
- admin shell: dashboard, track, inventory, audit, profile, settings
- error fallback: not found page

The employee and admin shells are implemented in [src/pages/employee/Layout.tsx](src/pages/employee/Layout.tsx) and [src/pages/admin/AdminLayout.tsx](src/pages/admin/AdminLayout.tsx). Both provide sidebar navigation, logout handling, and access to the chatbot. The employee shell also includes notifications and the ISBN scanner.

## Employee Features

### Home

[src/pages/employee/Home.tsx](src/pages/employee/Home.tsx) shows two book sections:

- My Books, built from borrowed-book data
- Most Popular This Week, built from all books data

This page is mostly a browse-and-discover landing page.

### Catalog

[src/pages/employee/Catalog.tsx](src/pages/employee/Catalog.tsx) displays all books and supports shelf-based filtering. Selecting a shelf updates the book grid and can be driven by a query parameter.

### Book Details

[src/pages/employee/BookPage.tsx](src/pages/employee/BookPage.tsx) is the main interaction page for a single book. It includes:

- detailed book metadata
- shelf availability
- borrowing flow
- request-to-borrow flow when no shelf is available
- related books by genre
- book reviews

### My Reads

[src/pages/employee/MyReads.tsx](src/pages/employee/MyReads.tsx) combines several user-oriented features:

- profile summary and profile editing
- wishlist section pulled from `GET /wishlist`
- returned books and currently borrowed books
- return flow with shelf selection
- requested books section
- review count summary

This page is currently the most feature-dense employee page.

### Shelves

[src/pages/employee/Shelves.tsx](src/pages/employee/Shelves.tsx) provides shelf browsing and book discovery by shelf.

### Profile And Settings

[src/pages/Profile.tsx](src/pages/Profile.tsx) and [src/pages/Settings.tsx](src/pages/Settings.tsx) exist as routed pages, but they are lighter-weight compared with the main catalog and my reads experiences.

## Admin Features

### Dashboard

[src/pages/admin/AdminDashboard.tsx](src/pages/admin/AdminDashboard.tsx) provides a metrics-and-insights landing page with:

- KPI cards
- circulation trend chart
- shelf utilization cards

It is the clearest admin overview page in the app.

### Track

[src/pages/admin/Track.tsx](src/pages/admin/Track.tsx) shows recent activity with:

- range switching
- pagination
- per-row book, user, status, and due-date details

### Audit

[src/pages/admin/Audit.tsx](src/pages/admin/Audit.tsx) normalizes audit log data and gives filtering for:

- date range
- action type
- free-text search

### Inventory

[src/pages/admin/Inventory.tsx](src/pages/admin/Inventory.tsx) supports:

- adding a new book
- adding a new shelf
- assigning books to shelves
- CSV bulk import
- inventory table browsing

This area is one of the main management tools in the app.

## Shared UI And Reusable Components

The app reuses a number of shared components rather than duplicating UI patterns.

Important examples include:

- [src/Components/BookCard.tsx](src/Components/BookCard.tsx) for book display across catalog, home, book details, my reads, and wishlist sections
- [src/Components/ShelfCard.tsx](src/Components/ShelfCard.tsx) for shelf selection and shelf browsing
- [src/Components/forms/AddBookForm.tsx](src/Components/forms/AddBookForm.tsx) for book creation
- [src/Components/forms/AddShelfForm.tsx](src/Components/forms/AddShelfForm.tsx) for shelf creation
- [src/Components/forms/AddBooKToShelfForm.tsx](src/Components/forms/AddBooKToShelfForm.tsx) for assigning books to shelves
- [src/Components/table/BookInventory.tsx](src/Components/table/BookInventory.tsx) for inventory display
- [src/Components/ui/Toast.tsx](src/Components/ui/Toast.tsx) for user feedback
- [src/Components/EmptyShelf.tsx](src/Components/EmptyShelf.tsx) for empty states

There are also richer shell-level features such as:

- [src/components/chatbot/Chatbot.tsx](src/components/chatbot/Chatbot.tsx)
- [src/components/scanner/ISBNScanner.tsx](src/components/scanner/ISBNScanner.tsx)
- [src/components/NotificationPanel/NotificationPanel.tsx](src/components/NotificationPanel/NotificationPanel.tsx)

## API Layer

The API is organized by domain under `src/api-service`.

Main slices include:

- [src/api-service/login/login.api.ts](src/api-service/login/login.api.ts)
- [src/api-service/books/books.api.ts](src/api-service/books/books.api.ts)
- [src/api-service/shelf/shelf.api.ts](src/api-service/shelf/shelf.api.ts)
- [src/api-service/notifications/notifications.api.ts](src/api-service/notifications/notifications.api.ts)
- [src/api-service/reviews/review.api.ts](src/api-service/reviews/review.api.ts)
- [src/api-service/user/user.api.ts](src/api-service/user/user.api.ts)
- [src/api-service/admin/admin.api.ts](src/api-service/admin/admin.api.ts)

The API slices use `injectEndpoints` so the domain features stay separated while sharing the same base query and tag system.

## Implemented Backend-Driven Flows

These are the main implemented flows in the current project:

- login and signup
- employee and admin route protection
- book browsing and search-style discovery
- shelf filtering
- book detail and borrow flow
- borrow return flow
- book request flow
- wishlist add/remove and wishlist rendering
- book reviews
- user profile reading and editing
- notifications and notification resolution
- admin dashboard metrics
- circulation trends charting
- recent activity tracking
- audit log filtering
- inventory management and CSV import
- ISBN scan-to-prefill for book creation
- chatbot assistant in the app shell

## Data Models And Transformations

The app relies on local TypeScript models in [src/models](src/models) and response conversion helpers in [src/api-service/books/types.ts](src/api-service/books/types.ts) and the related feature type files.

This pattern is used to normalize backend payloads into UI-friendly shapes. It is especially visible in:

- book response mapping
- borrowed book mapping
- shelf mapping
- audit log normalization
- wishlist ID extraction

## Folder-Level Summary

At a high level, the project is organized as follows:

- `src/pages`: route-level screens
- `src/Components`: shared UI and forms
- `src/components`: shell features and interactive widgets
- `src/api-service`: RTK Query feature APIs and transforms
- `src/models`: TypeScript data shapes and sample fixtures
- `src/lib`: auth helpers and utility functions
- `src/store`: Redux store setup
- `src/utils`: import/export and inventory helpers

## What The Project Does Well

- It already has a real feature split between employee and admin experiences.
- Most core interactions are connected to backend endpoints instead of being mocked.
- The UI reuses card and form components across multiple screens.
- RTK Query keeps data fetching and cache invalidation relatively consistent.
- The app includes several advanced features beyond basic CRUD, such as notifications, chatbot, ISBN scanning, audit logs, and analytics.

## Limitations And Missing Pieces

- The auth helper `baseQueryWithAuth` exists in [src/api-service/api.ts](src/api-service/api.ts) but the store currently registers the plain API instance, so the 401 auto-logout flow is not actually used.
- Some routes still point to lighter placeholder-style pages, especially profile and settings.
- Several screens still contain debug `console.log` statements.
- The codebase mixes `src/Components` and `src/components`, which makes imports inconsistent.
- Some UI elements exist without full action wiring, such as inventory row actions and some placeholder chart or menu affordances.
- Notification interactions are partly wired but not fully centralized.
- The app is mostly client-state driven for auth role checks instead of reading the current user role from a protected backend session every time.

## Notes On Conventions

- The app uses absolute import aliases like `@/...`.
- RTK Query tags are used for cache invalidation where features are wired properly.
- The design language is mostly neutral, card-based, and uses warm accent colors.
- Several pages use hardcoded sample data for sections that are not yet fully data-driven.

## Quick Start

Available scripts from `package.json`:

- `npm run dev` to start the Vite dev server
- `npm run build` to type-check and create a production build
- `npm run lint` to run ESLint
- `npm run preview` to preview the built app

## Short Summary

This frontend is a fairly broad library management UI with real API integration, role-based routing, employee and admin workflows, analytics, notifications, wishlist support, borrowing, reviews, inventory handling, and utility tools like chatbot and ISBN scanning. The main gaps are mostly around cleanup, consistency, and finishing a few partially wired surfaces rather than missing core product areas.
