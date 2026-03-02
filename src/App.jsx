import { Analytics } from "@vercel/analytics/react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import GGC from "./GGC";
import AdminDashboard from "./components/AdminDashboard";
import PaymentInstructions from "./components/PaymentInstructions";

export default function App() {
  return (
    <>
      <GGC />
      <Analytics />
    </>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<GGC />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/payment-instructions" element={<PaymentInstructions />} />
      </Routes>
    </BrowserRouter>
  );
}

