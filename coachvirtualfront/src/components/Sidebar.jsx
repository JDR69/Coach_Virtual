import React, { useEffect, useMemo } from "react";
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
  Dumbbell,
  Crown,
} from "lucide-react";

const cx = (...c) => c.filter(Boolean).join(" ");

export default function Sidebar({ open, onClose, closeOnNavigate = false }) {
  const { isSuper } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (closeOnNavigate && onClose) onClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  const principal = useMemo(
    () => [
      { to: "/home", label: "Inicio", icon: Home },
      { to: "/musculo", label: "Músculo", icon: Dumbbell }, // ⬅️ actualizado
      { to: "/perfil", label: "Perfil", icon: UserCircle2 },
      { to: "/planes", label: "Planes Premium", icon: Crown },
      { to: "/mis-alertas", label: "Mis Alertas", icon: Bell },
      { to: "/ia", label: "IA", icon: Cpu },
      { to: "/pose-test", label: "Entrenar con (IA)", icon: Dumbbell },
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
        "fixed top-16 left-0 h-[calc(100vh-4rem)] w-64 bg-gray-800 text-white shadow-lg z-40",
        "transition-transform duration-300 flex flex-col border-r border-gray-700",
        "overflow-y-auto overscroll-contain",
        open ? "translate-x-0" : "-translate-x-full"
      )}
      aria-label="Barra lateral de navegación"
      style={{ scrollbarGutter: "stable both-edges" }}
    >
      <header className="px-3 py-3 border-b border-gray-700 flex items-center gap-2 sticky top-0 bg-gray-800">
        <Home className="w-5 h-5" aria-hidden />
        <h2 className="text-lg font-semibold">Menú</h2>
      </header>

      <nav className="flex-1 px-2 pr-4 py-3 space-y-5">
        <SectionTitle>Principal</SectionTitle>
        <ul className="space-y-1">
          {principal.map((i) => (
            <li key={i.to}>
              <NavItem to={i.to} icon={i.icon}>
                {i.label}
              </NavItem>
            </li>
          ))}
        </ul>

        {admin.length > 0 && (
          <>
            <SectionTitle>Administración</SectionTitle>
            <ul className="space-y-1">
              {admin.map((i) => (
                <li key={i.to}>
                  <NavItem to={i.to} icon={i.icon}>
                    {i.label}
                  </NavItem>
                </li>
              ))}
            </ul>
          </>
        )}

        <SectionTitle>Opciones</SectionTitle>
        <ul className="space-y-1">
          {extras.map((i) => (
            <li key={i.href}>
              <Anchor href={i.href} icon={i.icon}>
                {i.label}
              </Anchor>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}

function SectionTitle({ children }) {
  return (
    <div className="px-2 text-xs uppercase tracking-wide text-gray-400 font-semibold">
      {children}
    </div>
  );
}

function NavItem({ to, icon: Icon, children }) {
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
    >
      {Icon && <Icon className="w-5 h-5 shrink-0" aria-hidden />}
      <span className="whitespace-normal break-words leading-snug">
        {children}
      </span>
    </NavLink>
  );
}

function Anchor({ href, icon: Icon, children }) {
  return (
    <a
      href={href}
      className="group flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-700 transition-colors duration-150"
    >
      {Icon && <Icon className="w-5 h-5 shrink-0" aria-hidden />}
      <span className="whitespace-normal break-words leading-snug">
        {children}
      </span>
    </a>
  );
}
