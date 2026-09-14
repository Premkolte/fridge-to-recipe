import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar.jsx';
import HomePage from './pages/HomePage.jsx';
import RecipePage from './pages/RecipePage.jsx';
import AboutPage from './pages/AboutPage.jsx';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary.jsx';

/**
 * App — root component. Owns routing.
 * Navbar rendered on all routes.
 */
function App() {
  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <Navbar />
      <main className="flex-1">
        <ErrorBoundary>
          <Routes>
            <Route path="/"       element={<HomePage />} />
            <Route path="/recipe" element={<RecipePage />} />
            <Route path="/about"  element={<AboutPage />} />
          </Routes>
        </ErrorBoundary>
      </main>
    </div>
  );
}

export default App;
