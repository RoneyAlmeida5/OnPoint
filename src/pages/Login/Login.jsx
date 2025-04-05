import { useState } from "react";
import { useNavigate } from "react-router";
import { useUser } from "../../contexts/UserContext";
import api from "../../services/api";
import { jwtDecode } from "jwt-decode";
import logo from "../../assets/logo.png";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import CircularProgress from "@mui/material/CircularProgress";
import "../../componentcss/components.css";
import "./Login.css";

import { Mail, Lock } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { setUser } = useUser(); // Pegue a função para atualizar o usuário

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await api.post("/auth/login", { email, password });
      const token = response.data.access_token;

      if (!token) throw new Error("access_token não recebido!");

      localStorage.setItem("token", token);
      const user = jwtDecode(token);
      console.log("Usuário logado:", user);

      // 🔥 ATUALIZA O CONTEXTO PARA REFLETIR A MUDANÇA IMEDIATAMENTE
      setUser(user);

      setTimeout(() => {
        if (user.sub === 1) {
          navigate("/companymanagement");
        } else if (user.role === "admin") {
          navigate("/usermanagement");
        } else {
          navigate("/caixamercadinho");
        }
      }, 200);
    } catch (err) {
      console.error("Erro no login:", err.response?.data || err.message);
      setError("Erro ao fazer login. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="Container">
      <div className="Card">
        <img src={logo} alt="Logo da marca" className="logo" />
        <div className="InputContainer">
          <span className="Icon">
            <Mail size={20} />
          </span>
          <input
            className="Input"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="InputContainer">
          <span className="Icon">
            <Lock size={20} />
          </span>
          <input
            className="Input"
            type={showPassword ? "text" : "password"}
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <span
            className="Icon_Pass"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>
        <button
          className="Btn_Login"
          onClick={handleLogin}
          disabled={isLoading}
        >
          {isLoading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            "Entrar"
          )}
        </button>
        {error && <div className="error-message">{error}</div>}
      </div>
    </div>
  );
}
