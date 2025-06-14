export const getError = (error) => {
  return error.response && error.response.data.message
    ? error.response.data.message
    : error.message;
};
        
// export const API = "https://jpz-stutz.onrender.com";
export const API = "http://127.0.0.101:4000";
