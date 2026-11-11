# StudioSpace — Book Creative Studios by the Hour

StudioSpace is a peer-to-peer marketplace where creators book photo studios, film stages, podcast lounges, music suites and art workshops by the hour — directly from the people who run them. Hosts list their spaces, creators discover and reserve them with transparent pricing and real-time booking management.

**Live Site:** ADD-YOUR-DEPLOYED-URL-HERE (replace this with the live Vercel URL after deployment)
**Server Repository:** https://github.com/shuvo524/studiospace-server

## Features

- **Dynamic studio marketplace** — all studios are fetched live from MongoDB; the home page shows 6 featured (top-rated / newest) studios with image, category, location, cancellation policy, hourly price, rating and a "View Studio" button.
- **Full studio details pages** (`/studios/:id`) with photo gallery, amenities, host details, reviews and a Book Now flow.
- **Real booking system** (`/add-booking/:studioId`) with a date picker and a 15-minute time-slot grid (8:00 AM – 11:00 PM), live total-price calculation, double-booking prevention on the server, booking requests, host approvals and cancellations.
- **Explore with search, filters and sorting** (`/studios`, also at `/all-studios`) — search by title, location, category or amenity; filter by category, hourly rate and capacity; sort by price or rating.
- **Complete host CRUD** — add a studio (`/add-studio`) with imgbb image upload and multi-photo gallery, manage listings (`/my-listings`) with an update page and delete confirmation dialog, and track bookings (`/my-bookings`).
- **Authentication & security** — BetterAuth (email/password + Google) with password rules, JWT API protection using HTTP-only cookies, and private routes for all dashboard pages.
- **Saved Studios wishlist** — heart any studio card and find it later on the Wishlist page, stored per user in MongoDB.
- **PDF booking invoices** — download a printable invoice for every booking.
- **Polished UX** — light/dark theme toggle, Sonner toast notifications, branded skeleton loaders, a custom 404 page, and a fully responsive design.

## Tech Stack

- **FrontEnd:** Next.js (App Router), TypeScript, Tailwind CSS, shadcn/ui components, Swiper, Sonner
- **BackEnd:** Express.js, TypeScript, MongoDB (native driver)
- **Authentication & Authorization:** BetterAuth (MongoDB adapter), JWT in HTTP-only cookies
- **Image Hosting:** imgbb
- **Deployment:** Vercel (client) / Render (server)

## Main Routes

| Route | Description |
| --- | --- |
| `/` | Home with hero slider, featured studios and more |
| `/studios` / `/all-studios` | Explore all studios with search, filters and sort |
| `/studios/:id` | Studio details, gallery, reviews, host info |
| `/add-booking/:studioId` | Book a studio (private) |
| `/add-studio` | Add a new studio listing (private) |
| `/my-listings` | My studio listings — update / delete (private) |
| `/my-bookings` | My bookings — cancel, invoice (private) |
| `/dashboard` | Dashboard hub with booking requests (private) |
| `/wishlist` | Saved studios (private) |
| `/login`, `/register` | Email/password or Google sign-in |

## Local Setup

### Client

```bash
git clone https://github.com/shuvo524/studiospace-client.git
cd studiospace-client
npm install
npm run dev
```

Create a `.env.local` file in the client root:

```env
MONGODB_URI=your_mongodb_connection_string
BACKEND_URL=http://localhost:5000
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
IMGBB_API_KEY=your_imgbb_api_key
INTERNAL_API_KEY=a_shared_secret_matching_the_server
```

### Server

```bash
git clone https://github.com/shuvo524/studiospace-server.git
cd studiospace-server
npm install
npm run dev
```

Create a `.env` file in the server root:

```env
PORT=5000
DATABASE_URI=your_mongodb_connection_string
CLIENT_URL=http://localhost:3000
JWT_SECRET=your_jwt_secret
INTERNAL_API_KEY=a_shared_secret_matching_the_client
```

Optional: fill the database with 10 demo studios (2 per category) by running
`npm run seed` in the server folder.

## Examiner Test Credentials

Use this demo account to review the private features (booking, listings, wishlist):

- **Email:** test@example.com
- **Password:** ADD-THE-DEMO-ACCOUNT-PASSWORD-HERE

## Challenges Implemented

- **JWT security with HTTP-only cookies** — all server mutations reject unauthenticated requests with 401.
- **Double-booking prevention** — new bookings are checked for time overlap against confirmed bookings and rejected with a clear message.
- **Theme customization** — one-click light/dark theme toggle across the whole site.
