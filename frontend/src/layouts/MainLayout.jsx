import { CartDrawer } from "./CartDrawer";
import { Footer } from "./Footer";
import { Navbar } from "./Navbar";

function MainLayout({ children, onOpenAiAssistant }) {
  return (
    <div className="page-shell flex min-h-dvh flex-col">
      <Navbar onOpenAiAssistant={onOpenAiAssistant} />
      <main className="flex-1">{children}</main>
      <Footer />
      <CartDrawer />
    </div>
  );
}

export default MainLayout;
