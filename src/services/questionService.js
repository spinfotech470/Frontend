import axios from 'axios';
const config = require('../utils/config');
// const config.baseUrl =  process.env.BASE_URL || 'http://localhost:5000'

const questionService = {

  getQuestions: async (createdBy) => {
    try {
      // console.log("created by ", createdBy);
      const response = await axios.get(`${config.baseUrl}/api/questions`, {
        params: { createdBy }
      });
      // console.log("response Data ", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching questions:", error);
      throw error;
    }
  },

  getAllQuestions: async () => {
    try {
      
      const response = await axios.get(`${config.baseUrl}/api`);
      return response.data;
    } catch (error) {
      console.error("Error fetching questions:", error);
      throw error;
    }
  },

  getAllQuestionsLookUp: async () => {
    try {
      
      const response = await axios.get(`${config.baseUrl}/api`);
    // console.log("created by ", response);
      return response.data;
    } catch (error) {
      console.error("Error fetching questions:", error);
      throw error;
    }
  },

  createQuestion: async (formData) => { 
    const response = await axios.post(`${config.baseUrl}/api/questions`, formData);
    console.log("response Data ",response)
    return response.data
  },

  likeQuestion: async (formData,user) => { 
    const postId =formData._id
    const createdBy = user._id  
    console.log("createdBy ",createdBy)
    const response = await axios.post(`${config.baseUrl}/api?postId=${postId}`, {
       createdBy:createdBy

    });
    console.log("response Data ", response.data);
    return response.data
  },

  commentPost: async (formData,user) => { 
    console.log("userrrrrrrrrrr",user)
    const postId =formData.postId;
    const createdBy = formData.content;
    console.log("createdBy ",createdBy)
    const response = await axios.post(`${config.baseUrl}/api/commentPost?postId=${postId}`, {
      content:createdBy,
      userId:formData.user._id

    });
    console.log("response Data ", response.data);
    return response.data
  },

  replyPost: async (formData,user) => { 
    console.log("/////////////////",formData.postId)
    const userId = (formData.user)._id;
    const postId =formData.postId;
    const content = formData.content;
    const commentId = formData.commentId;
    const response = await axios.post(`${config.baseUrl}/api/replyComment`, {
      content:content,
      userId: userId,
      commentId:commentId,
      postId: postId
      // userId:formData.user._id
    });
    console.log("response Data ", response.data);
    return response.data
  },

  likeComment: async (values,user, post) => { 
    // console.log("//service==values//",user)
    const userId = user._id;
    const postId = post._id;
    const commentId = values._id;
    console.log("//service==values//",userId,postId,commentId)

    const response = await axios.post(`${config.baseUrl}/api/likeComment`, {
      userId: userId,
      commentId:commentId,
      postId: postId
    });
    console.log("response Data ", response.data);
    return response.data
  },

  updateComment: async (values,user) => {
    console.log("service valuesss*********",values)
    const content = values.content;
    const postId = values.postId;
    const commentId = values.commentId;

    const response = await axios.post(`${config.baseUrl}/api/updateComment`, {
      content: content,
      commentId:commentId,
      postId: postId
    });
    console.log("response Data ", response.data);
    return response.data
  },

  deleteCommnet: async (values,user) => {
    console.log("service valuesss*********",values)
    const content = values.content;
    const postId = values.postId;
    const commentId = values.commentId;

    const response = await axios.post(`${config.baseUrl}/api/deleteCommnet`, {
      commentId:commentId,
      postId: postId
    });
    console.log("response Data ", response.data);
    return response.data
  },

  // notification: async (values) => {
  //   const userId = values._id;
  //   const response = await axios.get(`${config.baseUrl}/api/notification?userId=${userId}`, {
  //   });
  
  //   console.log("response Data ", response.data);
  //   return response.data;
  // },

  notification: async (values) => {
    const userId = values.userId;
    const response = await axios.get(`${config.baseUrl}/api/notification`, {
      params:{
        userId:userId
      }
      
    });
  
    console.log("response Data ", response.data);
    return response.data;
  },

  getCommentAllReply: async (values) => {
    try{
      const commentId = values.commentId;
      const postId = values._id;
      const response = await axios.get(`${config.baseUrl}/api/getCommentAllReply`, {
        commentId:commentId,
        postId: postId
      });
      return response.data;

    }catch(err){
      console.error(err)

    }
   
  }

};

export default questionService;
