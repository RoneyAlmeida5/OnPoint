import React, { useState, useEffect } from "react";
import api from "../../services/api";
import { useUser } from "../../contexts/UserContext";
import "./CompanyManagement.css";

const CompanyManagement = () => {
  const { user } = useUser();
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCompanies = async () => {
      console.log("Função fetchCompanies chamada");
      console.log("Token do usuário:", user?.token);
      setLoading(true);
      setError(null);
      try {
        const response = await api.get("/companies", {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        });
        console.log("Resposta da API:", response);
        setCompanies(response.data);
        console.log("Dados recebidos:", response.data);
      } catch (err) {
        setError(err);
        console.error("Erro ao buscar empresas:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, [user?.token]);

  if (loading) {
    return <div className="text">Carregando...</div>;
  }

  if (error) {
    return <div className="text">{error}</div>;
  }

  return (
    <div className="company-management-container">
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
                  <button className="action-btn">Ver Detalhes</button>
                  <button className="action-btn">Editar</button>
                  <button className="action-btn">Excluir</button>
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
