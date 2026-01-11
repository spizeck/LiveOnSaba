# LiveOnSaba.com - Project Development Guide

> A rental listing platform for Saba, Dutch Caribbean. This document serves as the authoritative reference for AI-assisted development in Windsurf.

---

## Project Overview

**Purpose:** Centralized platform for rental property listings on Saba, allowing landlords to post available housing and prospective tenants to browse, filter, save, and review properties.

**Domain:** liveonsaba.com

**Target Scale:** ~100-200 total rental properties on island, never more than ~25 available at once.

---

## Tech Stack

| Component | Technology | Notes |
|-----------|------------|-------|
| Framework | Next.js 14+ (App Router) | TypeScript, Server Components |
| Database | Firebase Firestore | NoSQL document database |
| Authentication | Firebase Auth | Email/password + Google |
| File Storage | Firebase Storage | Property photos |
| Email Service | Resend | Transactional emails, 3k/month free |
| Hosting | Vercel | Automatic deployments from Git |
| Styling | Tailwind CSS | With dark mode support |
| UI Components | shadcn/ui (optional) | Accessible, customizable |

---

## Design Guidelines

### Visual Direction

- **Theme:** Earthy, rainforest-inspired to match Saba's environment
- **Mode:** Light and dark mode support required
- **Mobile:** Mobile-first, fully responsive
- **Style:** Clean and simple, not cluttered

### Color Palette (Suggested)

```css
/* Light Mode */
--primary: #2D5A3D;        /* Forest green */
--secondary: #8B7355;      /* Earthy brown */
--accent: #4A7C59;         /* Moss green */
--background: #F5F3F0;     /* Warm off-white */
--surface: #FFFFFF;        /* Card backgrounds */
--text-primary: #1A1A1A;   /* Near black */
--text-secondary: #5A5A5A; /* Muted text */

/* Dark Mode */
--primary: #6BBF7A;        /* Lighter green for contrast */
--secondary: #C4A77D;      /* Warmer brown */
--accent: #7FB88B;         /* Soft moss */
--background: #1A1F1C;     /* Dark forest */
--surface: #252B27;        /* Card backgrounds */
--text-primary: #F0F0F0;   /* Off-white */
--text-secondary: #A0A0A0; /* Muted text */
```

### Typography

- Clean sans-serif (Inter or similar)
- Clear hierarchy for listings
- Readable on mobile

---

## User Roles & Permissions

### Visitor (No Account)
- Browse all active listings
- View listing details and photos
- View landlord profiles and reviews
- Use search and filters
- Contact landlords via form (if enabled)

### Registered User
- All visitor capabilities
- Save favorite listings to personal list
- Create saved searches with notification preferences
- Receive email alerts for matching new listings

### Verified Tenant
- All registered user capabilities
- Leave reviews on properties they've rented
- Requires admin verification with proof (signed lease or utility bill)

### Landlord
- Create and manage property listings
- Toggle listings active/inactive
- Receive inquiry notifications
- View their listing analytics
- Respond to availability verification emails
- Requires admin approval to become landlord

### Admin
- Full access to all data
- Approve/reject landlord applications
- Verify tenant status (review proof documents)
- Moderate reviews (approve/reject)
- Feature/highlight listings
- Edit any listing or user
- View platform analytics
- Send platform announcements

---

## Data Models

### User Document
```typescript
interface User {
  id: string;                          // Firebase Auth UID
  email: string;
  displayName: string;
  role: 'user' | 'landlord' | 'admin';
  createdAt: Timestamp;
  updatedAt: Timestamp;
  
  // Tenant verification
  isVerifiedTenant: boolean;
  tenantVerificationDoc?: string;      // Storage path to proof document
  tenantVerifiedAt?: Timestamp;
  tenantVerifiedBy?: string;           // Admin UID
  
  // Saved content
  savedListings: string[];             // Array of listing IDs
  savedSearches: SavedSearch[];
  
  // Notification preferences
  emailNotifications: boolean;
  notificationFrequency: 'instant' | 'daily' | 'weekly';
}

interface SavedSearch {
  id: string;
  name: string;
  filters: ListingFilters;
  createdAt: Timestamp;
  alertEnabled: boolean;
}

interface ListingFilters {
  areas?: Area[];
  minBedrooms?: number;
  maxBedrooms?: number;
  minPrice?: number;
  maxPrice?: number;
  petsAllowed?: boolean;
  parkingType?: 'onProperty' | 'street';
}
```

### Landlord Document
```typescript
interface Landlord {
  id: string;                          // Same as User ID
  userId: string;                      // Reference to User
  
  // Approval status
  approved: boolean;
  approvedAt?: Timestamp;
  approvedBy?: string;                 // Admin UID
  applicationDate: Timestamp;
  
  // Profile (public)
  profileDescription?: string;
  profilePhoto?: string;               // Storage path
  
  // Contact info
  contactEmail: string;
  contactPhone?: string;
  showContactPublicly: boolean;
  
  // Stats (computed)
  totalListings: number;
  activeListings: number;
  averageRating?: number;
  reviewCount: number;
}
```

### Listing Document
```typescript
type Area = 
  | 'windwardside'
  | 'st-johns'
  | 'the-bottom'
  | 'booby-hill'
  | 'the-level'
  | 'upper-hells-gate'
  | 'lower-hells-gate'
  | 'english-quarter'
  | 'mountain-road'
  | 'wells-bay-road'
  | 'troy-hill';

type ListingStatus = 
  | 'coming-soon'
  | 'available'
  | 'pending'
  | 'off-market';

type FurnishedStatus = 'yes' | 'partial' | 'no';
type PetPolicy = 'yes' | 'no' | 'negotiable';
type ParkingType = 'on-property' | 'street';
type OccupantPolicy = 'allowed' | 'additional-fee' | 'not-allowed';
type UtilityIncluded = 'yes' | 'partial' | 'no';

interface Listing {
  id: string;
  landlordId: string;                  // Reference to Landlord
  
  // Basic info
  title: string;
  description: string;
  monthlyRent: number;                 // USD
  
  // Location
  area: Area;
  address: string;
  location: GeoPoint;                  // For map display
  
  // Property details
  bedrooms: number;
  bathrooms: number;
  squareFootage?: number;
  
  // Status
  status: ListingStatus;
  availableFrom?: Timestamp;           // For 'coming-soon' status
  
  // Features (structured for filtering)
  furnished: FurnishedStatus;
  petsAllowed: PetPolicy;
  parking: ParkingType;
  secondOccupant: OccupantPolicy;
  
  // Utilities (checkboxes + details)
  utilities: {
    electric: UtilityIncluded;
    electricAllowance?: string;        // e.g., "$50/month included"
    water: UtilityIncluded;
    waterDetails?: string;             // e.g., "Shared cistern"
    internet: UtilityIncluded;
    otherDetails?: string;             // Free text for nuances
  };
  
  // Media
  photos: string[];                    // Storage paths, max 10
  primaryPhotoIndex: number;           // Which photo to show in list view
  
  // Contact preferences
  contactFormEnabled: boolean;
  showContactInfo: boolean;
  
  // Verification
  lastVerifiedAt: Timestamp;
  verificationEmailSentAt?: Timestamp;
  
  // Admin/display
  featured: boolean;
  
  // Analytics
  viewCount: number;
  inquiryCount: number;
  
  // Timestamps
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

### Review Document
```typescript
interface Review {
  id: string;
  listingId: string;
  landlordId: string;
  reviewerId: string;                  // Verified tenant User ID
  
  // Ratings (1-5 scale)
  ratings: {
    location: number;
    quality: number;
    upkeep: number;
    communication: number;
    accuracy: number;                  // How accurate was the listing
  };
  overallRating: number;               // Computed average
  
  // Content
  writtenReview: string;
  
  // Moderation
  status: 'pending' | 'approved' | 'rejected';
  moderatedAt?: Timestamp;
  moderatedBy?: string;                // Admin UID
  rejectionReason?: string;
  
  // Timestamps
  createdAt: Timestamp;
}
```

### Inquiry Document
```typescript
interface Inquiry {
  id: string;
  listingId: string;
  landlordId: string;
  
  // Sender info
  senderName: string;
  senderEmail: string;
  senderPhone?: string;
  message: string;
  
  // Status
  read: boolean;
  readAt?: Timestamp;
  
  // Timestamps
  createdAt: Timestamp;
}
```

### Admin Action Log
```typescript
interface AdminAction {
  id: string;
  adminId: string;
  actionType: 
    | 'landlord-approved'
    | 'landlord-rejected'
    | 'tenant-verified'
    | 'review-approved'
    | 'review-rejected'
    | 'listing-featured'
    | 'listing-edited'
    | 'user-edited';
  targetId: string;                    // ID of affected entity
  targetType: 'user' | 'landlord' | 'listing' | 'review';
  notes?: string;
  timestamp: Timestamp;
}
```

---

## Firestore Collections Structure

```
/users/{userId}
/landlords/{landlordId}
/listings/{listingId}
/reviews/{reviewId}
/inquiries/{inquiryId}
/adminActions/{actionId}
```

### Firestore Indexes Required

```
listings: status ASC, area ASC, monthlyRent ASC
listings: status ASC, bedrooms ASC, monthlyRent ASC
listings: landlordId ASC, createdAt DESC
reviews: landlordId ASC, status ASC, createdAt DESC
reviews: listingId ASC, status ASC, createdAt DESC
inquiries: landlordId ASC, read ASC, createdAt DESC
```

---

## Firebase Storage Structure

```
/listings/{listingId}/photos/{photoId}.jpg
/landlords/{landlordId}/profile.jpg
/verifications/{userId}/{documentId}.pdf
```

### Storage Rules (Example)
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Listing photos - landlord can upload to their own listings
    match /listings/{listingId}/photos/{photo} {
      allow read: if true;
      allow write: if isLandlordOfListing(listingId);
    }
    
    // Landlord profile photos
    match /landlords/{landlordId}/profile.jpg {
      allow read: if true;
      allow write: if request.auth.uid == landlordId;
    }
    
    // Verification documents - user uploads, admin reads
    match /verifications/{userId}/{document} {
      allow read: if isAdmin();
      allow write: if request.auth.uid == userId;
    }
  }
}
```

---

## Email Workflows

### 1. Landlord Application Submitted
- **Trigger:** New landlord document created
- **To:** Admin email(s)
- **Content:** New application details, link to approve/reject

### 2. Landlord Approved
- **Trigger:** Landlord approved field set to true
- **To:** Landlord email
- **Content:** Welcome message, link to create first listing

### 3. Landlord Rejected
- **Trigger:** Landlord application rejected
- **To:** Landlord email
- **Content:** Rejection notice with reason (if provided)

### 4. New Inquiry Received
- **Trigger:** New inquiry document created
- **To:** Landlord email
- **Content:** Inquiry details, link to listing

### 5. Availability Verification
- **Trigger:** Scheduled job (weekly for active listings)
- **To:** Landlord email
- **Content:** "Is [Property] still available?" with Yes/No action links
- **Note:** Include one-click verification links with signed tokens

### 6. Listing Auto-Deactivated
- **Trigger:** 30 days without verification response
- **To:** Landlord email
- **Content:** Notice that listing was deactivated, link to reactivate

### 7. New Matching Listing Alert
- **Trigger:** New listing matches a saved search
- **To:** User email (respecting frequency preference)
- **Content:** Listing summary with link

### 8. Review Submitted
- **Trigger:** New review document created
- **To:** Admin email(s)
- **Content:** Review details, link to approve/reject

### 9. Review Published
- **Trigger:** Review status changed to approved
- **To:** Landlord email
- **Content:** Notice of new review, link to view

---

## Development Phases

### Phase 1: MVP (Core Functionality)

#### 1.1 Project Setup
- [ ] Initialize Next.js project with TypeScript
- [ ] Configure Tailwind CSS with custom theme (earthy colors)
- [ ] Set up dark mode toggle
- [ ] Configure Firebase (Auth, Firestore, Storage)
- [ ] Set up Resend for emails
- [ ] Configure Vercel deployment
- [ ] Set up environment variables

#### 1.2 Authentication
- [ ] Sign up / sign in pages
- [ ] Email/password authentication
- [ ] Google OAuth (optional but nice)
- [ ] Password reset flow
- [ ] Protected route middleware
- [ ] Role-based access control

#### 1.3 Public Listing Browse
- [ ] Listings grid/list view with pagination
- [ ] Listing card component (photo, title, price, beds, area)
- [ ] Filter sidebar/drawer (area, beds, price, pets, parking)
- [ ] Sort options (newest, price low-high, price high-low)
- [ ] Listing detail page
- [ ] Photo gallery/lightbox
- [ ] Map integration (show exact location)
- [ ] Contact form (if landlord enabled it)
- [ ] Display contact info (if landlord allows)

#### 1.4 Landlord Functionality
- [ ] Landlord application form
- [ ] Landlord dashboard layout
- [ ] Create new listing form
- [ ] Edit listing form
- [ ] Photo upload (drag & drop, reorder, max 10)
- [ ] Active/inactive toggle
- [ ] View inquiries list
- [ ] Mark inquiry as read

#### 1.5 Admin Dashboard
- [ ] Admin layout/navigation
- [ ] Pending landlord applications list
- [ ] Approve/reject landlord with notes
- [ ] All listings view (filterable)
- [ ] Edit any listing
- [ ] Basic stats (total listings, by status, by area)

#### 1.6 Core Emails
- [ ] Set up Resend integration
- [ ] Email templates (consistent branding)
- [ ] Landlord approved email
- [ ] New inquiry notification

---

### Phase 2: Engagement Features

#### 2.1 User Accounts
- [ ] User dashboard layout
- [ ] Save/unsave listing functionality
- [ ] Saved listings page
- [ ] Create saved search from current filters
- [ ] Manage saved searches
- [ ] Notification frequency preference

#### 2.2 Landlord Profiles
- [ ] Public landlord profile page
- [ ] Profile photo upload
- [ ] Profile description editor
- [ ] All listings by this landlord
- [ ] Aggregate rating display (placeholder until reviews)

#### 2.3 Availability Verification System
- [ ] Scheduled Cloud Function (weekly check)
- [ ] Generate secure verification tokens
- [ ] Verification email with one-click links
- [ ] API endpoint to process verification response
- [ ] Auto-deactivate after 30 days no response
- [ ] "Last verified" badge on listings
- [ ] Manual verify button in landlord dashboard
- [ ] Deactivation notification email

#### 2.4 New Listing Alerts
- [ ] Cloud Function trigger on new listing
- [ ] Match against saved searches
- [ ] Respect frequency preferences (instant vs batch)
- [ ] Daily/weekly digest Cloud Function
- [ ] Unsubscribe link handling

---

### Phase 3: Trust & Reviews

#### 3.1 Tenant Verification
- [ ] "Verify tenancy" page in user account
- [ ] Select property lived at
- [ ] Upload proof document (PDF/image)
- [ ] Admin verification queue
- [ ] Approve/reject verification
- [ ] Display "Verified Tenant" badge

#### 3.2 Review System
- [ ] "Write review" button on listings (verified tenants only)
- [ ] Review form (star ratings + written)
- [ ] Review submission → pending status
- [ ] Admin review moderation queue
- [ ] Approve/reject with reason
- [ ] Display reviews on listing page
- [ ] Display reviews on landlord profile
- [ ] Calculate aggregate ratings
- [ ] Review published notification to landlord

---

### Phase 4: Polish & Growth

#### 4.1 Featured Listings
- [ ] Admin toggle to feature listings
- [ ] Featured section on homepage
- [ ] Featured badge on listing cards
- [ ] Featured listings appear first in search

#### 4.2 Analytics Dashboard
- [ ] View count tracking per listing
- [ ] Inquiry count tracking
- [ ] Landlord dashboard with their stats
- [ ] Admin dashboard with platform stats
- [ ] Charts/graphs (listings over time, by area)

#### 4.3 SEO & Performance
- [ ] Dynamic meta tags per listing
- [ ] Structured data (JSON-LD for rental listings)
- [ ] Sitemap generation
- [ ] Open Graph images
- [ ] Image optimization
- [ ] Performance audit

#### 4.4 Future Additions
- [ ] Government-approved lease template (downloadable PDF)
- [ ] Interactive lease form (generates PDF)
- [ ] Landlord subscription/listing fees
- [ ] Enhanced analytics

---

## Page Structure

```
/                           # Homepage with featured + recent listings
/listings                   # Browse all listings with filters
/listings/[id]              # Listing detail page
/landlords/[id]             # Landlord profile page

/auth/signin                # Sign in page
/auth/signup                # Sign up page
/auth/forgot-password       # Password reset
/auth/reset-password        # Reset password with token

/dashboard                  # User dashboard (saved listings, searches)
/dashboard/saved            # Saved listings
/dashboard/searches         # Saved searches
/dashboard/settings         # Account settings
/dashboard/verify-tenancy   # Upload tenancy proof

/landlord                   # Landlord dashboard
/landlord/listings          # Manage listings
/landlord/listings/new      # Create new listing
/landlord/listings/[id]     # Edit listing
/landlord/inquiries         # View inquiries
/landlord/profile           # Edit landlord profile
/landlord/apply             # Landlord application (for users)

/admin                      # Admin dashboard
/admin/landlords            # Manage landlord applications
/admin/listings             # All listings
/admin/reviews              # Review moderation queue
/admin/verifications        # Tenant verification queue
/admin/analytics            # Platform stats
```

---

## API Routes / Server Actions

```
# Auth (handled by Firebase, but custom actions for roles)
POST /api/auth/set-role          # Admin: set user role

# Listings
GET  /api/listings               # Public: fetch with filters
POST /api/listings               # Landlord: create listing
PUT  /api/listings/[id]          # Landlord/Admin: update listing
DELETE /api/listings/[id]        # Landlord/Admin: delete listing
POST /api/listings/[id]/verify   # Landlord: verify availability (from email link)

# Inquiries
POST /api/inquiries              # Public: submit inquiry
GET  /api/inquiries              # Landlord: get their inquiries
PUT  /api/inquiries/[id]/read    # Landlord: mark as read

# Reviews
POST /api/reviews                # Verified tenant: submit review
PUT  /api/reviews/[id]/moderate  # Admin: approve/reject

# Landlords
POST /api/landlords/apply        # User: apply to be landlord
PUT  /api/landlords/[id]/approve # Admin: approve application
PUT  /api/landlords/[id]/reject  # Admin: reject application

# Users
PUT  /api/users/[id]/verify-tenant  # Admin: verify tenancy
POST /api/users/saved-listings      # User: save/unsave listing
POST /api/users/saved-searches      # User: create saved search

# Admin
GET  /api/admin/stats            # Admin: platform statistics

# Webhooks
POST /api/webhooks/verify-listing  # Handle email verification clicks
```

---

## Environment Variables

```env
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# Firebase Admin (server-side)
FIREBASE_ADMIN_PROJECT_ID=
FIREBASE_ADMIN_CLIENT_EMAIL=
FIREBASE_ADMIN_PRIVATE_KEY=

# Resend
RESEND_API_KEY=

# App
NEXT_PUBLIC_APP_URL=https://liveonsaba.com
ADMIN_EMAILS=chad@example.com  # Comma-separated admin notification emails

# Verification tokens
VERIFICATION_SECRET=  # Secret for signing email verification links
```

---

## Security Considerations

### Firestore Rules (Summary)
- Listings: Public read, landlord write (own), admin write (all)
- Users: Own read/write, admin read/write all
- Landlords: Public read (approved only), own write, admin all
- Reviews: Public read (approved), verified tenant create, admin moderate
- Inquiries: Landlord read (own), public create, admin read all
- Admin actions: Admin only

### Input Validation
- Sanitize all text inputs
- Validate file types for uploads (images: jpg, png, webp; docs: pdf)
- Limit file sizes (photos: 5MB each, verification docs: 10MB)
- Rate limit inquiry submissions
- Validate email addresses

### Authentication
- Require email verification for landlord applications
- Secure password requirements
- Session management via Firebase Auth

---

## Testing Checklist

### Before Launch
- [ ] Test all user flows (visitor, user, landlord, admin)
- [ ] Test on mobile devices (iOS Safari, Android Chrome)
- [ ] Test dark mode throughout
- [ ] Test email deliverability (check spam filters)
- [ ] Test photo uploads (various sizes, formats)
- [ ] Load test with sample data
- [ ] Security audit (Firestore rules, API routes)
- [ ] Accessibility audit (screen reader, keyboard nav)
- [ ] Cross-browser testing

### Sample Data for Testing
- Create 10-15 sample listings across different areas
- Create 3-4 landlord accounts
- Create sample reviews
- Test all status types (coming soon, available, pending, off market)

---

## Deployment Checklist

- [ ] Firebase project created (production)
- [ ] Firestore indexes deployed
- [ ] Storage rules deployed
- [ ] Auth providers configured
- [ ] Resend domain verified
- [ ] Vercel project connected to repo
- [ ] Environment variables set in Vercel
- [ ] Custom domain configured (liveonsaba.com)
- [ ] SSL certificate active
- [ ] Error monitoring set up (Vercel Analytics or Sentry)

---

## Notes for AI Development

### When Building Components
- Use TypeScript strictly (no `any` types)
- Create reusable components in `/components`
- Use server components by default, client components only when needed
- Follow the data models exactly as specified
- Use Tailwind for styling, respect the color palette
- Always handle loading and error states
- Make all forms accessible (labels, aria attributes)

### When Working with Firebase
- Use Firebase Admin SDK on server (API routes, server actions)
- Use Firebase Client SDK on client
- Always validate data against the schema before writes
- Use transactions for operations that update multiple documents
- Create indexes for any new query patterns

### When Building Forms
- Use react-hook-form for complex forms
- Validate on client AND server
- Show clear error messages
- Support keyboard navigation
- Show loading state during submission

### Naming Conventions
- Components: PascalCase (`ListingCard.tsx`)
- Utilities: camelCase (`formatPrice.ts`)
- API routes: kebab-case (`/api/saved-listings`)
- Database fields: camelCase (matching TypeScript interfaces)

---

## Reference: Saba Areas

| Value | Display Name |
|-------|--------------|
| windwardside | Windwardside |
| st-johns | St. Johns |
| the-bottom | The Bottom |
| booby-hill | Booby Hill |
| the-level | The Level |
| upper-hells-gate | Upper Hell's Gate |
| lower-hells-gate | Lower Hell's Gate |
| english-quarter | English Quarter |
| mountain-road | Mountain Road |
| wells-bay-road | Wells Bay Road |
| troy-hill | Troy Hill |

---

*Last updated: January 2026*
*Version: 1.0*
