import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

export default function AppLayout() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-5xl px-4 py-6 mx-auto">
        <Outlet />
      </main>
    </div>
  );
}
