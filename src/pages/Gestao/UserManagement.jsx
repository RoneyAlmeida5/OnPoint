import React from "react";

const UserManagement = () => {
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
      </table>
    </div>
  );
};

export default UserManagement;
