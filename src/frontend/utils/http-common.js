import axios from "axios";
import { serverHost } from '@/frontend/utils/helpers'

export default axios.create({
  baseURL: serverHost + '/api',
  headers: {
    "Content-type": "application/json"
  }
});