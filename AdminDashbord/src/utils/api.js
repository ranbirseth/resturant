import axios from 'axios';

const api = axios.create({
    baseURL: 'https://resturant-vd5x.onrender.com/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

export default api;
