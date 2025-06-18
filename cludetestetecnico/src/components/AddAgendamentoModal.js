import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AddAgendamentoModal.css';

const API_URL = "https://localhost:7068";

// Função utilitária para formatar data para o input datetime-local sem segundos
function formatDateTimeLocal(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  // Ajuste para fuso horário local
  const off = date.getTimezoneOffset();
  const local = new Date(date.getTime() - off * 60 * 1000);
  return local.toISOString().slice(0, 16); // YYYY-MM-DDTHH:mm
}

const AddAgendamentoModal = ({ isOpen, onClose, onSuccess, editId = null, pacientes = [], profissionais = [] }) => {
  const [formData, setFormData] = useState({
    id: null,
    pacienteId: '',
    profissionalSaudeId: '',
    scheduleDate: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (editId) {
        setIsEditMode(true);
        loadAgendamento(editId);
      } else {
        setIsEditMode(false);
        setFormData({ id: null, pacienteId: '', profissionalSaudeId: '', scheduleDate: '' });
      }
    }
    // eslint-disable-next-line
  }, [isOpen, editId]);

  const loadAgendamento = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_URL}/get-agendamento/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setFormData({
        id: response.data.id,
        pacienteId: response.data.pacienteId ? response.data.pacienteId.toString() : '',
        profissionalSaudeId: response.data.profissionalSaudeId ? response.data.profissionalSaudeId.toString() : '',
        scheduleDate: formatDateTimeLocal(response.data.scheduleDate)
      });
    } catch (err) {
      setError('Erro ao carregar agendamento');
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
      const token = localStorage.getItem("token");
      if (isEditMode) {
        const dataToSend = {
          id: formData.id,
          pacienteId: formData.pacienteId ? parseInt(formData.pacienteId) : null,
          profissionalSaudeId: formData.profissionalSaudeId ? parseInt(formData.profissionalSaudeId) : null,
          scheduleDate: formData.scheduleDate || null
        };
        const response = await axios.put(`${API_URL}/atualizar-agendamento`, dataToSend, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.status === 200 || response.status === 201) {
          onSuccess();
          handleClose();
        }
      } else {
        const dataToSend = {
          pacienteId: formData.pacienteId ? parseInt(formData.pacienteId) : null,
          profissionalSaudeId: formData.profissionalSaudeId ? parseInt(formData.profissionalSaudeId) : null,
          scheduleDate: formData.scheduleDate || null
        };
        const response = await axios.post(`${API_URL}/salvar-agendamento`, dataToSend, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.status === 200 || response.status === 201) {
          onSuccess();
          handleClose();
        }
      }
    } catch (err) {
      if (err.response?.data?.errors && Array.isArray(err.response.data.errors)) {
        const errorMessages = err.response.data.errors.map(err => err.message).join('\n');
        setError(errorMessages);
      } else {
        setError(err.response?.data?.message || 'Erro ao salvar agendamento');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({ id: null, pacienteId: '', profissionalSaudeId: '', scheduleDate: '' });
    setError('');
    setIsEditMode(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{isEditMode ? 'Editar Agendamento' : 'Novo Agendamento'}</h2>
          <button className="close-button" onClick={handleClose}>×</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="pacienteId">Paciente</label>
            <select
              id="pacienteId"
              name="pacienteId"
              value={formData.pacienteId}
              onChange={handleChange}
              disabled={isEditMode}
            >
              <option value="">Selecione um paciente</option>
              {pacientes.map(paciente => (
                <option key={paciente.id} value={paciente.id}>
                  {paciente.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="profissionalSaudeId">Profissional de Saúde</label>
            <select
              id="profissionalSaudeId"
              name="profissionalSaudeId"
              value={formData.profissionalSaudeId}
              onChange={handleChange}
              disabled={isEditMode}
            >
              <option value="">Selecione um profissional</option>
              {profissionais.map(profissional => (
                <option key={profissional.id} value={profissional.id}>
                  {profissional.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="scheduleDate">Data e Hora do Agendamento</label>
            <input
              type="datetime-local"
              id="scheduleDate"
              name="scheduleDate"
              value={formData.scheduleDate}
              onChange={e => setFormData(prev => ({ ...prev, scheduleDate: e.target.value }))}
            />
          </div>
          {error && <div className="error-message">{error}</div>}
          <div className="modal-footer">
            <button type="button" className="cancel-button" onClick={handleClose}>
              Fechar
            </button>
            <button type="submit" className="save-button" disabled={loading}>
              {loading ? 'Salvando...' : isEditMode ? 'Editar' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAgendamentoModal; 