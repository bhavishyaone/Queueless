import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../auth/AuthContext";

const Login = ()=>{
    const {login}=useAuth()
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleSubmit = async (event)=>{
        event.preventDefault();
        setError("")
        setSuccess("")

    
          try {
            const res = await api.post("/auth/login", { email, password });
            console.log("Login Success:", res.data);
            if(res.data.message) {
                setSuccess(res.data.message);
            }
            login(res.data);
            navigate("/");
            } 
            catch(err) {
                console.log("Login Failed:", err);
                setError("Invalid credentials");
            }
        
  };




  return (
    <div className="min-h-screen flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow w-80"
      >
        <h2 className="text-xl font-semibold mb-4">Login</h2>

        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        {success && <p className="text-green-500 text-sm mb-2">{success}</p>}

        <input
          className="w-full border p-2 mb-3"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="w-full border p-2 mb-3"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="w-full bg-black text-white py-2 rounded">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;



