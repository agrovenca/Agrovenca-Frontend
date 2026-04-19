# Agrovenca Frontend

## Overview

Agrovenca Frontend is a React-based e-commerce platform designed for agricultural products. It provides a complete online shopping experience with features like product browsing, cart management, favorites/wishlists, user accounts, and an admin dashboard.

## 🛠️ Technologies Used

### Core Stack

- **React 19** (Latest React version with React Compiler)
- **Vite** (Blazing-fast build tool)
- **TypeScript** (Static typing)
- **Tailwind CSS** (Utility-first styling + tailwind-merge, tw-animate-css)
- **Zustand** (State management)
- **TanStack Query** (@tanstack/react-query) (Data fetching/caching)
- **React Router v7** (Client-side navigation)
- **Axios** (API requests)

### UI & Interaction

- **Radix UI** (Accessible headless components: Dialogs, Dropdowns, Tooltips, etc.)
- **Lucide React** (Icons)
- **Dnd Kit** (@dnd-kit) (Drag-and-drop for sortable interfaces)
- **Embla Carousel** (Touch-enabled sliders + autoplay)
- **Sonner** (Toasts/notifications)

### Forms & Validation

- **React Hook Form** (Form management)
- **Zod** (Schema validation) + @hookform/resolvers (Integration with forms)
- **Input OTP** (OTP/pin input fields)

### Utilities

- **date-fns** (Date formatting)
- **use-debounce** (Debounce hooks)
- **clsx** + class-variance-authority (Dynamic class names)
- **Next Themes** (Dark/light mode support)

### Dev Tools

- **ESLint** (Code linting)
- **React Query Devtools** (Debugging API states)

## Key Features

- **User Authentication** – Register, login, and account management
- **Product Catalog** – Browse and search for agricultural products
- **Shopping Cart** – Add/remove items, adjust quantities, and checkout
- **Favorites/Wishlist** – Save products for later purchase
- **User Dashboard** – Order history, profile settings, and preferences
- **Admin Dashboard** – Manage products, orders, and users (if applicable)
- **Responsive Design** – Works on desktop, tablet, and mobile

## Project Structure

The main components are organized into:

- `src/actions/` - Centralizes async logic.
- `src/components/` - Reusable UI components.
- `src/hooks/` - Custom hooks.
- `src/layouts/` Shared wrappers.
- `src/lib/` Custom function utilities.
- `src/pages/` - Main application views.
- `src/schemas/` Zod schemas for form validation and API response shapes.
- `src/store/` Zustand state slices.
- `src/types/` Global TypeScript interfaces/enums.
- `src/router.tsx` - React Router configuration.

## Installation

1. Clone the repository

   ```bash
   git clone https://github.com/agrovenca/Agrovenca-Frontend.git
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```
3. Configure environment variables (create a .env file based on .env.example)
4. Run the development server:
   ```bash
   pnpm dev
   ```

## Configuration

The application requires the following environment variables:

- **VITE_API_UR**L - Base URL for the backend API
- **AWS_STORAGE_BUCKET_NAME**=BUCKET_NAME
- **AWS_S3_REGION_NAME**=REGION_NAME
- **AWS_S3_ENDPOINT_URL**=ENDPOINT_URL
- **VITE_AWS_SPACE_BASE_URL**=https://BUCKET_NAME.REGION_NAME.ENDPOINT_URL

## Available Scripts

- `pnpm run dev` - Start the development server
- `pnpm run build` - Build the application for production
- `pnpm run lint` - Run ESLint to check for code quality
- `pnpm run test` - Run tests using Jest and React Testing Library

## Contributing

Contributions are welcome. Please fork the repository and submit a pull request with your changes. Make sure to follow the project's coding style and guidelines.

## 👨‍💻 Developer

<div align="center"> 
  <a href="https://github.com/junior-r"> 
    <img src="https://avatars.githubusercontent.com/junior-r" loading="lazy" width="100" style="border-radius: 50%;" alt="Junior R's GitHub Profile"> 
  </a> <br /> <strong>Junior Ruiz</strong> 
  <br /> 
  <a href="https://github.com/junior-r" target="_blank">GitHub</a> • 
  <a href="https://juniorz.dev" target="_blank">Portfolio</a> • 
  <a href="mailto:juniorruiz331+work@gmail.com">Contact</a> 
</div>
