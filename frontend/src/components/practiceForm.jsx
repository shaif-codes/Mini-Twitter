// import axios from 'axios';
// import React, { useState, useEffect } from 'react';
// import styled from 'styled-components';
// import cookie from 'js-cookie';

// const Container = styled.div`
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   height: 100vh;
//   width: 100vw;
//   background-color: blueviolet;

// `;

// const Form = styled.form`
//   background: white;
//   padding: 2rem;
//   border-radius: 10px;
//   width: 30%;
//   height: 50%;
//   box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
// `;

// const FormGroup = styled.div`
//   margin-bottom: 1rem;
// `;

// const Label = styled.label`
//   display: block;
//   margin-bottom: 0.5rem;
//   font-weight: bold;
// `;

// const Input = styled.input`
//   width: 100%;
//   padding: 0.5rem;
//   border: 1px solid #ccc;
//   border-radius: 5px;
//   &:focus {
//     outline: none;
//     border-color: #007bff;
//   }
// `;

// const Button = styled.button`
//   width: 100%;
//   padding: 0.75rem;
//   background-color: #007bff;
//   color: white;
//   border: none;
//   border-radius: 5px;
//   font-size: 1rem;
//   cursor: pointer;
//   &:hover {
//     background-color: #0056b3;
//   }
// `;

// const practiceForm = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');

//   useEffect(()=>{
//     const interval = setTimeout(async ()=>{
//       console.log(email);
//       const response = await axios.post('/api/debounce/email', {email: email});
//       if(response.data?.email){
//         console.log("email already registered");
//       }else{
//         console.log('No email found');
//       }
    
//     }, 500);
//     return () => clearTimeout(interval);
//   }, [email])

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     console.log('Email:', email);
//     console.log('Password:', password);
//   };

//   return (
//     <Container>
//       <Form onSubmit={handleSubmit}>
//         <FormGroup>
//           <Label htmlFor="email">Email</Label>
//           <Input
//             type="email"
//             id="email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             placeholer="Enter your email"
//             required
//           />
//         </FormGroup>
//         <FormGroup>
//           <Label htmlFor="password">Password</Label>
//           <Input
//             type="password"
//             id="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             placeholer="Enter your password"
//             required
//           />
//         </FormGroup>
//         <Button type="submit">Sign In</Button>
//       </Form>
//     </Container>
//   );
// };

// export default practiceForm;
// SignIn.js
import React, { useState } from 'react';
import Cookies from 'js-cookie';

const practiceForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignIn = (e) => {
    e.preventDefault();
    // Perform sign-in logic here
    // On successful sign-in, set a cookie
    Cookies.set('userEmail', email, { expires: 7 }); // expires in 7 days
    alert('Sign in successful and cookie set');
  };

  return (
    <form onSubmit={handleSignIn}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      <button type="submit">Sign In</button>
    </form>
  );
};

export default practiceForm;
