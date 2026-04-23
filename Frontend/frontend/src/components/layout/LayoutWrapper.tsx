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

  return (
    <main className={isHome ? "" : "pt-16"}>
      {isHome ? children : <Container>{children}</Container>}
    </main>
  );
}