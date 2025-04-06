# DJ Top Ranking App

A web application for ranking your favorite DJs.

## Authentication Setup

This application uses Supabase Authentication with Google OAuth. Follow these steps to set it up:

### 1. Create a Supabase Project

1. Go to [Supabase](https://supabase.com/) and create a new project
2. Get your project URL and anon key from the project settings

### 2. Set up environment variables

Create a `.env.local` file in the root of your project with the following variables:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Set up Google OAuth Provider

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or use an existing one
3. Navigate to "APIs & Services" > "Credentials"
4. Click "Create Credentials" and select "OAuth client ID"
5. Choose "Web application" as the application type
6. Add your app's URL to the "Authorized JavaScript origins" (e.g., `http://localhost:3000` for local development)
7. Add your app's callback URL to the "Authorized redirect URIs" (e.g., `http://localhost:3000/auth/callback` for local development)
8. Copy the Client ID and Client Secret

### 4. Configure Supabase Auth

1. In your Supabase project dashboard, go to "Authentication" > "Providers"
2. Find and enable "Google"
3. Paste your Google Client ID and Client Secret
4. Save the changes

### 5. Update Redirect URLs

1. In your Supabase project dashboard, go to "Authentication" > "URL Configuration"
2. Add your site URL (e.g., `http://localhost:3000` for local development)
3. Add your redirect URL (e.g., `http://localhost:3000/auth/callback`)

## Running the application

```bash
# Install dependencies
npm install

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
