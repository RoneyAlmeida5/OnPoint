// MATERIAL UI
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Typography,
  CircularProgress,
  Tooltip,
  TablePagination,
} from "@mui/material";
import DescriptionIcon from "@mui/icons-material/Description";
import { ExpandMore, ExpandLess } from "@mui/icons-material";
// STATES / ROUTER E ETC
import React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import * as XLSX from "xlsx";
import logo from "../../assets/logo.png";
// API E TOKEN(JWT)
import api from "../../services/api";
import { jwtDecode } from "jwt-decode";
// CSS
import "./SalesPage.css";

export default function SalesPage() {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [globalFilter, setGlobalFilter] = useState("");
  const navigation = useNavigate();

  // FUNÇÃO DE DROPDOWN
  const [expandedSales, setExpandedSales] = useState({});
  // CRIAR PÁGINAÇÃO & FILTRO
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5); // ex: 5 vendas por página

  // VALOR TOTAL DA VENDA
  const calcularValorTotal = (sale) => {
    return sale.salesProducts.reduce((total, item) => {
      return total + item.product.value * item.quantity;
    }, 0);
  };

  // FUNÇÃO PARA FILTRAR AS VENDAS
  const filteredSales = sales.filter((sale) => {
    const valorTotal = calcularValorTotal(sale).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

    return sale.salesProducts.some((item) => {
      const searchString = globalFilter.toLowerCase();

      return (
        String(sale.id).toLowerCase().includes(searchString) ||
        sale.user.name.toLowerCase().includes(searchString) ||
        sale.payment.name.toLowerCase().includes(searchString) ||
        new Date(sale.date_sale)
          .toLocaleDateString()
          .toLowerCase()
          .includes(searchString) ||
        item.product.name.toLowerCase().includes(searchString) ||
        String(item.quantity).toLowerCase().includes(searchString) ||
        valorTotal.toLowerCase().includes(searchString)
      );
    });
  });
  const salesPaginated = filteredSales.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // GERAR EXCEL
  const gerarExcel = () => {
    const data = filteredSales.flatMap((sale) => {
      let valorTotal = calcularValorTotal(sale).toLocaleString("pt-BR", {
        currency: "BRL",
      });

      return sale.salesProducts.map((item, index) => ({
        "ID da Venda": sale.id,
        Usuário: sale.user.name,
        Pagamento: sale.payment.name,
        Data: new Date(sale.date_sale).toLocaleDateString(),
        Produto: item.product.name,
        Quantidade: item.quantity,
        Valortotal: index === 0 ? valorTotal : "",
      }));
    });

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Vendas");
    XLSX.writeFile(workbook, "relatorio_vendas.xlsx");
  };

  // REALIZAR BUSCA DAS VENDAS
  useEffect(() => {
    async function fetchSales() {
      try {
        const token = localStorage.getItem("token");
        const user = jwtDecode(token);
        const companyId = user.companyId;

        const response = await api.get(`/sales?companyId=${companyId}`);

        setSales(response.data || []);
      } catch (error) {
        console.error("Erro ao buscar vendas:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchSales();
  }, []);

  // DROPDOWN
  const handleExpandToggle = (saleId) => {
    setExpandedSales((prevExpanded) => ({
      ...prevExpanded,
      [saleId]: !prevExpanded[saleId],
    }));
  };

  return (
    // CONTAINER DA PAGINA
    <div className="ContainerSales">
      <img src={logo} alt="Logo da marca" className="ImgSales" />
      <Typography
        variant="h4"
        gutterBottom
        style={{
          color: "white",
          padding: "20px",
          fontFamily: "Montserrat, sans-serif",
          fontWeight: 400,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          textShadow: "2px 2px 4px rgba(0, 0, 0, 0.3)",
        }}
      >
        Histórico de Vendas
      </Typography>
      <input
        className="Input_Filter"
        value={globalFilter}
        onChange={(e) => setGlobalFilter(e.target.value)}
        placeholder="Filtrar todas as colunas..."
        fullWidth
      />
      {/*HEADER DOS BUTTON*/}
      <div className="ScrollContainerSales">
        <Tooltip
          title="Baixar planilha Excel"
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
          <button className="Btns_Headers" onClick={gerarExcel}>
            <DescriptionIcon
              sx={{ fontSize: "30px", justifyItems: "center" }}
            />
          </button>
        </Tooltip>
        <Tooltip
          title="Retornar ao caixa"
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
          <button
            className="Btns_Headers"
            onClick={() => navigation("/caixamercadinho")}
          >
            <ArrowBackIcon sx={{ fontSize: "30px", justifyItems: "center" }} />
          </button>
        </Tooltip>
      </div>
      {/*LOGICA TABELA VENDAS*/}
      <div className="ContainerSales_Table">
        {loading ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "20px",
            }}
          >
            <CircularProgress />
          </div>
        ) : sales.length === 0 ? (
          <Typography
            variant="h6"
            style={{ color: "white", textAlign: "center", marginTop: "20px" }}
          >
            Nenhuma venda encontrada.
          </Typography>
        ) : (
          <TableContainer
            component={Paper}
            sx={{
              margin: "20px auto",
              borderRadius: 2,
              boxShadow: 3,
            }}
          >
            <Table>
              <TableHead>
                <TableRow
                  sx={{
                    background:
                      "linear-gradient(135deg,rgb(95, 95, 95) 20%,rgb(95, 95, 95) 50%,rgb(95, 95, 95) 100%)",
                    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2);",
                  }}
                >
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                    ID da Venda
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                    Usuário
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                    Pagamento
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                    Data
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                    Produto
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                    Quantidade
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                    Valor Total
                  </TableCell>
                  <TableCell
                    sx={{
                      width: "50px",
                      color: "white",
                      fontWeight: "bold",
                    }}
                  >
                    Items
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {salesPaginated.map((sale, index) => (
                  <React.Fragment key={sale.id}>
                    {sale.salesProducts.map((item, subIndex) => {
                      const isFirstItem = subIndex === 0;

                      if (!expandedSales[sale.id] && !isFirstItem) {
                        return null;
                      }

                      return (
                        <TableRow
                          key={`${sale.id}-${subIndex}`}
                          sx={{
                            backgroundColor:
                              index % 2 === 0 ? "#f1f1f1" : "white",
                          }}
                        >
                          <TableCell>{sale.id}</TableCell>
                          <TableCell>{sale.user.name}</TableCell>
                          <TableCell>{sale.payment.name}</TableCell>
                          <TableCell>
                            {new Date(sale.date_sale).toLocaleDateString()}
                          </TableCell>
                          <TableCell>{item.product.name}</TableCell>
                          <TableCell>{item.quantity}</TableCell>
                          {isFirstItem && (
                            <TableCell
                              rowSpan={
                                expandedSales[sale.id]
                                  ? sale.salesProducts.length
                                  : 1
                              }
                            >
                              {calcularValorTotal(sale).toLocaleString(
                                "pt-BR",
                                {
                                  style: "currency",
                                  currency: "BRL",
                                }
                              )}
                            </TableCell>
                          )}
                          {isFirstItem && (
                            <TableCell
                              rowSpan={
                                expandedSales[sale.id]
                                  ? sale.salesProducts.length
                                  : 1
                              }
                            >
                              <IconButton
                                onClick={() => handleExpandToggle(sale.id)}
                              >
                                {expandedSales[sale.id] ? (
                                  <ExpandLess />
                                ) : (
                                  <ExpandMore />
                                )}
                              </IconButton>
                            </TableCell>
                          )}
                        </TableRow>
                      );
                    })}
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
        <TablePagination
          component="div"
          count={sales.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 15]}
          labelRowsPerPage="Linhas por página"
          sx={{
            marginBottom: "15px",
            background:
              "linear-gradient(135deg,rgb(66, 66, 66) 0%,rgb(48, 48, 48) 50%,rgb(66, 66, 66) 100%)",
            color: "white",
            borderRadius: "0 0 12px 12px",
            "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows":
              {
                color: "white",
              },
            "& .MuiInputBase-root": {
              color: "white",
            },
            "& .MuiSvgIcon-root": {
              color: "white",
            },
            "& .MuiTablePagination-actions button": {
              color: "white",
            },
          }}
        />
      </div>
    </div>
  );
}
