export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL
  ? process.env.NEXT_PUBLIC_API_URL
  : process.env.NODE_ENV === 'development'
    ? 'http://localhost:5143'
    : 'https://cinema-api-vetv.onrender.com';

export const SIGNALR_HUB_URL = `${API_BASE_URL}/seatlockhub`;
