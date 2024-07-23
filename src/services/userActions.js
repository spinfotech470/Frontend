import axios from 'axios';
const config = require('../utils/config');
// const config.baseUrl =  process.env.BASE_URL || 'http://localhost:5000'

const userActionService = {

  getUserInfo: async (userId) => {
    try {
      const response = await axios.post(`${config.baseUrl}/users/userInfo`, ({userId:userId}));
      return response.data;
    } catch (error) {
      console.error("Error fetching User Info:", error);
      throw error;
    }
  },

  editProfile: async (formData) => { 
    const response = await axios.post(`${config.baseUrl}/editProfile`, formData);
    console.log("response Data ",response)
    return response.data
  },

  followUnfollow: async (currentUser1, userId1 ) => { 
    console.log(currentUser1, userId1)
    const currentUser = currentUser1._id;
    const userId = userId1 && (userId1.createdByDetails) && (userId1.createdByDetails)._id ;
    const response = await axios.post(`${config.baseUrl}/users/follow`, {
        currentUser:currentUser,
        userId:userId

    });
    console.log("response Data ", response.data);
    return response.data
  },

  getAllUser: async (userId) => {
    try {
      const response = await axios.post(`${config.baseUrl}/userList`);
      return response.data;
    } catch (error) {
      console.error("Error fetching User Info:", error);
      throw error;
    }
  },

};

export default userActionService;
