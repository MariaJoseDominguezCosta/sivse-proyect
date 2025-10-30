// src/layouts/AdminLayout.jsx
import Header from '../components/common/Header';
import SectionBanner from '../components/common/SectionBanner';
import SidebarAdmin from '../components/admin/SidebarAdmin';

const AdminLayout = ({ children, title }) => {
  return (
    <div className="admin-layout">
      <Header userRole="admin" userName="Admin SIVSE" />
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