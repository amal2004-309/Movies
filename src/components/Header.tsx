import type { FormEvent, MouseEvent } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Header.css";

interface HeaderProps {
  onNavigate?: () => void;
}

export function Header({ onNavigate }: HeaderProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  function handleHomeClick(event: MouseEvent<HTMLAnchorElement>) {
    if (location.pathname === "/") {
      event.preventDefault();
      onNavigate?.();
      navigate("/", { state: { reload: Date.now() } });
      return;
    }

    onNavigate?.();
  }

  async function handleLogout() {
    try {
      await logout();
      navigate("/auth");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }

  function handleSearchSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const query = String(formData.get("query") ?? "").trim();

    if (!query) {
      console.log("[Header] Search query is empty.");
      return;
    }

    onNavigate?.();
    navigate(`/?query=${encodeURIComponent(query)}`);
  }

  return (
    <header className="header">
      <div className="header__top">
        <nav className="header__nav">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `header__link${isActive ? " header__link--active" : ""}`
            }
            end
            onClick={handleHomeClick}
          >
            Home
          </NavLink>
          <NavLink
            to="/favourites"
            className={({ isActive }) =>
              `header__link${isActive ? " header__link--active" : ""}`
            }
            onClick={() => onNavigate?.()}
          >
            Favourites
          </NavLink>
        </nav>
        {user && (
          <button
            className="header__logout-button"
            type="button"
            onClick={handleLogout}
          >
            Logout
          </button>
        )}
      </div>

      <form
        className="header__search"
        role="search"
        onSubmit={handleSearchSubmit}
      >
        <input
          className="header__input"
          type="search"
          name="query"
          placeholder="Search movies..."
          aria-label="Search"
        />
        <button className="header__button" type="submit">
          Search
        </button>
      </form>
    </header>
  );
}
