# SpotFix - Service Booking Platform

SpotFix is a comprehensive, full-stack frontend application built with Next.js. It serves as a centralized platform connecting customers with professional technicians for various services. The platform features robust role-based access control, offering dedicated dashboards for Admin, Customers, and Technicians, alongside seamless booking management and payment integrations.

🌐 **Live Site:** [spotfix-home.vercel.app](https://spotfix-home.vercel.app/)
🎥 **Demo:** [Watch a demo video](https://drive.google.com/drive/folders/1coKlG9zvd0lmrVFQaMsQqnNwaMPO4n3H?usp=drive_link)

## ✨ Features

- **Role-Based Dashboards:** Completely isolated and secure routing for different user types:
  - **Admin:** Manage users, categories, and oversee all platform bookings.
  - **Technician:** Manage service portfolios, set dynamic availability slots, and track assigned bookings.
  - **Customer:** Browse technicians, book services, and manage payment statuses.
- **Dynamic Booking System:** Built-in availability slot builder and interactive date-time pickers for precise scheduling.
- **Payment Integration:** Secure checkout flows with dedicated success and cancellation handling.
- **Review System:** Customers can leave reviews and ratings for technicians post-service.
- **Modern UI/UX:** Highly responsive and accessible interfaces built with Shadcn UI, Tailwind CSS, and custom Framer Motion-style animations (Marquee, Hero blocks).
- **Dark/Light Mode:** Full theming support configured via Next Themes.

## 🛠 Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** [shadcn/ui](https://ui.shadcn.com/) (Radix UI primitives)
- **Data Fetching & State:** React Query (TanStack Query) & Axios
- **Authentication Management:** Custom Auth Provider & Context/Zustand Hooks
- **Form Handling & Validation:** React Hook Form + Zod (via `lib/validations`)
- **Package Manager:** pnpm

## 📂 Project Structure & Routes

The application follows a feature-driven architecture, ensuring scalable and maintainable code.

### Core Routes

- `/(public)` - Landing page, `/services`, and `/technicians` directories.
- `/(auth)` - `/login` and `/register` for user authentication.
- `/(dashboard)/admin` - Admin controls (`/bookings`, `/categories`, `/users`).
- `/(dashboard)/customer` - Customer portal (`/bookings`, `/bookings/[id]/pay`).
- `/(dashboard)/technician` - Technician operations (`/availability`, `/bookings`, `/profile`, `/services`).
- `/payment` - Payment gateway callbacks (`/success`, `/cancel`).

### Key Directories

- `/features` - Encapsulated logic containing API calls, hooks, and types for specific domains (Admin, Bookings, Categories, Payments, Reviews, Services).
- `/components` - Reusable UI components, Shadcn primitives, and layout guards (e.g., `role-guard.tsx`).
- `/lib` - Core utilities, Axios interceptors, and constant values.
- `/service` & `/store` - Global state management and token refresh mechanisms.

## 🚀 Getting Started

Follow these steps to set up the project locally.

### Prerequisites

Ensure you have [Node.js](https://nodejs.org/) installed along with [pnpm](https://pnpm.io/).

### Installation

1. Clone the repository:
   git clone https://github.com/rafiferdos/spotfix.git
   cd spotfix

2. Install dependencies:
   pnpm install

3. Set up environment variables:
   Create a `.env.local` file in the root directory and add your required API endpoints and configuration keys.

4. Start the development server:
   pnpm run dev

5. Open http://localhost:3000 in your browser to view the application.

## 📜 License

This project is licensed under the MIT License.

---

made with love by [rafiferdos](https://github.com/rafiferdos)
