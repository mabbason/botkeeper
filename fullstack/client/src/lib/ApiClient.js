import axios from "axios";
import { io } from 'socket.io-client';


function logError(errorResponse) {
  const response = errorResponse.response;

  if (response && response.data && response.data.error) {
    console.error(`HTTP Error: ${response.data.error}`);
  } else {
    console.error("Error: ", errorResponse);
  }
}

axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";
axios.defaults.headers.common["Accept"] = "application/json";

const BASE_URL = "http://localhost:5001/"

const apiClient = {
  getAllBots: async () => {
    const URL = BASE_URL + 'bots'
    try {
      const { data } = await axios.get(URL);
      return data;
    } catch (e) {
      logError(e);
    }
  },
  createNewBot: async (name) => {
    const URL = BASE_URL + 'bots'
    try {
      const { data } = await axios.post(URL, { name });
      return data;
    } catch (e) {
      logError(e);
    }
  }, 
  deleteBot: async (bot) => {
    const URL = BASE_URL + 'bots'
    try {
      const { data } = await axios.delete(URL, { data: bot })
      return data;
    } catch (e) {
      logError(e);
    }
  },
  getAllTasks: async () => {
    const URL = BASE_URL + 'tasks'
    try {
      const { data } = await axios.get(URL);
      return data;
    } catch (e) {
      logError(e);
    }
  },
  runTaskQueue: async (handleEventStream) => {
    const socket = await io.connect('http://localhost:5002');
    handleEventStream(socket);
  },
};

export default apiClient;
