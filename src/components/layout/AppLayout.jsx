import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import ToastContainer from "../ToastContainer";

export default function AppLayout() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <ToastContainer />
      <main className="max-w-5xl px-4 py-6 mx-auto">
        <Outlet />
      </main>
    </div>
  );
}
