import api from './api';

export const getProfissionais = async () => {
  try {
    const response = await api.get('/get-todos-profissionais-saude');
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar profissionais:', error);
    throw error;
  }
};

export const deleteProfissional = async (id) => {
  try {
    await api.delete(`/delete-profissional-saude/${id}`);
    return true;
  } catch (error) {
    console.error('Erro ao excluir profissional:', error);
    throw error;
  }
}; 