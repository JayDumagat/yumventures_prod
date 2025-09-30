import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import "./App.css";
import { ToastContainer } from "react-toastify";
import Unauthorized from "./components/Unauthorized";
import SuccessPage from "./pages/SuccessPage";
import CustomerLogin from "./pages/CustomerLogin.jsx";
import Profile from "./pages/Profile.jsx";


const Landing = lazy(() => import("./pages/Landing"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const ProtectedRoute = lazy(() => import("./components/ProtectedRoute"));
const ClientLogin = lazy(() => import("./pages/ClientLogin"));
const Category = lazy(() => import("./pages/Category"));
const MenuItems = lazy(() => import("./pages/MenuItems"));
const PointOfSales = lazy(() => import("./pages/PointOfSales"));
const PosOrders = lazy(() => import("./pages/PosOrders"));
const Reports = lazy(() => import("./pages/Reports"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const Transactions = lazy(() => import("./pages/Transactions"));
const CustomerMenu = lazy(() => import("./pages/CustomerMenu"));
const Cart = lazy(() => import("./pages/Cart"));
const Order = lazy(() => import("./pages/Order"));
const Register = lazy(() => import("./pages/Register"));
const StaffManagement = lazy(() => import("./pages/StaffManagement"));
function App() {
  return (
    <>
      <ToastContainer position="top-right" autoClose={1000} />
      <Router>
        <Routes>
          <Route
            path="/client/dashboard"
            element={
              <Suspense fallback={<div>Loading...</div>}>
                <ProtectedRoute routeTo="/client/login" rolesAllowed={["owner", "cashier"]}>
                  <Dashboard />
                </ProtectedRoute>
              </Suspense>
            }
          />
          <Route
            path="/"
            element={
              <Suspense fallback={<div>Loading...</div>}>
                <Landing />
              </Suspense>
            }
          />
          <Route
            path="/client/login"
            element={
              <Suspense fallback={<div>Loading...</div>}>
                <ClientLogin redirectTo={"/client/dashboard"} />
              </Suspense>
            }
          />

          <Route
            path="/forgot-password"
            element={
              <Suspense fallback={<div>Loading...</div>}>
                <ForgotPassword />
              </Suspense>
            }
          />

          <Route
            path="/client/menu-categories"
            element={
              <Suspense fallback={<div>Loading...</div>}>
                <ProtectedRoute routeTo="/client/login" rolesAllowed={["owner", "cashier"]}>
                  <Category />
                </ProtectedRoute>
              </Suspense>
            }
          />

          <Route
            path="/client/menu-items"
            element={
              <Suspense fallback={<div>Loading...</div>} rolesAllowed={["owner", "cashier"]}>
                <ProtectedRoute routeTo="/client/login">
                  <MenuItems />
                </ProtectedRoute>
              </Suspense>
            }
          />

          <Route
            path="/client/point-of-sales"
            element={
              <Suspense fallback={<div>Loading...</div>} rolesAllowed={["owner", "cashier"]}>
                <ProtectedRoute routeTo="/client/login">
                  <PointOfSales />
                </ProtectedRoute>
              </Suspense>
            }
          />

          <Route
            path="/client/orders"
            element={
              <Suspense fallback={<div>Loading...</div>} rolesAllowed={["owner", "cashier"]}>
                <ProtectedRoute routeTo="/client/login">
                  <PosOrders />
                </ProtectedRoute>
              </Suspense>
            }
          />

          <Route
            path="/client/reports"
            element={
              <Suspense fallback={<div>Loading...</div>} rolesAllowed={["owner"]}>
                <ProtectedRoute routeTo="/client/login">
                  <Reports />
                </ProtectedRoute>
              </Suspense>
            }
          />

<Route
            path="/client/transactions"
            element={
              <Suspense fallback={<div>Loading...</div>}>
                <ProtectedRoute routeTo="/client/login" rolesAllowed={["owner", "cashier"]}>
                  <Transactions />
                </ProtectedRoute>
              </Suspense>
            }
          />

          <Route
            path="/menu"
            element={
              <Suspense fallback={<div>Loading...</div>}>
                <ProtectedRoute routeTo={"/login"} rolesAllowed={["everyone"]}>
                  <CustomerMenu />
                </ProtectedRoute>
              </Suspense>
            }
          />

          <Route
            path="/cart"
            element={
              <Suspense fallback={<div>Loading...</div>}>
                <ProtectedRoute routeTo={"/login"} rolesAllowed={["everyone"]}>
                  <Cart />
                </ProtectedRoute>
              </Suspense>
            }
          />

            <Route path="/profile" element={
                <Suspense fallback={<div>Loading...</div>}>
                    <ProtectedRoute routeTo={"/login"} rolesAllowed={["owner", "cashier", "customer"]}>
                        <Profile />
                    </ProtectedRoute>
                </Suspense>
            } />

            <Route
                path="/orders"
                element={
                    <Suspense fallback={<div>Loading...</div>}>
                        <ProtectedRoute routeTo={"/login"} rolesAllowed={["everyone"]}>
                            <Order />
                        </ProtectedRoute>
                    </Suspense>
                }
            />

          <Route
            path="/orders"
            element={
              <Suspense fallback={<div>Loading...</div>}>
               <ProtectedRoute routeTo={"/login"} rolesAllowed={["everyone"]}>
                  <Order />
                </ProtectedRoute>
              </Suspense>
            }
          />

          <Route
            path="/login"
            element={
              <Suspense fallback={<div>Loading...</div>}>
                <CustomerLogin redirectTo={"/"} />
              </Suspense>
            }
          />

          <Route
            path="/register"
            element={
              <Suspense fallback={<div>Loading...</div>}>
                <Register />
              </Suspense>
            }
          />

          <Route
            path="/client/staff-management"
            element={
              <Suspense fallback={<div>Loading...</div>}>
                <ProtectedRoute routeTo="/client/login" rolesAllowed={["owner"]}>
                  <StaffManagement />
                </ProtectedRoute>
              </Suspense>
            }
          />

          <Route path="/unauthorized" element={<Unauthorized/>} />
          <Route path="/success" element={<SuccessPage />} />
            <Route path="/profile/{id}" element={<Profile />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
