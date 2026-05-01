"use client";

import { usePathname } from "next/navigation";
import Container from "@/components/category/Container";

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isHome = pathname === "/";

  const fullWidthRoutes = ["/seller", "/admin"];

  const isFullWidthLayout = fullWidthRoutes.some((route) =>
    pathname.startsWith(route),
  );

  return (
    <main className={isHome ? "" : "pt-16"}>
      {isHome || isFullWidthLayout ? (
        children
      ) : (
        <Container>{children}</Container>
      )}
    </main>
  );
}
