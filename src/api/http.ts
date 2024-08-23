import axios from 'axios';

const http = axios.create({
  baseURL: 'https://www.strava.com/api/v3',
});

export default http;
