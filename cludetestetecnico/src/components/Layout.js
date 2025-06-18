import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { logout } from '../services/authService';
import './Layout.css';

const Layout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="layout">
      <header className="header">
        <nav className="nav-container">
          <Link to="/index" className="logo">
            Sistema de Agendamento
          </Link>
          <div className="nav-links">
            <Link to="/pacientes" className={`nav-link ${isActive('/pacientes')}`}>
              Pacientes
            </Link>
            <Link to="/profissionais" className={`nav-link ${isActive('/profissionais')}`}>
              Profissionais de Saúde
            </Link>
            <Link to="/agendamentos" className={`nav-link ${isActive('/agendamentos')}`}>
              Agendamento de Consultas
            </Link>
            <button onClick={handleLogout} className="logout-button">
              Sair
            </button>
          </div>
        </nav>
      </header>

      <main className="main-content">
        {children}
      </main>

      <footer className="footer">
        <p>Desenvolvido por Victor Gabriel para entrevista técnica</p>
      </footer>
    </div>
  );
};

export default Layout; 