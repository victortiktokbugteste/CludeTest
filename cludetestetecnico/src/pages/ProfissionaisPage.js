import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import AddProfessionalModal from '../components/AddProfessionalModal';
import { getProfissionais, deleteProfissional } from '../services/profissionalService';
import AgendaProfissionalModal from '../components/AgendaProfissionalModal';
import './ProfissionaisPage.css';

const ProfissionaisPage = () => {
  const [profissionais, setProfissionais] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProfessionalId, setEditingProfessionalId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [isAgendaModalOpen, setIsAgendaModalOpen] = useState(false);
  const [agendaProfissionalId, setAgendaProfissionalId] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [profissionalToDelete, setProfissionalToDelete] = useState(null);

  useEffect(() => {
    loadProfissionais();
  }, []);

  const loadProfissionais = async () => {
    try {
      const data = await getProfissionais();
      // Garante que data seja sempre um array
      setProfissionais(Array.isArray(data) ? data : []);
      setError('');
    } catch (err) {
      setError('Erro ao carregar profissionais');
      setProfissionais([]); // Reseta para array vazio em caso de erro
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (id) => {
    setEditingProfessionalId(id);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    const profissional = profissionais.find(p => p.id === id);
    setProfissionalToDelete(profissional);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      const success = await deleteProfissional(profissionalToDelete.id);
      if (success) {
        setSuccessMessage('Profissional excluído com sucesso!');
        setTimeout(() => {
          setSuccessMessage('');
        }, 3000);
        loadProfissionais();
      }
    } catch (err) {
      setError('Erro ao excluir profissional');
    } finally {
      setIsDeleteModalOpen(false);
      setProfissionalToDelete(null);
    }
  };

  const cancelDelete = () => {
    setIsDeleteModalOpen(false);
    setProfissionalToDelete(null);
  };

  const handleAddSuccess = () => {
    setSuccessMessage(editingProfessionalId ? 'Profissional atualizado com sucesso!' : 'Profissional cadastrado com sucesso!');
    setTimeout(() => {
      setSuccessMessage('');
    }, 3000);
    loadProfissionais();
    setEditingProfessionalId(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProfessionalId(null);
  };

  const handleOpenAgendaModal = (id) => {
    setAgendaProfissionalId(id);
    setIsAgendaModalOpen(true);
  };

  const handleCloseAgendaModal = () => {
    setIsAgendaModalOpen(false);
    setAgendaProfissionalId(null);
  };

  // Cálculos para paginação
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = profissionais.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(profissionais.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  if (loading) {
    return (
      <Layout>
        <div className="profissionais-container">
          <div className="loading">Carregando profissionais...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="profissionais-container">
        <div className="profissionais-header">
          <h2>Lista de Profissionais de Saúde</h2>
          <button className="add-button" onClick={() => setIsModalOpen(true)}>
            Adicionar Profissional
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}
        {successMessage && <div className="success-message">{successMessage}</div>}

        <div className="profissionais-table-container">
          {profissionais.length === 0 ? (
            <div className="no-data-message">Nenhum profissional cadastrado</div>
          ) : (
            <>
              <table className="profissionais-table">
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>CPF</th>
                    <th>CRM</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((profissional) => (
                    <tr key={profissional.id}>
                      <td>{profissional.name}</td>
                      <td>{profissional.cpf}</td>
                      <td>{profissional.crm}</td>
                      <td className="actions">
                        <button
                          className="action-button edit"
                          onClick={() => handleEdit(profissional.id)}
                          title="Editar"
                        >
                          ✏️
                        </button>
                        <button
                          className="action-button"
                          onClick={() => handleOpenAgendaModal(profissional.id)}
                          title="Ver agendamentos"
                          style={{ color: '#673ab7' }}
                        >
                          📋
                        </button>
                        <button
                          className="action-button delete"
                          onClick={() => handleDelete(profissional.id)}
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

        <AddProfessionalModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSuccess={handleAddSuccess}
          editingProfessionalId={editingProfessionalId}
        />

        <AgendaProfissionalModal
          isOpen={isAgendaModalOpen}
          onClose={handleCloseAgendaModal}
          profissionalId={agendaProfissionalId}
        />

        {/* Modal de Confirmação de Exclusão */}
        {isDeleteModalOpen && (
          <div className="modal-overlay">
            <div className="modal-content" style={{ maxWidth: 400 }}>
              <h3>Confirmar Exclusão</h3>
              <p>
                Todas as consultas relacionadas à esse profissional serão removidos permanentemente, deseja continuar?
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

export default ProfissionaisPage; 