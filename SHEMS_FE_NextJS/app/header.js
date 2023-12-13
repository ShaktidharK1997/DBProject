import React from 'react';
import './header.css'; // Replace with the path to your logo image
import logo from './logo.jpg';
import Image from 'next/image'

const Header = () => {
  return (
    <header>
      <Image
      src={logo}
      width={50}
      height={50}
    />
      <h1>Power Track</h1>
    </header>
  );
};

export default Header;