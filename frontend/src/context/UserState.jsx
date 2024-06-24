import React, { useState } from 'react';
import UserContext from './userContext';

const UserState = ({ children }) => {
  const [state, setState] = useState({});

  return (
    <UserContext.Provider value={{ state, setState }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserState;
