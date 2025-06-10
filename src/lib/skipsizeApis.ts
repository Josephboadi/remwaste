import apiClient from './axios';

// GET: Get Data
export const getSkipData = async () => {
  const data = await apiClient.get('');
  //   console.log(data);
  return data;
};
