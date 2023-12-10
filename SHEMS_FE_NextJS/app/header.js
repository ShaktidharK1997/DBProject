import React from 'react';
import './header.css';
import logo from './logo.svg'; // Replace with the path to your logo image

const Header = () => {
  return (
    <header>
      <img src={logo} />
      <h1>Power Track</h1>
    </header>
  );
};

export default Header;