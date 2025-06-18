import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AddAgendamentoModal from '../components/AddAgendamentoModal';
import './Agendamentos.css';

const API_URL = "https://localhost:7068";

const Agendamentos = () => {
  const [agendamentos, setAgendamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    loadAgendamentos();
  }, []);

  const loadAgendamentos = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_URL}/get-todos-agendamentos`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setAgendamentos(response.data);
    } catch (err) {
      setError('Erro ao carregar agendamentos');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = () => {
    setEditId(null);
    setIsModalOpen(true);
  };

  const handleEdit = (id) => {
    setEditId(id);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditId(null);
  };

  const handleSuccess = () => {
    loadAgendamentos();
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) return <div>Carregando...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="agendamentos-container">
      <div className="header">
        <h1>Agendamentos</h1>
        <button className="add-button" onClick={handleOpenModal}>
          Novo Agendamento
        </button>
      </div>

      <div className="agendamentos-list">
        {agendamentos.map(agendamento => (
          <div key={agendamento.id} className="agendamento-card">
            <div className="agendamento-info">
              <h3>Paciente: {agendamento.paciente.name}</h3>
              <p>CPF: {agendamento.paciente.cpf}</p>
              <h3>Profissional: {agendamento.profissionalSaude.name}</h3>
              <p>CRM: {agendamento.profissionalSaude.crm}</p>
              <p>Data do Agendamento: {formatDate(agendamento.scheduleDate)}</p>
              <p>Duração: {agendamento.tempoDuracaoAtendimentoMinutos} minutos</p>
            </div>
            <div className="agendamento-actions">
              <button 
                className="action-button edit"
                onClick={() => handleEdit(agendamento.id)}
                title="Editar"
              >
                ✏️
              </button>
            </div>
          </div>
        ))}
      </div>

      <AddAgendamentoModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSuccess={handleSuccess}
        editId={editId}
      />
    </div>
  );
};

export default Agendamentos; 