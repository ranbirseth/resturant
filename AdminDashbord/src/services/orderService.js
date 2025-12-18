import api from '../utils/api';

export const getOrders = async () => {
    const response = await api.get('/orders');
    return response.data;
};

export const updateOrderStatus = async (id, statusData) => {
    const response = await api.put(`/orders/${id}/status`, statusData);
    return response.data;
};
