// biteshipClient.ts
import axios from 'axios';

// Set up the Biteship API configuration
const BITESHIP_API_URL = 'https://api.biteship.com/v1'; // Biteship API base URL
const BITESHIP_API_KEY = process.env.API_BITESHIP_TEST; // Your Biteship API key, stored in environment variables

export const biteshipClient = axios.create({
  baseURL: BITESHIP_API_URL,
  headers: {
    Authorization: `Bearer ${BITESHIP_API_KEY}`,
    'Content-Type': 'application/json',
  },
});
