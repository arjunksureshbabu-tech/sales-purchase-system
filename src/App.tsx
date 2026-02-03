import { Routes, Route, Navigate } from "react-router-dom";

import Layout from "./layout/Layout";
import SalesForm from "./pages/SalesForm";
import PurchaseForm from "./pages/PurchaseForm";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="/sales" />} />
        <Route path="sales" element={<SalesForm />} />
        <Route path="purchase" element={<PurchaseForm />} />
      </Route>
    </Routes>
  );
}

export default App;
