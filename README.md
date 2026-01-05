# Aether Music Frontend

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-19.2.0-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-7.2.5-646CFF.svg)](https://vitejs.dev/)

A modern, responsive frontend application for a music streaming service, built with React and Vite. This application provides users with an intuitive interface to browse and listen to music, manage playlists, and explore albums and tracks.

## 🚀 Features

### Core Functionality
- **🔐 User Authentication**: Secure login and registration with JWT token management
- **🏠 Home Dashboard**: Personalized music recommendations and featured content sections
- **💿 Album Management**: Browse, search, and view detailed album information with track listings
- **🎵 Track Library**: Access and play individual tracks with full audio controls
- **📋 Playlist Creation**: Create, edit, and manage custom playlists
- **🎧 Audio Player**: Integrated music player with progress bar, volume control, and audio visualization
- **❤️ Liked Songs**: Save and manage favorite tracks in a dedicated collection

### User Experience
- **📱 Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **🎨 Modern UI**: Clean, intuitive interface with custom CSS styling
- **⚡ Fast Performance**: Built with Vite for rapid development and optimized builds
- **🔄 Real-time Updates**: Dynamic content loading and state management

### Technical Features
- **🛡️ Protected Routes**: Authentication-based route protection
- **📡 API Integration**: RESTful API communication with backend services
- **💾 Local Storage**: Persistent user sessions and preferences
- **🎛️ Context Management**: React Context API for global state management

## 🛠️ Tech Stack

### Frontend Framework
- **React 19.2.0**: Latest React with concurrent features and improved performance
- **React Router DOM 7.11.0**: Declarative routing for React applications

### Build & Development
- **Vite 7.2.5**: Fast build tool with native ES modules and hot module replacement
- **ESLint**: Code linting and formatting for consistent code quality

### Styling & UI
- **Custom CSS**: Modular CSS architecture with responsive design
- **CSS Variables**: Theme management through CSS custom properties

### State Management
- **React Context API**: Lightweight state management for authentication and player state
- **Local Storage**: Client-side data persistence

### HTTP Client
- **Custom HTTP Module**: Axios-based HTTP client with authentication headers and error handling

## 📁 Project Structure

```
aether-music-frontend/
├── public/                 # Static assets
├── src/
│   ├── api/               # API service functions
│   │   ├── album.api.js   # Album-related API calls
│   │   ├── auth.api.js    # Authentication API calls
│   │   ├── home.api.js    # Home page API calls
│   │   ├── http.js        # HTTP client configuration
│   │   ├── playEvent.api.js # Playback event tracking
│   │   ├── playlist.api.js # Playlist management API
│   │   └── track.api.js   # Track-related API calls
│   ├── auth/              # Authentication components
│   │   ├── AuthContext.jsx # Authentication context
│   │   └── RequireAuth.jsx # Route protection component
│   ├── components/        # Reusable UI components
│   │   ├── album/         # Album-related components
│   │   ├── auth/          # Authentication forms
│   │   ├── home/          # Home page components
│   │   ├── layout/        # Layout components (Player, Sidebar, etc.)
│   │   └── track/         # Track-related components
│   ├── context/           # React contexts
│   │   └── PlayerContext.jsx # Audio player state management
│   ├── pages/             # Main application pages
│   │   ├── AlbumDetail.jsx
│   │   ├── Albums.jsx
│   │   ├── Auth.jsx
│   │   ├── Home.jsx
│   │   ├── LikedSongs.jsx
│   │   ├── PlaylistDetail.jsx
│   │   ├── Playlists.jsx
│   │   ├── Register.jsx
│   │   └── Tracks.jsx
│   ├── styles/            # CSS stylesheets
│   │   ├── content.css
│   │   ├── forms.css
│   │   ├── home.css
│   │   ├── layout.css
│   │   ├── player.css
│   │   ├── responsive.css
│   │   ├── sidebar.css
│   │   └── variables.css
│   ├── utils/             # Utility functions
│   │   └── formatTime.js  # Time formatting utilities
│   ├── App.jsx            # Main application component
│   ├── index.css          # Global styles
│   └── main.jsx           # Application entry point
├── eslint.config.js       # ESLint configuration
├── index.html             # HTML template
├── package.json           # Project dependencies and scripts
├── README.md              # Project documentation
└── vite.config.js         # Vite configuration
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** (version 16 or higher)
- **npm** or **yarn** package manager
- **Backend Server**: [Aether Backend](https://github.com/devendrahere/Aether) running on `http://localhost:8080`

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/aether-music-frontend.git
   cd aether-music-frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser** and navigate to `http://localhost:5173`

### Backend Setup

This frontend requires the [Aether Backend](https://github.com/devendrahere/Aether) to be running. Follow these steps:

1. Clone and set up the backend:
   ```bash
   git clone https://github.com/devendrahere/Aether.git
   cd Aether
   # Follow backend setup instructions
   ```

2. Ensure the backend is running on `http://localhost:8080`

## 📜 Available Scripts

- `npm run dev` - Start the development server with hot reload
- `npm run build` - Build the project for production
- `npm run preview` - Preview the production build locally
- `npm run lint` - Run ESLint for code quality checks

## 🔗 API Integration

The frontend communicates with the backend through RESTful APIs. Key endpoints include:

- **Authentication**: `/api/auth/login`, `/api/auth/register`
- **Albums**: `/api/albums`, `/api/albums/{id}`
- **Tracks**: `/api/tracks`, `/api/tracks/{id}`
- **Playlists**: `/api/playlists`, `/api/playlists/{id}`
- **Home**: `/api/home/featured`, `/api/home/recommendations`

API calls are handled through the `src/api/` directory with a centralized HTTP client in `http.js`.

### Environment Configuration

The application currently uses a hardcoded base URL (`http://localhost:8080`). For production deployment, consider using environment variables:

```javascript
// In http.js
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";
```

## 🎨 Styling

The application uses a custom CSS architecture:

- **variables.css**: CSS custom properties for colors, fonts, and spacing
- **layout.css**: Main layout styles (header, sidebar, player)
- **content.css**: Content area styling
- **forms.css**: Form and input styling
- **player.css**: Audio player component styles
- **responsive.css**: Media queries for mobile responsiveness

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

### Deploy to Production

The built files can be deployed to any static hosting service:

- **Vercel**: Connect your GitHub repository for automatic deployments
- **Netlify**: Drag and drop the `dist` folder or connect via Git
- **GitHub Pages**: Use GitHub Actions for automated deployment

### Environment Variables for Production

Create a `.env.production` file:

```env
VITE_API_BASE_URL=https://your-api-domain.com
```

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes** and ensure code quality:
   ```bash
   npm run lint
   ```
4. **Test your changes** thoroughly
5. **Commit your changes**:
   ```bash
   git commit -m "Add your feature description"
   ```
6. **Push to the branch**:
   ```bash
   git push origin feature/your-feature-name
   ```
7. **Open a Pull Request**

### Development Guidelines

- Follow React best practices and hooks guidelines
- Use meaningful component and variable names
- Keep components small and focused on single responsibilities
- Maintain consistent code formatting with ESLint
- Test components and API integrations

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [React](https://reactjs.org/) and [Vite](https://vitejs.dev/)
- Icons and UI inspiration from various design systems
- Special thanks to the open-source community

## 📞 Support

If you have any questions or need help, please open an issue on GitHub or contact the maintainers.
