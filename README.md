# Imagineer AI

A modern AI image generation and editing application built with Next.js 15, Gemini AI, and Supabase.

## Features

- **AI Image Generation**: Generate images from text prompts using Gemini AI
- **Image Editing**: Upload and edit images with AI assistance
- **Authentication**: Sign in with Google or GitHub via Supabase Auth
- **Free Tier**: 5 free generations for non-authenticated users
- **Modern UI**: Responsive design with Tailwind CSS

## Tech Stack

- **Frontend**: Next.js 15, React 19, Tailwind CSS
- **Authentication & Storage**: Supabase
- **AI**: Gemini API (Google)
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account
- Gemini API key

### Environment Setup

Create a `.env.local` file in the root directory with the following variables:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
GEMINI_API_KEY=your_gemini_api_key
```

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Database Schema

### Tables

1. **generated_images**
   - `id`: uuid (primary key)
   - `user_id`: string (references auth.users.id)
   - `prompt`: text
   - `image_url`: text
   - `created_at`: timestamp with time zone

### Storage Buckets

1. **images**
   - Public bucket for storing user-uploaded and generated images

## Authentication Flow

1. Users can browse and make up to 5 image generations without logging in
2. Once the free tier is exhausted, users are prompted to sign in
3. Authentication is handled via Supabase Auth with Google and GitHub providers
4. After successful authentication, users are redirected back to the application

## Deployment

The application is configured for deployment on Vercel. Simply connect your GitHub repository to Vercel and deploy.

## License

This project is for educational purposes only and is not intended for commercial use.

## Acknowledgments

- Gemini API for AI image generation capabilities
- Supabase for authentication and storage
- Next.js team for the amazing framework
- shadcn/ui for UI components
