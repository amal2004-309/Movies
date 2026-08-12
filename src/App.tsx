import { useEffect, useState } from "react";
import { useLocation, Routes, Route } from "react-router-dom";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { PageLoader } from "./components/PageLoader";
import { GuestRoute } from "./components/GuestRoute";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AuthView } from "./pages/Auth/AuthView";
import { HomeView } from "./pages/Home/HomeView";
import { FavouritesView } from "./pages/Favourites/FavouritesView";
import "./App.css";

function App() {
  const location = useLocation();
  const [isNavigating, setIsNavigating] = useState(false);

  useEffect(() => {
    setIsNavigating(false);
  }, [location]);

  return (
    <div className="app-shell">
      <Header onNavigate={() => setIsNavigating(true)} />
      <PageLoader active={isNavigating} />
      <main className="app-shell__content">
        <Routes>
          <Route path="/" element={<HomeView />} />
          <Route
            path="/auth"
            element={
              <GuestRoute>
                <AuthView />
              </GuestRoute>
            }
          />
          <Route
            path="/favourites"
            element={
              <ProtectedRoute>
                <FavouritesView />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
