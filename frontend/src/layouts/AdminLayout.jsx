// src/layouts/AdminLayout.jsx
// REMOVIDO: import Header from '../components/common/Header';
import SectionBanner from '../components/common/SectionBanner';
import SidebarAdmin from '../components/admin/SidebarAdmin';
import "../assets/adminLayout.css";

const AdminLayout = ({ children, title }) => {
  return (
    <div className="admin-layout">
      {/* REMOVIDO: <Header userRole="admin" userName="Admin SIVSE" /> */}
      <div className="admin-body">
        <SidebarAdmin />
        <main className="admin-content">
          <SectionBanner title={title} />
          <div className="page-padding">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
export default AdminLayout;