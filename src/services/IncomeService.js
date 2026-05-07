import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const IncomeServices ={
    // Contoh di IncomeService.js
    getAllData: async (page = 0, size = 5) => {
    const response = await axios.get(`${API_URL}?page=${page}&size=${size}`);
    return response.data; // Response ini sekarang berupa Object, bukan Array langsung
    },

    getDataById : async (id) => {
        const response = await axios.get(`${API_URL}/${id}`);
        return response.data;
    },

    getDataDashBoard : async () => {
        const response = await axios.get(`${API_URL}/dashboard`)
        return response.data;
    },

    getDataLaporan : async () => {
        const response = await axios.get(`${API_URL}/laporan`)
        return response.data;
    },

    getPriceMaterial : async (id) => {
        const response = await axios.get(`${API_URL}/price/${id}`);
        return response.data;
    },

    getVehicle : async () => {
        const response = await axios.get(`${API_URL}/vehicle`)
        return response.data;
    },

    createTransaction : async (income) => {
        const response = await axios.post(API_URL,income)
        return response.data;
    },

    updateTransaction : async (id,income) => {
        const response = await axios.put(`${API_URL}/${id}`,income)
        return response.data;
    },

    deleteTransaction : async (id) => {
        const response = await axios.delete(`${API_URL}/${id}`)
        return response.data;
    }
}