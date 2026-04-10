// src/components/Navbar/Navbar.jsx
import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Search,
  BellRing,
  BarChart3,
  Droplet
} from "lucide-react";
//import "./Navbar.css";

const Navbar = () => {
  const menuItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: <LayoutDashboard size={20} />
    },
    {
      name: "Recherche",
      path: "/search",
      icon: <Search size={20} />
    },
    {
      name: "Alertes",
      path: "/alerts",
      icon: <BellRing size={20} />
    },
    {
      name: "Statistiques",
      path: "/stats",
      icon: <BarChart3 size={20} />
    }
  ];

  return (
    <aside className="sidebar-navbar">
      {/* Logo */}
      <div className="sidebar-logo">
        <Droplet size={28} className="logo-icon" fill="currentColor" />
        <span>Rakitra Ra</span>
      </div>

      {/* Menu */}
      <nav className="sidebar-menu">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              isActive ? "nav-item active" : "nav-item"
            }
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-text">{item.name}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Navbar;