import { useState } from "react";
import { useNavigate } from "react-router";
import api from "../../services/api";
import { jwtDecode } from "jwt-decode";
import logo from "../../assets/logo.png";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import CircularProgress from "@mui/material/CircularProgress";
import "./Login.css";

import { Mail, Lock } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); // Limpa mensagens de erro anteriores
    setIsLoading(true); // Ativa o loading

    try {
      const response = await api.post("/auth/login", {
        email,
        password,
      });

      const token = response.data.access_token;

      if (!token) {
        throw new Error("access_token não recebido!");
      }

      // Salva o token no localStorage
      localStorage.setItem("token", token);

      // Decodifica o token para obter informações do usuário
      const user = jwtDecode(token);
      console.log("Usuário logado:", user);

      // Faz a requisição para buscar os dados do usuário autenticado
      const userResponse = await api.get("/users", {
        headers: {
          Authorization: `Bearer ${token}`, // Garantir que o token é enviado
        },
      });

      console.log("Dados do usuário autenticado:", userResponse.data);

      await new Promise((resolve) => setTimeout(resolve, 1000)); // Delay de 1s
      navigate("/caixamercadinho"); // Redireciona após login
    } catch (err) {
      console.error("Erro no login:", err.response?.data || err.message);

      if (err.response && err.response.data && err.response.data.message) {
        // Verifica se a mensagem de erro do backend é específica para senha incorreta
        if (err.response.data.message === "Credenciais inválidas") {
          setError("Senha incorreta. Tente novamente.");
        } else {
          setError(err.response.data.message); // Exibe a mensagem de erro do backend
        }
      } else {
        setError("Erro ao fazer login. Tente novamente."); // Exibe mensagem de erro genérica
      }
    } finally {
      setIsLoading(false); // Desativa o loading
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
        <button className="Btn" onClick={handleLogin} disabled={isLoading}>
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
