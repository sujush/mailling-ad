import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import RecipientsPage from './pages/RecipientsPage';
import ListsPage from './pages/ListsPage';
import TemplatesPage from './pages/TemplatesPage';

const navStyles = {
  nav: {
    background: '#212529',
    padding: '0 24px',
    display: 'flex',
    alignItems: 'center',
    gap: '0',
    height: '52px',
  },
  brand: {
    color: '#fff',
    fontWeight: '700',
    fontSize: '16px',
    marginRight: '28px',
    textDecoration: 'none',
    letterSpacing: '-0.3px',
  },
  link: {
    color: '#adb5bd',
    textDecoration: 'none',
    padding: '16px 14px',
    fontSize: '14px',
    fontWeight: '500',
    borderBottom: '3px solid transparent',
    display: 'inline-block',
    transition: 'color 0.15s',
  },
  linkActive: {
    color: '#fff',
    borderBottom: '3px solid #0d6efd',
  },
};

function NavLink({ to, children }) {
  const location = useLocation();
  const isActive = location.pathname === to || (to === '/' && location.pathname === '/');
  return (
    <Link to={to} style={{ ...navStyles.link, ...(isActive ? navStyles.linkActive : {}) }}>
      {children}
    </Link>
  );
}

function Layout() {
  return (
    <>
      <nav style={navStyles.nav}>
        <Link to="/" style={navStyles.brand}>
          Mailing Ad MVP
        </Link>
        <NavLink to="/">수신자 관리</NavLink>
        <NavLink to="/lists">리스트 관리</NavLink>
        <NavLink to="/templates">템플릿 관리</NavLink>
      </nav>
      <main style={{ minHeight: 'calc(100vh - 52px)', background: '#f8f9fa' }}>
        <Routes>
          <Route path="/" element={<RecipientsPage />} />
          <Route path="/lists" element={<ListsPage />} />
          <Route path="/templates" element={<TemplatesPage />} />
        </Routes>
      </main>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}
