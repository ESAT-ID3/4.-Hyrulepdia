import { NavLink } from "react-router-dom";
import "./header.css";
import rupia from "../../assets/rupia-icon.png";
import { useEffect, useState } from "react";
import { useAuth } from "../../context/authContext";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../../firebaseConfig/firebaseConfig";

interface HeaderProps {
  isAnyModalOpen?: boolean;
}

export const Header = ({ isAnyModalOpen = false }: HeaderProps) => {
  const { user } = useAuth();
  const [gems, setGems] = useState<number | null>(null);

  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1124);

  useEffect(() => {
    if (!user) return;
    const userRef = doc(db, "users", user.uid);

    const unsubscribe = onSnapshot(userRef, (docSnap) => {
      if (docSnap.exists()) {
        setGems(docSnap.data().gems || 0);
      }
    });
    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1124);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (isMobile) return;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY < 0) return;

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setShowHeader(false);
      } else {
        setShowHeader(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY, isMobile]);

  return (
    <>
      <header className={`header ${!isMobile ? (isAnyModalOpen ? "header--hidden" : (showHeader ? "header--visible" : "header--hidden")) : ""}`}>
        <div className="header-logo">
          <NavLink className="header-logo" to="/">HYRULEPEDIA</NavLink>
        </div>
        <div className="header-content">
          {!isMobile && (
            <nav className="header-nav">
              <NavLink to="/shop">STORE</NavLink>
              <NavLink to="/collection">COLLECTION</NavLink>
              <NavLink to="/profile">PROFILE</NavLink>
            </nav>
          )}
          <div className="user-money">
            <p>{gems !== null ? gems.toLocaleString() : "..."}</p>
            <img className="img-rupia" src={rupia} alt="User gems" />
          </div>
        </div>
      </header>

      {isMobile && (
        <nav className="header-nav mobile-nav">
          <NavLink to="/shop">STORE</NavLink>
          <NavLink to="/collection">COLLECTION</NavLink>
          <NavLink to="/profile">PROFILE</NavLink>
        </nav>
      )}
    </>
  );
};
