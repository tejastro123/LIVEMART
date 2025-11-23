// client/src/utils/setAuthToken.js
import axios from 'axios';

const setAuthToken = (token) => {
  if (token) {
    // This applies the token to EVERY request
    axios.defaults.headers.common['x-auth-token'] = token;
  } else {
    // This deletes the token from headers
    delete axios.defaults.headers.common['x-auth-token'];
  }
};

export default setAuthToken;