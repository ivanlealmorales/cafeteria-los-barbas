// =====================================================
// IMPORTAÇÃO DO AXIOS
// =====================================================

import axios from "axios";

// =====================================================
// INSTÂNCIA CENTRAL DA API
// =====================================================

export const api = axios.create({

  // Endereço do backend
  // Se não existir variável de ambiente,
  // utiliza o endereço local do projeto.

  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3001",

});