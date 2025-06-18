import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import AddPatientModal from '../components/AddPatientModal';
import { getPacientes, deletePaciente } from '../services/pacienteService';
import './PacientesPage.css';

const PacientesPage = () => {
  const [pacientes, setPacientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPatientId, setEditingPatientId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [pacienteToDelete, setPacienteToDelete] = useState(null);

  useEffect(() => {
    loadPacientes();
  }, []);

  const loadPacientes = async () => {
    try {
      const data = await getPacientes();
      // Garante que data seja sempre um array
      setPacientes(Array.isArray(data) ? data : []);
      setError('');
    } catch (err) {
      setError('Erro ao carregar pacientes');
      setPacientes([]); // Reseta para array vazio em caso de erro
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  const handleEdit = (id) => {
    setEditingPatientId(id);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    const paciente = pacientes.find(p => p.id === id);
    setPacienteToDelete(paciente);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      const success = await deletePaciente(pacienteToDelete.id);
      if (success) {
        setSuccessMessage('Paciente excluído com sucesso!');
        setTimeout(() => {
          setSuccessMessage('');
        }, 3000);
        loadPacientes();
      }
    } catch (err) {
      setError('Erro ao excluir paciente');
    } finally {
      setIsDeleteModalOpen(false);
      setPacienteToDelete(null);
    }
  };

  const cancelDelete = () => {
    setIsDeleteModalOpen(false);
    setPacienteToDelete(null);
  };

  const handleAddSuccess = () => {
    setSuccessMessage(editingPatientId ? 'Paciente atualizado com sucesso!' : 'Paciente cadastrado com sucesso!');
    setTimeout(() => {
      setSuccessMessage('');
    }, 3000);
    loadPacientes();
    setEditingPatientId(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingPatientId(null);
  };

  // Cálculos para paginação
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = pacientes.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(pacientes.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  if (loading) {
    return (
      <Layout>
        <div className="pacientes-container">
          <div className="loading">Carregando pacientes...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="pacientes-container">
        <div className="pacientes-header">
          <h2>Lista de Pacientes</h2>
          <button className="add-button" onClick={() => setIsModalOpen(true)}>
            Adicionar Paciente
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}
        {successMessage && <div className="success-message">{successMessage}</div>}

        <div className="pacientes-table-container">
          {pacientes.length === 0 ? (
            <div className="no-data-message">Nenhum paciente cadastrado</div>
          ) : (
            <>
              <table className="pacientes-table">
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>CPF</th>
                    <th>Data de Nascimento</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((paciente) => (
                    <tr key={paciente.id}>
                      <td>{paciente.name}</td>
                      <td>{paciente.cpf}</td>
                      <td>{formatDate(paciente.birthDate)}</td>
                      <td className="actions">
                        <button
                          className="action-button edit"
                          onClick={() => handleEdit(paciente.id)}
                          title="Editar"
                        >
                          ✏️
                        </button>
                        <button
                          className="action-button delete"
                          onClick={() => handleDelete(paciente.id)}
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

        <AddPatientModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSuccess={handleAddSuccess}
          editingPatientId={editingPatientId}
        />

        {/* Modal de Confirmação de Exclusão */}
        {isDeleteModalOpen && (
          <div className="modal-overlay">
            <div className="modal-content" style={{ maxWidth: 400 }}>
              <h3>Confirmar Exclusão</h3>
              <p>
                Todas as consultas relacionadas à esse paciente serão removidos permanentemente, deseja continuar?
              </p>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                <button 
                  className="add-button" 
                  onClick={cancelDelete}
                  style={{ backgroundColor: '#6c757d' }}
                >
                  Cancelar
                </button>
                <button 
                  className="add-button" 
                  onClick={confirmDelete}
                  style={{ backgroundColor: '#dc3545' }}
                >
                  Confirmar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default PacientesPage; 