import { NavLink } from 'react-router-dom';
import { useState } from 'react';
import ThemeToggle from './ThemeToggle';
import CalculationHistory from './CalculationHistory';
import './Navbar.css';

function Navbar() {
  const [showHistory, setShowHistory] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const handleLoadCalculation = (calculation) => {
    // This would be handled by the specific calculator page
    console.log('Loading calculation:', calculation);
    setShowHistory(false);
  };

  const closeMenu = () => {
    setShowMobileMenu(false);
  };

  return (
    <nav className="navbar">
      <div className="nav-left">
        <button 
          onClick={() => setShowMobileMenu(!showMobileMenu)}
          className="menu-button"
          aria-label="Menu"
        >
          <span className={`menu-icon ${showMobileMenu ? 'open' : ''}`}></span>
        </button>
        
        <div className="nav-brand">
          <NavLink to="/" className="brand-link" onClick={closeMenu}>
            <span className="brand-icon"></span>
            <span>Calculateur IP</span>
          </NavLink>
        </div>
      </div>

      <div className="nav-right">
        <button 
          onClick={() => setShowHistory(true)}
          className="nav-action-button"
          title="Historique des calculs"
        >
          <span className="history-icon"></span>
        </button>
        
        <ThemeToggle />
      </div>

      {/* Overlay for mobile menu */}
      {showMobileMenu && (
        <div className="menu-overlay" onClick={closeMenu}></div>
      )}
      
      {/* Navigation Menu */}
      <div className={`nav-menu ${showMobileMenu ? 'open' : ''}`}>
        <div className="nav-menu-content">
          <div className="nav-group">
            <span className="nav-group-title">Calculateurs de Base</span>
            <NavLink to="/subnet-calculator" className={({ isActive }) => isActive ? 'active' : ''} onClick={closeMenu}>
              Sous-réseau IPv4
            </NavLink>
            <NavLink to="/cidr-calculator" className={({ isActive }) => isActive ? 'active' : ''} onClick={closeMenu}>
              Notation CIDR
            </NavLink>
            <NavLink to="/ipv6-calculator" className={({ isActive }) => isActive ? 'active' : ''} onClick={closeMenu}>
              Calculateur IPv6
            </NavLink>
            <NavLink to="/vlsm-calculator" className={({ isActive }) => isActive ? 'active' : ''} onClick={closeMenu}>
              Tableaux VLSM
            </NavLink>
          </div>

          <div className="nav-group">
            <span className="nav-group-title">Outils Réseau</span>
            <NavLink to="/ip-geolocation" className={({ isActive }) => isActive ? 'active' : ''} onClick={closeMenu}>
              Géolocalisation IP
            </NavLink>
            <NavLink to="/dns-lookup" className={({ isActive }) => isActive ? 'active' : ''} onClick={closeMenu}>
              Recherche DNS
            </NavLink>
            <NavLink to="/network-status" className={({ isActive }) => isActive ? 'active' : ''} onClick={closeMenu}>
              État du Réseau
            </NavLink>
          </div>

          <div className="nav-group">
            <span className="nav-group-title">Calculateurs Avancés</span>
            <NavLink to="/supernetting-calculator" className={({ isActive }) => isActive ? 'active' : ''} onClick={closeMenu}>
              Supernetting
            </NavLink>
            <NavLink to="/ip-range-calculator" className={({ isActive }) => isActive ? 'active' : ''} onClick={closeMenu}>
              Plages IP
            </NavLink>
            <NavLink to="/binary-converter" className={({ isActive }) => isActive ? 'active' : ''} onClick={closeMenu}>
              Convertisseur Binaire
            </NavLink>
            <NavLink to="/network-overlap-detector" className={({ isActive }) => isActive ? 'active' : ''} onClick={closeMenu}>
              Détecteur de Chevauchement
            </NavLink>
          </div>

          <div className="nav-group">
            <span className="nav-group-title">Outils Éducatifs</span>
            <NavLink to="/subnetting-quiz" className={({ isActive }) => isActive ? 'active' : ''} onClick={closeMenu}>
              Quiz Sous-réseautage
            </NavLink>
          </div>

          <div className="nav-group">
            <span className="nav-group-title">Outils Pratiques</span>
            <NavLink to="/bandwidth-calculator" className={({ isActive }) => isActive ? 'active' : ''} onClick={closeMenu}>
              Calculateur de Bande Passante
            </NavLink>
          </div>
        </div>
      </div>

      <CalculationHistory 
        isOpen={showHistory}
        onClose={() => setShowHistory(false)}
        onLoadCalculation={handleLoadCalculation}
      />
    </nav>
  );
}

export default Navbar;
