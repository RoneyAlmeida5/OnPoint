import React from "react";
import { useEffect, useState } from "react";
import "./SalesPage.css";
import logo from "../../assets/logo.png";
import api from "../../services/api";
import { useNavigate } from "react-router";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DescriptionIcon from "@mui/icons-material/Description";
import * as XLSX from "xlsx";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  CircularProgress,
  Tooltip,
  TablePagination,
} from "@mui/material";

export default function SalesPage() {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [globalFilter, setGlobalFilter] = useState("");
  const navigation = useNavigate();

  // CRIAR PÁGINAÇÃO & FILTRO
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5); // ex: 5 vendas por página

  // VALOR TOTAL DA VENDA
  const calcularValorTotal = (sale) => {
    return sale.salesProducts.reduce((total, item) => {
      return total + item.product.value * item.quantity;
    }, 0);
  };

  // Função para filtrar as vendas
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
    setPage(0); // volta pra página 1 quando mudar a quantidade
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
        Valortotal: index === 0 ? valorTotal : "", // Preenche valor total apenas na primeira linha
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
        const response = await api.get("/sales");
        setSales(response.data || []); //Garante que sales sempre será um array
      } catch (error) {
        console.error("Erro ao buscar vendas:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchSales();
  }, []);

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
          fontFamily: "Montserrat, sans-serif", // Fonte moderna
          fontWeight: 400, // Peso da fonte leve
          letterSpacing: "0.1em", // Espaçamento entre letras
          textTransform: "uppercase", // Transformação do texto
          textShadow: "2px 2px 4px rgba(0, 0, 0, 0.3)", // Sombra do texto
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
                fontSize: "1rem", // aumenta a fonte
                backgroundColor: "#333", // opcional
                color: "#fff", // opcional
              },
            },
          }}
        >
          <button className="Btn_Sales" onClick={gerarExcel}>
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
                fontSize: "1rem", // aumenta a fonte
                backgroundColor: "#333", // opcional
                color: "#fff", // opcional
              },
            },
          }}
        >
          <button
            className="Btn_Sales"
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
                      "linear-gradient(135deg, #344dcc 0%, #000000 50%, #344dcc 100%)",
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
                </TableRow>
              </TableHead>
              <TableBody>
                {salesPaginated.map((sale, index) => (
                  <React.Fragment key={sale.id}>
                    {sale.salesProducts.map((item, subIndex) => (
                      <TableRow
                        key={`<span class="math-inline">{sale.id}-<span>{subIndex}`}
                        sx={{
                          backgroundColor:
                            index % 2 === 0 ? "#cfcfcf" : "white",
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
                        {subIndex === 0 && (
                          <TableCell rowSpan={sale.salesProducts.length}>
                            {calcularValorTotal(sale).toLocaleString("pt-BR", {
                              style: "currency",
                              currency: "BRL",
                            })}
                          </TableCell>
                        )}
                      </TableRow>
                    ))}
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
              "linear-gradient(135deg, #344dcc 0%, #000000 50%, #344dcc 100%)",
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
