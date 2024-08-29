import Navbar from "@/components/Navbar";
import { Toaster } from "react-hot-toast";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 container">
        {children}
        <Toaster position="top-center" reverseOrder={false} />
      </main>
      {/* <Footer /> */}
    </div>
  );
}