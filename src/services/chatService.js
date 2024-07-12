import axios from 'axios';
const {baseUrl} =require('../utils/config')

const chatService = {
    getChatData: async (user,otherUser,page) => {
        try {
          const response = await axios.get(`${baseUrl}/api/chat`, {
            params: {
                sender: user.username,
                receiver: otherUser.username,
                page,
                limit: 20,
              },
          });
          return response.data;
        } catch (error) {
          console.error("Error fetching questions:", error);
          throw error;
        }
      }

}

  export default chatService;