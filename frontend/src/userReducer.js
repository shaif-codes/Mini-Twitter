const userReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return {
        followers: [], 
        following: [],
        ...action.payload, 
      };
    case 'LOGOUT':
      return {
        followers: [],
        following: [],
      };
    case 'SET_FOLLOWERS':
      return {
        ...state,
        followers: action.payload
      };
    case 'SET_FOLLOWING':
      return {
        ...state,
        following: action.payload
      };
    case 'UPDATE_PROFILE_PICTURE':
      return {
        ...state,
        profilePictureUrl: action.payload
      };
    case 'UPDATE_BANNER_PICTURE':
      return {
        ...state,
        bannerPictureUrl: action.payload
      };
    case 'UPDATE_USER_DETAILS':
      return {
        ...state,
        ...action.payload
      };
    default:
      return state;
  }
};

export default userReducer; 