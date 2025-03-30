import { useState } from 'react';
import UserContext from './userContext';
import PropTypes from 'prop-types';

const UserState = ({ children }) => {
  const [state, setState] = useState({});
  const [tweetState, setTweetState] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);

  return (
    <UserContext.Provider value={{
      state, setState,
      tweetState, setTweetState,
      followers, setFollowers,
      following, setFollowing
    }}>
      {children}
    </UserContext.Provider>
  );
};

UserState.propTypes = {
  children: PropTypes.node.isRequired,
};

export default UserState;
