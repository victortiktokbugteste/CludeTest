import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { isAuthenticated } from './services/authService';
import LoginPage from './pages/LoginPage';
import IndexPage from './pages/IndexPage';
import PacientesPage from './pages/PacientesPage';
import ProfissionaisPage from './pages/ProfissionaisPage';
import Layout from './components/Layout';

const PrivateRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/" />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route
          path="/index"
          element={
            <PrivateRoute>
              <IndexPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/pacientes"
          element={
            <PrivateRoute>
              <PacientesPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/profissionais"
          element={
            <PrivateRoute>
              <ProfissionaisPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/agendamentos"
          element={
            <PrivateRoute>
              <Layout>
                <div className="main-content">
                  <h2>Agendamento de Consultas</h2>
                  {/* Conteúdo da página de agendamentos será adicionado aqui */}
                </div>
              </Layout>
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
