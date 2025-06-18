import React, { useState, useEffect } from 'react';
import './AddPatientModal.css';

const AddPatientModal = ({ isOpen, onClose, onSuccess, editingPatientId }) => {
  const [formData, setFormData] = useState({
    id: null,
    name: '',
    cpf: '',
    birthDate: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (editingPatientId) {
      loadPatientData(editingPatientId);
    }
  }, [editingPatientId]);

  const loadPatientData = async (id) => {
    try {
      const response = await fetch(`https://localhost:7068/get-paciente/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Erro ao carregar dados do paciente');
      }

      const data = await response.json();
      setFormData({
        id: data.id,
        name: data.name,
        cpf: data.cpf,
        birthDate: data.birthDate.split('T')[0] // Formata a data para o formato do input date
      });
    } catch (err) {
      setError('Erro ao carregar dados do paciente');
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
      const url = editingPatientId 
        ? 'https://localhost:7068/atualizar-paciente'
        : 'https://localhost:7068/salvar-paciente';

      const response = await fetch(url, {
        method: editingPatientId ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Erro ao salvar paciente');
      }

      const data = await response.json();
      onSuccess(data);
      handleClose();
    } catch (err) {
      setError('Erro ao salvar paciente. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      id: null,
      name: '',
      cpf: '',
      birthDate: ''
    });
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{editingPatientId ? 'Atualizar Paciente' : 'Adicionar Paciente'}</h2>
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
            <label htmlFor="birthDate">Data de Nascimento</label>
            <input
              type="date"
              id="birthDate"
              name="birthDate"
              value={formData.birthDate}
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
              {loading ? 'Salvando...' : (editingPatientId ? 'Atualizar' : 'Salvar')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPatientModal; 