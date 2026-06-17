"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ScanSearch, ShoppingBag, BookOpen, User } from "lucide-react";

const NAV_ITEMS = [
  { href: "/", label: "Inicio", Icon: Home },
  { href: "/analizador", label: "Analizar", Icon: ScanSearch },
  { href: "/productos", label: "Productos", Icon: ShoppingBag },
  { href: "/aprende", label: "Aprende", Icon: BookOpen },
  { href: "/perfil", label: "Perfil", Icon: User },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav style={{
      position: "fixed",
      bottom: 0,
      left: 0,
      right: 0,
      height: "68px",
      background: "#ffffff",
      backdropFilter: "blur(16px)",
      WebkitBackdropFilter: "blur(16px)",
      borderTop: "1px solid rgba(83,66,116,0.10)",
      boxShadow: "0 -4px 20px rgba(83,66,116,0.07)",
      display: "flex",
      alignItems: "stretch",
      zIndex: 50,
    }}>
      {NAV_ITEMS.map((item) => {
        const active = pathname === item.href;
        const { Icon } = item;
        return (
          <Link
            key={item.href}
            href={item.href}
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.22rem",
              textDecoration: "none",
              color: active ? "#B981DA" : "#9b8ab0",
              transition: "color 0.18s",
              position: "relative",
            }}
          >
            {active && (
              <span style={{
                position: "absolute",
                top: 0,
                left: "50%",
                transform: "translateX(-50%)",
                width: 28,
                height: 3,
                borderRadius: "0 0 3px 3px",
                background: "#B981DA",
              }} />
            )}
            <Icon size={19} strokeWidth={active ? 2.2 : 1.6} />
            <span style={{
              fontSize: "0.58rem",
              fontWeight: active ? 700 : 500,
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              fontFamily: "var(--font-inter), system-ui, sans-serif",
            }}>
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
