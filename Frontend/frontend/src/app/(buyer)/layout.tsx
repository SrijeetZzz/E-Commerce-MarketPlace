import Navbar from "@/components/home/Navbar";
import Footer from "@/components/home/Footer";
import LayoutWrapper from "@/components/layout/LayoutWrapper";

export default function BuyerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <LayoutWrapper>{children}</LayoutWrapper>
      <Footer />
    </>
  );
}