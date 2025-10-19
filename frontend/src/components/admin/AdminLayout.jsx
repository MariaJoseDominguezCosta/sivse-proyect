import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

const AdminLayout = ({ title, children }) => {
  return (
    <div className="admin-layout">
      <Sidebar />
      <div className="main-content">
        <Header title={title} />
        {children}
      </div>
    </div>
  );
};

export default AdminLayout;