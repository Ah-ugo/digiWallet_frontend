import axios from "axios";
import { useAuthStore } from "./store";

const api = axios.create({
  baseURL: "https://digiwallet2.onrender.com",
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const login = async (email, password) => {
  const formData = new URLSearchParams();
  formData.append("username", email);
  formData.append("password", password);

  const response = await api.post("/auth/login/", formData, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });
  return response.data;
};

export const register = async (data) => {
  const response = await api.post("/auth/register/", data);
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await api.get("/auth/users/me/");
  return response.data;
};

export const getBanks = async () => {
  const response = await api.get("/banking/banks/");
  return response.data;
};

export const initiateTransfer = async (
  amount,
  bankCode,
  accountNumber,
  narration
) => {
  const response = await api.post("/banking/monnify/transfer/", null, {
    params: {
      amount,
      destination_bank_code: bankCode,
      destination_account_number: accountNumber,
      narration,
    },
  });
  return response.data;
};

export const getTransactions = async (id) => {
  const response = await api.get(`/banking/transactions/${id}`);
  return response.data;
};

export const initiateDeposit = async (amount) => {
  const response = await api.post("/banking/monnify/deposit/", null, {
    params: { amount },
  });
  return response.data;
};
