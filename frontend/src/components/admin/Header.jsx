import React from 'react';
import { FaUserCircle } from 'react-icons/fa';

const Header = ({ title }) => {
  return (
    <div className="header">
      <h1>{title}</h1>
      <div className="user-profile">
        <FaUserCircle />
        Administrador
      </div>
    </div>
  );
};

export default Header;