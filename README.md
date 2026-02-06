# LiveOnSaba.com

A rental listing platform for Saba, Dutch Caribbean.

## Development Progress

### ✅ Completed
- **Authentication System** - Sign in, sign up, forgot password, Google OAuth, session cookies
- **Dark Mode** - Tailwind v4 class-based theme switching
- **Landlord Application** - Apply form with duplicate prevention, status tracking
- **Admin Dashboard** - Landlord management with approve/reject/suspend tabs
- **Mock Data Seeding** - Script to populate test data (`npm run seed`)

### 🚧 In Progress
- Listings browse page
- Listing detail page

### 📋 Upcoming
- Landlord portal (manage listings, create/edit)
- Inquiry/contact system
- User dashboard (saved listings, searches)
- Review system
- Email notifications

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Firebase account
- Resend account (for emails)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy `.env.example` to `.env.local` and fill in your environment variables:
   ```bash
   cp .env.example .env.local
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (public)/          # Public routes
│   ├── (auth)/            # Auth routes
│   ├── dashboard/         # User dashboard
│   ├── landlord/          # Landlord dashboard
│   ├── admin/             # Admin dashboard
│   ├── api/               # API routes
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── ui/                # Reusable UI components
│   ├── forms/             # Form components
│   ├── listings/          # Listing components
│   ├── layout/            # Layout components
│   └── providers/         # Context providers
├── lib/
│   ├── firebase/          # Firebase config
│   ├── utils/             # Utility functions
│   ├── hooks/             # Custom React hooks
│   └── types/             # TypeScript types
└── config/                # App configuration
```

## Tech Stack

- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS
- **Database:** Firebase Firestore
- **Authentication:** Firebase Auth
- **Storage:** Firebase Storage
- **Email:** Resend
- **Hosting:** Vercel

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run seed` - Seed mock data to Firestore

## Environment Variables

See `.env.example` for required environment variables.

## License

All rights reserved.
