import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import './IndexPage.css';

const IndexPage = () => {
  return (
    <Layout>
      <div className="index-container">
        <div className="welcome-section">
          <h1>Sistema de Agendamento</h1>
          <p className="subtitle">Gerencie seus pacientes, profissionais e agendamentos de forma eficiente</p>
        </div>

        <div className="features-grid">
          <Link to="/pacientes" className="feature-card">
            <h3>Pacientes</h3>
            <p>Gerencie o cadastro e histórico dos seus pacientes</p>
          </Link>
          <Link to="/profissionais" className="feature-card">
            <h3>Profissionais de Saúde</h3>
            <p>Controle a agenda e especialidades dos profissionais</p>
          </Link>
          <Link to="/agendamentos" className="feature-card">
            <h3>Agendamentos</h3>
            <p>Organize consultas e procedimentos de forma simples</p>
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default IndexPage;
