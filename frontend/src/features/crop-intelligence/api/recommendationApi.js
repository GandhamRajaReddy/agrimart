import axiosClient from '../../../services/http/axiosClient';

export const recommendCrop = async (payload) => {
  const response = await axiosClient.post('/ml/crop/recommend/', payload);
  return response.data;
};

export const recommendFertilizer = async (payload) => {
  const response = await axiosClient.post('/ml/fertilizer/recommend/', payload);
  return response.data;
};
