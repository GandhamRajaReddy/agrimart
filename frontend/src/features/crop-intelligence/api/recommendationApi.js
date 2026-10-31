import axiosClient from "../../../services/http/axiosClient";

export const createCropPlan = async (payload) => {
  const response = await axiosClient.post("/market/crop-plan/", payload);
  return response.data;
};

export const getMarketIntelligenceStatus = async () => {
  const response = await axiosClient.get("/market/status/");
  return response.data;
};

export const recommendFertilizer = async (payload) => {
  const response = await axiosClient.post("/ml/fertilizer/recommend/", payload);
  return response.data;
};
