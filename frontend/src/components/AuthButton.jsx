import React from 'react';
import styled from 'styled-components';

const Button = styled.button`
  background-color: ${props => props.primary ? '#1DA1F2' : 'transparent'};
  color: ${props => props.primary ? '#fff' : '#1DA1F2'};
  border: ${props => props.primary ? 'none' : '1px solid #1DA1F2'};
  border-radius: 30px;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  margin: 10px 0;
  width: 100%;

  &:hover {
    opacity: 0.9;
  }
`;

const AuthButton = ({ primary, children, redirect }) => (

  <Button onClick={()=>window.location.href = redirect}primary={primary}>{children}</Button>
);

export default AuthButton;
