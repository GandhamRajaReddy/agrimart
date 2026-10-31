import axiosClient from '../../../services/http/axiosClient';

export const detectPlantDisease = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await axiosClient.post('/ml/disease/predict/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    timeout: 60000,
  });
  return response.data;
};
