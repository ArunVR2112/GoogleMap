import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AuthenticationPage from './components/Authentication';
import MapDisplay from './components/MapDisplay';
import { GoogleApiWrapper } from 'react-google-maps-loader';

const App = () => {
  
    // const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AuthenticationPage />} />
        <Route path="/map"   element={<MapDisplay />} />
      </Routes>
    </Router>

  );
};

export default App;
