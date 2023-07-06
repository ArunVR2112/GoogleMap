import React, { useState } from 'react';
import MapDisplay from './MapDisplay';

import { useNavigate } from 'react-router-dom';

const AuthenticationPage = () => {
  const [mobileNumber, setMobileNumber] = useState('');
  const [otp, setOtp] = useState('');
  const navigate = useNavigate();

  const handleLogin = () => {
    if (otp === '123456') {
      navigate('/map');
    } else {
      alert('Invalid OTP or Number');
    }
  };

  return (
    <div style={styles.container}>
      <h2>Login Page</h2>
      <input
        type="text"
        placeholder="Mobile Number"
        value={mobileNumber}
        onChange={(e) => setMobileNumber(e.target.value)}
        style={styles.input}
      />
      <br />
      <input
        type="password"
        placeholder="OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        style={styles.input}
      />
      <br />
      <button onClick={handleLogin} style={styles.button}>
        Login
      </button>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    fontFamily: 'Arial, sans-serif',
  },
  input: {
    margin: '10px 0',
    padding: '7.5px',
    fontSize: '16px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    width: '200px',
  },
  button: {
    padding: '10px',
    fontSize: '16px',
    borderRadius: '5px',
    border: 'none',
    backgroundColor: '#4caf50',
    color: 'white',
    cursor: 'pointer',
    width: '100px',
  },
};

export default AuthenticationPage;
