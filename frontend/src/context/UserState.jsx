import React, { useState } from 'react';
import UserContext from './userContext';

const UserState = ({ children }) => {
  const [state, setState] = useState({});
  const [tweetState, setTweetState] = useState({});

  return (
    <UserContext.Provider value={{ state, setState, tweetState, setTweetState }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserState;
