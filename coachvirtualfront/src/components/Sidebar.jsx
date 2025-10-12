// src/components/Sidebar.jsx
import React, { useEffect, useMemo, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import {
  Home,
  UserCircle2,
  Cpu,
  MessageSquareText,
  Users,
  Bell,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const cx = (...c) => c.filter(Boolean).join(" ");

export default function Sidebar({ open, onClose, closeOnNavigate = false }) {
  const { isSuper } = useAuth();
  const location = useLocation();

  // Modo compacto con persistencia
  const [compact, setCompact] = useState(() => {
    const v = localStorage.getItem("sidebar_compact");
    return v ? v === "1" : false;
  });
  useEffect(() => {
    localStorage.setItem("sidebar_compact", compact ? "1" : "0");
  }, [compact]);

  // Cerrar en mobile si se desea
  useEffect(() => {
    if (closeOnNavigate && onClose) onClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  // Menús
  const principal = useMemo(
    () => [
      { to: "/home", label: "Inicio", icon: Home },
      { to: "/perfil", label: "Perfil", icon: UserCircle2 },
      { to: "/mis-alertas", label: "Mis Alertas", icon: Bell },
      { to: "/ia", label: "IA", icon: Cpu },
      { to: "/chat-ia", label: "Chat IA", icon: MessageSquareText },
    ],
    []
  );

  const admin = useMemo(
    () =>
      isSuper
        ? [
            { to: "/usuario", label: "Gestionar Usuario", icon: Users },
            { to: "/alertas", label: "Gestionar Alerta", icon: Bell },
          ]
        : [],
    [isSuper]
  );

  const extras = useMemo(
    () => [
      { href: "#ajustes", label: "Ajustes", icon: Settings },
      { href: "#salir", label: "Salir", icon: LogOut },
    ],
    []
  );

  return (
    <aside
      className={cx(
        "fixed top-16 left-0 h-[calc(100vh-4rem)] bg-gray-800 text-white shadow-lg z-40 transition-transform duration-300",
        open ? "translate-x-0" : "-translate-x-full",
        compact ? "w-16" : "w-56"
      )}
      aria-label="Barra lateral de navegación"
    >
      {/* Header */}
      <header className="px-3 py-3 border-b border-gray-700 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Home className="w-5 h-5" aria-hidden />
          {!compact && <h2 className="text-lg font-semibold">Menú</h2>}
        </div>
        <button
          onClick={() => setCompact((v) => !v)}
          className="p-1 rounded hover:bg-gray-700 transition-colors"
          aria-label={compact ? "Expandir sidebar" : "Compactar sidebar"}
          title={compact ? "Expandir" : "Compactar"}
        >
          {compact ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>
      </header>

      {/* Contenido */}
      <nav className="flex-1 px-2 py-3 overflow-y-auto space-y-5">
        {!compact && <SectionTitle>Principal</SectionTitle>}
        <ul className="space-y-1">
          {principal.map((i) => (
            <li key={i.to}>
              <NavItem to={i.to} icon={i.icon} compact={compact}>
                {i.label}
              </NavItem>
            </li>
          ))}
        </ul>

        {admin.length > 0 && (
          <>
            {!compact && <SectionTitle>Administración</SectionTitle>}
            <ul className="space-y-1">
              {admin.map((i) => (
                <li key={i.to}>
                  <NavItem to={i.to} icon={i.icon} compact={compact}>
                    {i.label}
                  </NavItem>
                </li>
              ))}
            </ul>
          </>
        )}

        {!compact && <SectionTitle>Opciones</SectionTitle>}
        <ul className="space-y-1">
          {extras.map((i) => (
            <li key={i.href}>
              <Anchor href={i.href} icon={i.icon} compact={compact}>
                {i.label}
              </Anchor>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}

/* ---------- Subcomponentes ---------- */

function SectionTitle({ children }) {
  return (
    <div className="px-2 text-xs uppercase tracking-wide text-gray-400 font-semibold">
      {children}
    </div>
  );
}

function NavItem({ to, icon: Icon, compact, children }) {
  return (
    <NavLink
      to={to}
      end
      className={({ isActive }) =>
        cx(
          "group flex items-center gap-3 px-3 py-2 rounded transition-colors duration-150",
          isActive ? "bg-gray-700 font-semibold" : "hover:bg-gray-700"
        )
      }
      aria-current={({ isActive }) => (isActive ? "page" : undefined)}
      title={compact ? String(children) : undefined}
    >
      {Icon && <Icon className="w-5 h-5 shrink-0" aria-hidden />}
      {!compact && <span className="truncate">{children}</span>}
    </NavLink>
  );
}

function Anchor({ href, icon: Icon, compact, children }) {
  return (
    <a
      href={href}
      className="group flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-700 transition-colors duration-150"
      title={compact ? String(children) : undefined}
    >
      {Icon && <Icon className="w-5 h-5 shrink-0" aria-hidden />}
      {!compact && <span className="truncate">{children}</span>}
    </a>
  );
}
