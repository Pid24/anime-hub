# AnimeHub

AnimeHub is a premium, responsive anime explorer web application built with [Next.js](https://nextjs.org/) and the [AniList GraphQL API](https://anilist.co/). It features a cinematic, dark-themed UI inspired by modern streaming platforms, providing users with an immersive experience to discover new, trending, and popular anime.

## 🌟 Features

- **Discover Anime:** Browse through curated categories including Trending Now, Popular, Top Rated, and Seasonal Picks.
- **Advanced Search & Filtering:** Find specific anime using text search and advanced filters (genres, year, format, etc.).
- **Cinematic UI:** Beautiful, responsive glassmorphism design with ambient glow effects and smooth animations.
- **Infinite Scrolling & Pagination:** Seamlessly browse through large lists of anime without performance hiccups.
- **Detailed Information:** View comprehensive details about each anime, including high-quality banners, synopses, scores, and trailers.

## 🛠️ Tech Stack

- **Framework:** [Next.js 15](https://nextjs.org/) (App Router)
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com/)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Data Source:** [AniList GraphQL API](https://github.com/AniList/ApiV2-GraphQL-Docs)

## 📋 Prerequisites

Before you begin, ensure you have the following installed on your machine:
- **Node.js**: v18.17.0 or higher
- **npm** (or yarn, pnpm, bun)

## 🚀 Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd animehub
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Environment Variables:**
   The project is configured to work out of the box with the public AniList API. However, if you need to set up any custom environment variables, you can create a `.env.local` file in the root directory.

4. **Run the development server:**
   ```bash
   npm run dev
   # or
   yarn dev
   ```
   *Note: This project uses Turbopack for faster development builds.*

5. **Open the App:**
   Open your browser and navigate to [http://localhost:3000](http://localhost:3000).

## 📁 Project Structure

```text
animehub/
├── public/             # Static assets (images, icons)
├── src/
│   ├── app/            # Next.js App Router pages and layouts
│   ├── components/     # Reusable React components (UI, layout, cards)
│   ├── lib/            # Utility functions and API clients (AniList GQL)
│   └── types/          # TypeScript definitions
├── package.json        # Project dependencies and scripts
├── tailwind.config.*   # Tailwind styling configurations
└── next.config.ts      # Next.js configuration
```

## 🎮 Usage

- **Home Page:** On launch, you will see a hero banner featuring top anime, followed by horizontally scrollable rows categorizing anime by Trending, Popular, Top Rated, and Seasonal.
- **Search Page (`/search`):** Click the search icon in the header to navigate to the search page where you can find specific titles or apply filters to discover anime by genre or season.
- **Detail Page:** Click on any anime card to view its full details, including a high-definition banner, synopsis, trailer, and additional metadata.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the issues page.

## 📝 License

This project is open-source and available under the terms of the MIT License.
