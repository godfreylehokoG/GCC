import { Analytics } from "@vercel/analytics/react";
import GGC from "./GGC";

export default function App() {
  return (
    <>
      <GGC />
      <Analytics />
    </>
  );
}
