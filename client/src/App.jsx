import './App.css'
import { Routes, Route } from "react-router-dom";

import  {AuthProvider}  from "./auth/AuthContext.jsx";
import ProtectedRoute from "./auth/ProtectedRoute.jsx";
import Login from "./pages/Login.jsx";
import Dashboard from './pages/Dashboard.jsx';


const App = () => {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
         <Route path="/" element={<ProtectedRoute> <Dashboard /> </ProtectedRoute>}/>
      </Routes>
    </AuthProvider>
  );
};

export default App
