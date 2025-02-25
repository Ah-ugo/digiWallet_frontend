import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "./store";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Transfer from "./pages/Transfer";
import Deposit from "./pages/Deposit";
import Transactions from "./pages/Transactions";
import Layout from "./components/Layout";

function PrivateRoute({ children }) {
  const token = useAuthStore((state) => state.token);
  return token ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/transfer"
          element={
            <PrivateRoute>
              <Layout>
                <Transfer />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/deposit"
          element={
            <PrivateRoute>
              <Layout>
                <Deposit />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/transactions"
          element={
            <PrivateRoute>
              <Layout>
                <Transactions />
              </Layout>
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
