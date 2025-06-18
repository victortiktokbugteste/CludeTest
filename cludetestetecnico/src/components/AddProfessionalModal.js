import React, { useState, useEffect } from 'react';
import './AddProfessionalModal.css';

const AddProfessionalModal = ({ isOpen, onClose, onSuccess, editingProfessionalId }) => {
  const [formData, setFormData] = useState({
    id: null,
    name: '',
    cpf: '',
    crm: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (editingProfessionalId) {
      loadProfessionalData(editingProfessionalId);
    }
  }, [editingProfessionalId]);

  const loadProfessionalData = async (id) => {
    try {
      const response = await fetch(`https://localhost:7068/get-profissional-saude/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Erro ao carregar dados do profissional');
      }

      const data = await response.json();
      setFormData({
        id: data.id,
        name: data.name,
        cpf: data.cpf,
        crm: data.crm
      });
    } catch (err) {
      setError('Erro ao carregar dados do profissional');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const url = editingProfessionalId 
        ? 'https://localhost:7068/atualizar-profissional-saude'
        : 'https://localhost:7068/salvar-profissional-saude';

      const response = await fetch(url, {
        method: editingProfessionalId ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Erro ao salvar profissional');
      }

      const data = await response.json();
      onSuccess(data);
      handleClose();
    } catch (err) {
      setError('Erro ao salvar profissional. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      id: null,
      name: '',
      cpf: '',
      crm: ''
    });
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{editingProfessionalId ? 'Atualizar Profissional' : 'Adicionar Profissional'}</h2>
          <button className="close-button" onClick={handleClose}>×</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Nome</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="cpf">CPF</label>
            <input
              type="text"
              id="cpf"
              name="cpf"
              value={formData.cpf}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="crm">CRM</label>
            <input
              type="text"
              id="crm"
              name="crm"
              value={formData.crm}
              onChange={handleChange}
              required
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="modal-footer">
            <button type="button" className="cancel-button" onClick={handleClose}>
              Fechar
            </button>
            <button type="submit" className="save-button" disabled={loading}>
              {loading ? 'Salvando...' : (editingProfessionalId ? 'Atualizar' : 'Salvar')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProfessionalModal; 