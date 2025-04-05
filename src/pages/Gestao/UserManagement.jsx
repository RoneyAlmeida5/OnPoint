// MATERIAL UI
import AddCircleIcon from "@mui/icons-material/AddCircle";
import CircularProgress from "@mui/material/CircularProgress";
import { Tooltip, Modal, Box } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import api from "../../services/api";
import { useUser } from "../../contexts/UserContext";
import { toast } from "react-toastify";

const UserManagement = () => {
  const { user, logout } = useUser();
  const navigate = useNavigate();

  console.log("UserManagement renderizado"); // Adicione este log

  // LOGOUT
  const handleLogout = () => {
    logout();
    navigate("/Login");
  };
  // COMPANY
  const [users, setUsers] = useState([]);
  const [nameUsers, setNameUsers] = useState("");
  const [cpf, setCpf] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [companyId, setCompanyId] = useState("");
  const [role, setRole] = useState("user");
  // MODAL
  const [adcUserOpen, setAdcUserOpen] = useState(false);
  // LOADING E ERROR
  const [loading, setLoading] = useState(true);
  const [isLoadingToken, setIsLoadingToken] = useState(true); // Adicione este estado
  const [addingUser, setAddingUser] = useState(false);
  const [error, setError] = useState(null);

  // MODAL ADC COMPANY
  const handleOpenAdcUser = () => setAdcUserOpen(true);
  const handleCloseAdcUser = () => setAdcUserOpen(false);

  useEffect(() => {
    console.log("useEffect executado");

    if (user && user.token) {
      setIsLoadingToken(false); // Token disponível, defina isLoadingToken como false
    }

    if (!user || !user.token) {
      console.log("Token do usuário não disponível");
      return;
    }

    const fetchUsersByCompany = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get("/companies/my-users", {
          headers: { Authorization: `Bearer ${user.token}` },
        });

        console.log("Dados recebidos da API:", response.data);

        if (Array.isArray(response.data)) {
          setUsers(response.data);
        } else if (Array.isArray(response.data.users)) {
          setUsers(response.data.users);
        } else {
          console.warn("Formato inesperado:", response.data);
          setUsers([]);
        }

        console.log("Estado atualizado:", users);
      } catch (err) {
        console.error("Erro na API:", err);
        setError("Erro ao buscar colaboradores.");
      } finally {
        setLoading(false);
      }
    };

    if (!isLoadingToken) {
      // Faça a requisição apenas se o token estiver disponível
      fetchUsersByCompany();
    }
  }, [user, isLoadingToken]); // Adicione isLoadingToken como dependência

  // ADICIONAR COMPANY
  const adicionarUsers = async () => {
    setAddingUser(true);

    try {
      const response = await api.post(
        "/users",
        {
          name: nameUsers,
          cpf: cpf,
          email: email,
          password: password,
          role: "user",
        },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );

      setUsers([...users, response.data]);
      toast.success("Colaborador adicionado com sucesso!");
      setAdcUserOpen(false);
      setNameUsers("");
      setCpf("");
      setEmail("");
      setPassword("");
      setRole("");
    } catch (error) {
      toast.error("Erro ao adicionar usuário!");
    } finally {
      setAddingUser(false);
    }
  };

  // FUNÇÃO PARA DELETAR USUARIOS
  const removerUser = async (idUsers) => {
    try {
      await api.delete(`/users/${idUsers}`, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });

      setUsers(users.filter((user) => user.id !== idUsers));
      toast.success("Colaborador removido com sucesso!");
    } catch (error) {
      toast.error("Erro ao remover o colaborador!");
    }
  };

  return (
    <div className="company-management-container">
      {/* BOTÃO PARA ABRIR MODAL */}
      <div className="ScrollContainerSales">
        <Tooltip
          title="Adicionar Colaborador"
          arrow
          componentsProps={{
            tooltip: {
              sx: {
                fontSize: "1rem", // aumenta a fonte
                backgroundColor: "#333", // opcional
                color: "#fff", // opcional
              },
            },
          }}
        >
          <button className="Btns_Headers" onClick={handleOpenAdcUser}>
            <AddCircleIcon sx={{ fontSize: "30px", justifyItems: "center" }} />
          </button>
        </Tooltip>
        <Tooltip
          title="Sair"
          arrow
          componentsProps={{
            tooltip: {
              sx: {
                fontSize: "1rem", // aumenta a fonte
                backgroundColor: "#333", // opcional
                color: "#fff", // opcional
              },
            },
          }}
        >
          <button className="Btns_Headers" onClick={handleLogout}>
            <LogoutIcon sx={{ fontSize: "30px", justifyItems: "center" }} />
          </button>
        </Tooltip>
      </div>
      <Modal open={adcUserOpen} onClose={handleCloseAdcUser}>
        <Box className="Box">
          <div className="ScreenModalAdcProd">
            <div className="PainelModalAdcProd">
              <h2>ADICIONAR COLABORADOR</h2>
              <input
                className="InputModalAdcProd"
                placeholder="Nome do Colaborador"
                value={nameUsers}
                onChange={(e) => setNameUsers(e.target.value)}
              />
              <input
                className="InputModalAdcProd"
                placeholder="Cpf"
                value={cpf}
                onChange={(e) => setCpf(e.target.value)}
              />
              <input
                className="InputModalAdcProd"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                className="InputModalAdcProd"
                placeholder="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <input
                className="InputModalAdcProd"
                placeholder="Company da empresa"
                value={companyId}
                disabled
              />
              <button
                className="Btn"
                onClick={adicionarUsers}
                disabled={addingUser}
              >
                {addingUser ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Adicionar"
                )}
              </button>
            </div>
          </div>
        </Box>
      </Modal>
      {/* CONTAINER TABELA EMPRESAS */}
      <h2 className="text">Gestão de Colaboradores</h2>
      <table className="company-table">
        <thead>
          <tr>
            <th className="text">Nome</th>
            <th className="text">Cpf</th>
            <th className="text">Email</th>
            <th className="text">Ações</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((user) => (
              <tr key={user.id}>
                <td className="text">{user.name}</td>
                <td className="text">{user.cpf}</td>
                <td className="text">{user.email}</td>
                <td className="text">
                  <button className="Btn_Action">Ver Detalhes</button>
                  <button className="Btn_Action">Editar</button>
                  <button
                    className="Btn_Action_Delete"
                    onClick={() => removerUser(user.id)}
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text">
                Nenhum colaborador encontrado!.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UserManagement;
