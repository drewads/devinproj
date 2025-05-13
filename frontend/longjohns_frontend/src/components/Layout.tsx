import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, User, Users, PlusCircle, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { isAuthenticated, logout } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-md h-screen fixed">
          <div className="p-6">
            <h1 className="text-2xl font-bold text-green-600">Lawn Johns</h1>
            <p className="text-gray-500 text-sm">Gardening Social Network</p>
          </div>
          <nav className="mt-6">
            <NavItem to="/" icon={<Home />} label="Feed" active={location.pathname === '/'} />
            <NavItem to="/profile" icon={<User />} label="Profile" active={location.pathname === '/profile'} />
            <NavItem to="/friends" icon={<Users />} label="Friends" active={location.pathname === '/friends'} />
            <NavItem to="/activity/new" icon={<PlusCircle />} label="New Activity" active={location.pathname === '/activity/new'} />
            <button
              onClick={logout}
              className="flex items-center w-full px-6 py-3 text-gray-500 hover:bg-gray-100 hover:text-green-600 transition-colors"
            >
              <LogOut className="mr-3" size={20} />
              <span>Logout</span>
            </button>
          </nav>
        </div>

        {/* Main content */}
        <div className="ml-64 flex-1">
          <main className="p-6">{children}</main>
        </div>
      </div>
    </div>
  );
}

interface NavItemProps {
  to: string;
  icon: ReactNode;
  label: string;
  active: boolean;
}

function NavItem({ to, icon, label, active }: NavItemProps) {
  return (
    <Link
      to={to}
      className={`flex items-center px-6 py-3 ${
        active ? 'bg-green-50 text-green-600' : 'text-gray-500 hover:bg-gray-100 hover:text-green-600'
      } transition-colors`}
    >
      <span className="mr-3">{icon}</span>
      <span>{label}</span>
    </Link>
  );
}
