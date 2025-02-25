import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store";
import {
  Home,
  Send,
  PiggyBank,
  History,
  LogOut,
  User,
  Menu,
  X,
} from "lucide-react";

const navItems = [
  { path: "/", icon: Home, label: "Dashboard" },
  { path: "/transfer", icon: Send, label: "Transfer" },
  { path: "/deposit", icon: PiggyBank, label: "Deposit" },
  { path: "/transactions", icon: History, label: "Transactions" },
];

export default function Layout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden bg-white shadow-sm p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
            <img
              src={user.profile_image}
              alt={user.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="text-sm">
            <p className="font-semibold">{user?.name}</p>
            <p className="text-gray-500 text-xs">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={toggleMobileMenu}
          className="p-2 rounded-lg hover:bg-gray-100"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar - Desktop */}
      <div
        className={`
        ${isMobileMenuOpen ? "block" : "hidden"} 
        md:block 
        w-full md:w-64 
        bg-white shadow-lg 
        md:min-h-screen
        z-20
      `}
      >
        <div className="p-4">
          {/* Desktop User Info */}
          <div className="hidden md:flex items-center space-x-3 mb-8">
            <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
              {/* <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-blue-500"> */}
              <img
                src={user.profile_image}
                alt={user.name}
                className="w-full h-full object-cover"
              />
              {/* </div> */}
            </div>
            <div>
              <h2 className="font-semibold">{user?.name}</h2>
              <p className="text-sm text-gray-500">{user?.email}</p>
            </div>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    location.pathname === item.path
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors text-red-600 hover:bg-red-50"
            >
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 p-4 md:p-8">
        <div className="max-w-5xl mx-auto">{children}</div>
      </div>
    </div>
  );
}
