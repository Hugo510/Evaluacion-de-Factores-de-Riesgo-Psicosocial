import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { ClipboardCheck, LogOut } from 'lucide-react';

export const Header: React.FC = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <header className="sticky top-0 z-50 bg-white/60 backdrop-blur-xl border-b border-gray-100/50">
      <div className="container mx-auto px-4 py-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 group">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-blue-500/[0.08] to-blue-600/[0.12] group-hover:from-blue-500/[0.12] group-hover:to-blue-600/[0.16] transition-all duration-300">
              <ClipboardCheck size={24} className="text-blue-500 group-hover:scale-110 transition-transform duration-300" strokeWidth={1.5} />
            </div>
            <h1 className="text-xl font-light text-gray-900 tracking-tight">NOM-035</h1>
          </div>
          
          <div className="flex items-center space-x-8">
            <nav>
              <ul className="flex space-x-12">
                {[
                  { href: "/", label: "Inicio" },
                  { href: "/questionnaire", label: "Evaluación" },
                  { href: "/reports", label: "Reportes", adminOnly: true }
                ].map((item, index) => (
                  (!item.adminOnly || user.role === 'ADMIN') && (
                    <li key={index}>
                      <a 
                        href={item.href} 
                        className="relative text-gray-600 hover:text-blue-500 transition-colors duration-300 text-sm group py-2"
                      >
                        <span>{item.label}</span>
                        <span className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-blue-500 to-blue-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                      </a>
                    </li>
                  )
                ))}
              </ul>
            </nav>

            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 text-gray-600 hover:text-blue-500 transition-colors duration-300"
            >
              <LogOut size={18} strokeWidth={1.5} />
              <span className="text-sm">Salir</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};