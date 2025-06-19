import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import AddAgendamentoModal from '../components/AddAgendamentoModal';
import { getAgendamentos, deleteAgendamento } from '../services/agendamentoService';
import axios from 'axios';
import './AgendamentosPage.css';

const API_URL = "https://cludetesteapi.azurewebsites.net";

const AgendamentosPage = () => {
  const [agendamentos, setAgendamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [pacientes, setPacientes] = useState([]);
  const [profissionais, setProfissionais] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    loadPacientesEProfissionais();
    loadAgendamentos();
  }, []);

  const loadPacientesEProfissionais = async () => {
    try {
      const token = localStorage.getItem("token");
      const [pacResp, profResp] = await Promise.all([
        axios.get(`${API_URL}/get-todos-pacientes`, { headers: { 'Authorization': `Bearer ${token}` } }),
        axios.get(`${API_URL}/get-todos-profissionais-saude`, { headers: { 'Authorization': `Bearer ${token}` } })
      ]);
      setPacientes(pacResp.data);
      setProfissionais(profResp.data);
    } catch (err) {
      setError('Erro ao carregar pacientes ou profissionais');
    }
  };

  const loadAgendamentos = async () => {
    try {
      const data = await getAgendamentos();
      setAgendamentos(Array.isArray(data) ? data : []);
      setError('');
    } catch (err) {
      setError('Erro ao carregar agendamentos');
      setAgendamentos([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleDelete = async (id) => {
    try {
      const success = await deleteAgendamento(id);
      if (success) {
        setSuccessMessage('Agendamento excluído com sucesso!');
        setTimeout(() => {
          setSuccessMessage('');
        }, 3000);
        loadAgendamentos();
      }
    } catch (err) {
      setError('Erro ao excluir agendamento');
    }
  };

  const handleAddSuccess = () => {
    if (editId) {
      setSuccessMessage('Agendamento alterado com sucesso!');
    } else {
      setSuccessMessage('Agendamento cadastrado com sucesso!');
    }
    setTimeout(() => {
      setSuccessMessage('');
    }, 3000);
    loadAgendamentos();
    setEditId(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditId(null);
  };

  const handleEdit = (id) => {
    setEditId(id);
    setIsModalOpen(true);
  };

  // Cálculos para paginação
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = agendamentos.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(agendamentos.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  if (loading) {
    return (
      <Layout>
        <div className="agendamentos-container">
          <div className="loading">Carregando agendamentos...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="agendamentos-container">
        <div className="agendamentos-header">
          <h2>Lista de Agendamentos</h2>
          <button className="add-button" onClick={() => setIsModalOpen(true)}>
            Adicionar Agendamento
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}
        {successMessage && <div className="success-message">{successMessage}</div>}

        <div className="agendamentos-table-container">
          {agendamentos.length === 0 ? (
            <div className="no-data-message">Nenhum agendamento encontrado</div>
          ) : (
            <>
              <table className="agendamentos-table">
                <thead>
                  <tr>
                    <th>Paciente</th>
                    <th>Profissional de Saúde</th>
                    <th>Duração da Consulta</th>
                    <th>Agendado para</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((agendamento) => (
                    <tr key={agendamento.id}>
                      <td>{agendamento.paciente.name}</td>
                      <td>{agendamento.profissionalSaude.name}</td>
                      <td>{agendamento.tempoDuracaoAtendimentoMinutos} minutos</td>
                      <td>{formatDateTime(agendamento.scheduleDate)}</td>
                      <td className="actions">
                        <button
                          className="action-button edit"
                          onClick={() => handleEdit(agendamento.id)}
                          title="Editar"
                        >
                          ✏️
                        </button>
                        <button
                          className="action-button delete"
                          onClick={() => handleDelete(agendamento.id)}
                          title="Excluir"
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="pagination">
                <button
                  className="pagination-button"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Anterior
                </button>
                <span className="pagination-info">
                  Página {currentPage} de {totalPages}
                </span>
                <button
                  className="pagination-button"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Próxima
                </button>
              </div>
            </>
          )}
        </div>

        <AddAgendamentoModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSuccess={handleAddSuccess}
          editId={editId}
          pacientes={pacientes}
          profissionais={profissionais}
        />
      </div>
    </Layout>
  );
};

export default AgendamentosPage; 