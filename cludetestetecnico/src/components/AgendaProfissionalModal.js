import React, { useEffect, useState } from 'react';
import './AddAgendamentoModal.css';

const API_URL = 'http://localhost:5000';

const AgendaProfissionalModal = ({ isOpen, onClose, profissionalId }) => {
  const [agendamentos, setAgendamentos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen && profissionalId) {
      fetchAgenda();
    } else {
      setAgendamentos([]);
      setError('');
    }
    // eslint-disable-next-line
  }, [isOpen, profissionalId]);

  const fetchAgenda = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/get-agenda-profissional-saude/${profissionalId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        // Verifica se há conteúdo na resposta antes de tentar fazer parse
        const text = await response.text();
        let errorMessage = 'Erro ao buscar agenda';
        
        if (text) {
          try {
            const data = JSON.parse(text);
            errorMessage = data.message || errorMessage;
          } catch (parseError) {
            // Se não conseguir fazer parse do JSON, usa o texto da resposta
            errorMessage = text || errorMessage;
          }
        }
        
        throw new Error(errorMessage);
      }
      
      // Verifica se há conteúdo na resposta antes de tentar fazer parse
      const text = await response.text();
      let data = [];
      
      if (text) {
        try {
          data = JSON.parse(text);
        } catch (parseError) {
          // Se não conseguir fazer parse do JSON, assume array vazio
          data = [];
        }
      }
      
      setAgendamentos(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: 600 }}>
        <h2>Agendamentos do Profissional</h2>
        {loading ? (
          <div>Carregando...</div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : agendamentos.length === 0 ? (
          <div className="no-data-message">Nenhum agendamento encontrado</div>
        ) : (
          <table className="agendamentos-table">
            <thead>
              <tr>
                <th>Nome do Paciente</th>
                <th>Data de Criação</th>
                <th>Data de Agendamento</th>
                <th>Duração (min)</th>
              </tr>
            </thead>
            <tbody>
              {agendamentos.map((ag) => (
                <tr key={ag.id}>
                  <td>{ag.paciente?.name || '-'}</td>
                  <td>{formatDateTime(ag.createDate)}</td>
                  <td>{formatDateTime(ag.scheduleDate)}</td>
                  <td>{ag.tempoDuracaoAtendimentoMinutos}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <div style={{ textAlign: 'right', marginTop: 20 }}>
          <button className="add-button" onClick={onClose}>Fechar</button>
        </div>
      </div>
    </div>
  );
};

export default AgendaProfissionalModal; 