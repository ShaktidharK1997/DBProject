// Footer.js
import React from 'react';
import './footer.css'; // Make sure to create this CSS file

const Footer = () => {
  return (
    <footer>
      <p>© {new Date().getFullYear()} Power Track. All rights reserved.</p>
    </footer>
  );
};

export default Footer;