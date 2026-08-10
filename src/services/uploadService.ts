import axios from 'axios';

export const uploadService = axios.create({
  headers: {
    'Content-Type': 'application/octet-stream',
  },
});
