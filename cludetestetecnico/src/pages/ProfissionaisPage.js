import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import AddProfessionalModal from '../components/AddProfessionalModal';
import { getProfissionais, deleteProfissional } from '../services/profissionalService';
import './ProfissionaisPage.css';

const ProfissionaisPage = () => {
  const [profissionais, setProfissionais] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProfessionalId, setEditingProfessionalId] = useState(null);

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
    try {
      const success = await deleteProfissional(id);
      if (success) {
        setSuccessMessage('Profissional excluído com sucesso!');
        // Remove a mensagem após 3 segundos
        setTimeout(() => {
          setSuccessMessage('');
        }, 3000);
        // Recarrega a lista
        loadProfissionais();
      }
    } catch (err) {
      setError('Erro ao excluir profissional');
    }
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
                {profissionais.map((profissional) => (
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
          )}
        </div>

        <AddProfessionalModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSuccess={handleAddSuccess}
          editingProfessionalId={editingProfessionalId}
        />
      </div>
    </Layout>
  );
};

export default ProfissionaisPage; 