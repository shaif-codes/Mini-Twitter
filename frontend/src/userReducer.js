const userReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return action.payload;
    case 'LOGOUT':
      return {};
    case 'UPDATE_FOLLOWER':
      return {
        ...state,
        followers: action.payload
      };
    case 'UPDATE_FOLLOWING':
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
    default:
      return state;
  }
};

export default userReducer; 