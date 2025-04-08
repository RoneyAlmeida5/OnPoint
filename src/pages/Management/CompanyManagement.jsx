// MATERIAL UI
import AddCircleIcon from "@mui/icons-material/AddCircle";
import CircularProgress from "@mui/material/CircularProgress";
import { Tooltip, Modal, Box } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
// STATES / ROUTES E ETC
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useUser } from "../../contexts/UserContext";
import { toast } from "react-toastify";
// API
import api from "../../services/api";
// CSS
import "./CompanyManagement.css";

const CompanyManagement = () => {
  const { user, logout } = useUser();
  const navigate = useNavigate();

  // LOGOUT
  const handleLogout = () => {
    logout();
    navigate("/Login");
  };
  // USUARIOS
  const [users, setUsers] = useState([]);
  const [nameUsers, setNameUsers] = useState("");
  const [cpf, setCpf] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [companyid, setCompanyid] = useState("");
  const [role, setRole] = useState("");
  // COMPANY
  const [nameCompany, setNameCompany] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [companies, setCompanies] = useState([]);
  // MODAL
  const [adcCompanyOpen, setAdcCompanyOpen] = useState(false);
  const [adcUsersOpen, setAdcUsersOpen] = useState(false);
  // LOADING E ERROR
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // MODAL ADC COMPANY
  const handleOpenAdcCompany = () => setAdcCompanyOpen(true);
  const handleCloseAdcCompany = () => setAdcCompanyOpen(false);
  // MODAL ADC USUARIO
  const handleOpenAdcUsers = () => setAdcUsersOpen(true);
  const handleCloseAdcUsers = () => setAdcUsersOpen(false);

  useEffect(() => {
    const fetchCompanies = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get("/companies", {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        });
        setCompanies(response.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, [user?.token]);

  // ADICIONAR USUARIO A EMPRESA
  const adicionarUser = async () => {
    setLoading(true);

    const response = await api.post("/users", {
      name: nameUsers,
      cpf: cpf,
      email: email,
      password: password,
      companyId: companyid,
      role: role,
    });

    setUsers([...users, response.data]);

    toast.success("Usuário adicionado com sucesso!");
    setLoading(false);
    setNameUsers("");
    setCpf("");
    setEmail("");
    setPassword("");
    setCompanyid("");
    setRole("");
    setAdcUsersOpen(false);
  };

  // ADICIONAR COMPANY
  const adicionarCompany = async () => {
    setLoading(true);

    const response = await api.post("/companies", {
      name: nameCompany,
      cnpj: cnpj,
    });

    setCompanies([...companies, response.data]);

    toast.success("Empresa adicionada com sucesso!");
    setLoading(false);
    setNameCompany("");
    setCnpj("");
    setAdcCompanyOpen(false);
  };

  // FUNÇÃO PARA DELETAR COMPANY
  const removerCompany = async (idCompany) => {
    try {
      await api.delete(`/companies/${idCompany}`, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });

      setCompanies(companies.filter((company) => company.id !== idCompany));
      toast.success("Empresa removida com sucesso!");
    } catch (error) {
      toast.error("Erro ao remover empresa!");
    }
  };

  if (loading) return <div className="text">Carregando...</div>;
  if (error) return <div className="text">{error}</div>;

  return (
    <div className="company-management-container">
      {/* BOTÃO PARA ABRIR MODAL */}
      <div className="ScrollContainerSales">
        <Tooltip
          title="Adicionar Empresa"
          arrow
          componentsProps={{
            tooltip: {
              sx: {
                fontSize: "1rem",
                backgroundColor: "#333",
                color: "#fff",
              },
            },
          }}
        >
          <button className="Btns_Headers" onClick={handleOpenAdcCompany}>
            <AddCircleIcon sx={{ fontSize: "30px", justifyItems: "center" }} />
          </button>
        </Tooltip>
        <Tooltip
          title="Adicionar Usuario a Empresa"
          arrow
          componentsProps={{
            tooltip: {
              sx: {
                fontSize: "1rem",
                backgroundColor: "#333",
                color: "#fff",
              },
            },
          }}
        >
          <button className="Btns_Headers" onClick={handleOpenAdcUsers}>
            <PersonAddIcon sx={{ fontSize: "30px", justifyItems: "center" }} />
          </button>
        </Tooltip>
        <Tooltip
          title="Sair"
          arrow
          componentsProps={{
            tooltip: {
              sx: {
                fontSize: "1rem",
                backgroundColor: "#333",
                color: "#fff",
              },
            },
          }}
        >
          <button className="Btns_Headers" onClick={handleLogout}>
            <LogoutIcon sx={{ fontSize: "30px", justifyItems: "center" }} />
          </button>
        </Tooltip>
      </div>
      {/* MODALS */}
      <Modal open={adcCompanyOpen} onClose={handleCloseAdcCompany}>
        <Box className="Box">
          <div className="ScreenModalAdcProd">
            <div className="PainelModalAdcProd">
              <h2>ADICIONAR COMPANY</h2>
              <input
                className="InputModalAdcProd"
                placeholder="Nome da Empresa"
                value={nameCompany}
                onChange={(e) => setNameCompany(e.target.value)}
              />
              <input
                className="InputModalAdcProd"
                placeholder="Cnpj"
                value={cnpj}
                onChange={(e) => setCnpj(e.target.value)}
              />
              <button
                className="Btn"
                onClick={adicionarCompany}
                disabled={loading}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Adicionar"
                )}
              </button>
            </div>
          </div>
        </Box>
      </Modal>
      <Modal open={adcUsersOpen} onClose={handleCloseAdcUsers}>
        <Box className="Box">
          <div className="ScreenModalAdcProd">
            <div className="PainelModalAdcProd">
              <h2>ADICIONAR USUÁRIO</h2>
              <input
                className="InputModalAdcProd"
                placeholder="Responsavel pela empresa"
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
                value={companyid}
                onChange={(e) => setCompanyid(e.target.value)}
              />
              <input
                className="InputModalAdcProd"
                placeholder="Admin ou User?"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              />
              <button
                className="Btn"
                onClick={adicionarUser}
                disabled={loading}
              >
                {loading ? (
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
      <h2 className="text">Gestão de Empresas</h2>
      <table className="company-table">
        <thead>
          <tr>
            <th className="text">ID</th>
            <th className="text">Nome</th>
            <th className="text">CNPJ</th>
            <th className="text">Ações</th>
          </tr>
        </thead>
        <tbody>
          {companies.length > 0 ? (
            companies.map((company) => (
              <tr key={company.id}>
                <td className="text">{company.id}</td>
                <td className="text">{company.name}</td>
                <td className="text">{company.cnpj}</td>
                <td className="text">
                  <button className="Btn_Action">Ver Detalhes</button>
                  <button className="Btn_Action">Editar</button>
                  <button
                    className="Btn_Action_Delete"
                    onClick={() => removerCompany(company.id)}
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text">
                Nenhuma empresa encontrada.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CompanyManagement;
