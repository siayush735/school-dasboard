import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import { AuthProvider } from "./context/AuthContext";
import Layout from "./components/common/Layout";
import { Toaster } from "react-hot-toast";

export default function App() {
  return (
    <AuthProvider>
       <Toaster position="top-right" />
      <BrowserRouter>
        <Layout>
          <AppRoutes />
        </Layout>
      </BrowserRouter>
    </AuthProvider>
  );
}