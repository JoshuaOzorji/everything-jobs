This is a Next.js application with Sanity CMS integration, featuring both public job browsing and authenticated company dashboard functionality.

## Application Architecture Overview

**Everything Jobs** application is a comprehensive job board built with:

### **Core Technologies:**

- **Next.js 14** with App Router
- **Sanity CMS** for content management
- **NextAuth.js** for authentication
- **React Query** for data fetching and caching
- **Tailwind CSS** for styling
- **MongoDB** for users data management

### **Key User Flows:**

1. **Public Job Browsing:**

      - Homepage displays latest jobs with pagination
      - Advanced search and filtering capabilities
      - Category-based browsing (location, type, field, level, education)
      - Individual job detail pages with related jobs

2. **Authentication System:**

      - Login/signup functionality via NextAuth
      - Session management with enhanced user data
      - Company profile association

3. **Company Dashboard:**

      - Protected routes requiring authentication
      - Company profile management (required before posting jobs)
      - Job posting with validation and approval workflow
      - Job management and status tracking

4. **Data Storage:**

- **MongoDB**: Handles user authentication data, user accounts, sessions, and user profiles
- **Sanity CMS**: Manages all job-related content, company profiles, and reference data (locations, job types, etc.)

### **Key Data Flows:**

- **User Registration/Login** → MongoDB for user account storage
- **Session Management** → MongoDB for session persistence
- **Job Content** → Sanity CMS for content management
- **Company Profiles** → Sanity CMS (linked to MongoDB user accounts)

This hybrid approach allows to leverage MongoDB's strengths for user management and authentication while using Sanity's powerful content management capabilities for job listings and related content.

### **Key Features:**

- **Responsive Design:** Mobile-first approach with adaptive navigation
- **Performance Optimized:** Static generation, ISR, and React Query caching
- **SEO Friendly:** Server-side rendering with dynamic metadata
- **Content Management:** Sanity Studio for admin content editing
- **Real-time Updates:** Efficient data fetching and caching strategies

The application follows a clean separation of concerns with public job browsing, authenticated company features, and a robust API layer connecting to Sanity CMS for data persistence.
