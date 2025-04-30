import axios from 'axios';
import React, { useContext, useEffect, useReducer, useRef, useState } from 'react';
import ReactToPrint from "react-to-print";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { toast } from 'react-toastify';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import {
  AiOutlineDelete,
  AiOutlineEdit,
  AiFillPrinter,
  AiOutlineMail,
} from 'react-icons/ai';

import { Helmet } from 'react-helmet-async';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { Store } from '../Store';
import { getError, API } from '../utils';
import SearchBox from '../components/SearchBox';
import Modal from 'react-bootstrap/Modal';
import InvoiceListApliRec from './../screens/InvoiceListApliRec';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_SUCCESS':
      return {
        ...state,
        receipts: action.payload.receipts,
        page: action.payload.page,
        pages: action.payload.pages,
        loading: false,
      };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    case 'DELETE_REQUEST':
      return { ...state, loadingDelete: true, successDelete: false };
    case 'DELETE_SUCCESS':
      return {
        ...state,
        loadingDelete: false,
        successDelete: true,
      };
    case 'DELETE_FAIL':
      return { ...state, loadingDelete: false };
    case 'DELETE_RESET':
      return { ...state, loadingDelete: false, successDelete: false };
    default:
      return state;
  }
};
export default function ProSupListScreen() {
  const [
    {
      loading,
      error,
      receipts,
      receiptsT,
      pages,
      loadingDelete,
      successDelete,
    },
    dispatch,
  ] = useReducer(reducer, {
    loading: true,
    error: '',
  });

  const navigate = useNavigate();
  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const page = sp.get('page') || 1;

  const { state } = useContext(Store);
  const { userInfo } = state;
  const [id_config, setId_config] = useState(userInfo.codCon);

  const [show, setShow] = useState(false);
  const [recNum, setRecNum] = useState('');
  const [recDat, setRecDat] = useState('');
  const [userId, setUserId] = useState('');
  const [isDet, setIsDet] = useState(true);

  
  const fech1 = userInfo.filtro.firstDat;
  const fech2 = userInfo.filtro.lastDat;
  const codCon = userInfo.filtro.codCon;
  const codCom = userInfo.filtro.codCom;
  const codCus = userInfo.filtro.codCus;
  const codSup = userInfo.filtro.codSup;
  const codPro = userInfo.filtro.codPro;
  const codVal = userInfo.filtro.codVal;
  const codCon2 = userInfo.filtro.codCon2;
  const codEnc = userInfo.filtro.codEnc;
  const codUse = userInfo.filtro.codUse;
  const order = userInfo.filtro.order;
  const [cuentas, setCuentas] = useState([]);


  const exportToExcel = () => {
    const worksheetData = [];

    reportData.forEach((product) => {
      worksheetData.push({ Producto: product._id });
      product.clients.forEach((client) => {
        worksheetData.push({
          Cliente: client.clientName,
          Cantidad: client.totalQuantity,
          Total: client.totalAmount.toFixed(2),
        });
      });
      worksheetData.push({
        Cliente: 'TOTAL',
        Cantidad: product.productTotalQuantity,
        Total: product.productTotalAmount.toFixed(2),
      });
      worksheetData.push({}); // Línea vacía
    });

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Reporte');

    XLSX.writeFile(workbook, 'reporte_productos_clientes.xlsx');
  };


  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        // const { data } = await axios.get(`${API}/api/receipts/cajaS?page=${page}&id_config=${id_config} `, {
        //   headers: { Authorization: `Bearer ${userInfo.token}` },
        // });
        // const { data } = await axios.get(`${API}/api/receipts/searchingegrSB?fech1=${fech1}&fech2=${fech2}&configuracion=${codCon}&usuario=${codUse}&encargado=${codEnc}`,{
           const { data } = await axios.get(`${API}/api/invoices/prosup/?configuracion=${codCon}&order=${order}&fech1=${fech1}&fech2=${fech2}&usuario=${codUse}&supplier=${codSup}&producto=${codPro}`, {
                headers: { Authorization: `Bearer ${userInfo.token}` },
      });
        dispatch({ type: 'FETCH_SUCCESS', payload: data.resultado });
        setCuentas(data.resultado);
        console.log(data);
      } catch (err) {
        dispatch({
          type: 'FETCH_FAIL',
          payload: getError(err),
        });
      }
    };
    if (successDelete) {
      dispatch({ type: 'DELETE_RESET' });
    } else {
      fetchData();
    }
  }, [page, userInfo, successDelete]);






  const parametros = async () => {
    navigate('/admin/filtros?redirect=/admin/informe/prosup');
  };
   const printRef = useRef();
  
    return (
      <div className="p-1">
            {/* Botón para imprimir */}
            <div className="mb-1">
              <ReactToPrint
                trigger={() => (
                  <Button>
                    Imprimir o Descargar PDF
                  </Button>
                )}
                content={() => printRef.current}
                documentTitle="Informe_Caja"
                pageStyle="@page { size: auto; margin: 20mm; } body { font-family: Arial; }"
              />
            <Button
              onClick={() => {exportToExcel}}>
              Exportar a Excel
            </Button>
                <Button type="button"
                        variant="primary"
                        onClick={parametros}
                        >
                  Ver Filtros
                </Button>
              </div>

        {/* Contenido que se imprime */}
        <div ref={printRef}>

        <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Productos - Proovedores a los que Compramos</h1>

      {cuentas.map((product) => (
        <div key={product._id} className="mb-6  mt-6">
          <h2 className="text-xl font-semibold">{product._id}</h2>
          <thead>
                          <tr className="bg-gray-100">
                            <th className="p-2 border">Proovedor</th>
                            <th className="p-2 border" >--------------- </th>
                            <th className="p-2 border">Cant.Comprada</th>
                            <th className="p-2 border">Importe sin IVA</th>
                            <th className="p-2 border">Cant.Comprada</th>
                            <th className="p-2 border">Importe sin IVA</th>
                            <th className="p-2 border">Diferencia</th>
                            <th className="p-2 border">Ganancia</th>
                          </tr>
                        </thead>
          {/* <ul className="ml-6"> */}
          <tbody>
            {product.suppliers.map((supplier, idx) => (
              // <li key={idx}>
              //   {supplier.supplierName} ➔ {supplier.totalQuantity}  Comprado ➔ Total Sin IVA ${supplier.totalAmount.toFixed(2)}
              // </li>
              <tr key={idx} className="hover:bg-gray-50">
              <td className="border" colSpan={2}>{supplier.supplierName}</td>
              <td className="border text-end" >{supplier.totalQuantity.toFixed(2)}</td>
              <td className="border text-end" >{supplier.totalAmount.toFixed(2)}</td>
            </tr>

            ))}
              </tbody>

          {/* </ul> */}
          {/* <h2 className="text-xl font-semibold">TOTAL..:  {product.productTotalQuantity} {product._id} Comprado ➔ Total Sin IVA ${product.productTotalAmount.toFixed(2)}</h2> */}
          <tfoot>
            <tr className="bg-gray-100 font-bold">
              <td className="border" colSpan={2}>TOTAL {product._id}</td>
              {/* <td className="border" colSpan={1}>{product._id}</td> */}
              <td className="border text-end">{product.productTotalQuantity.toFixed(2)}</td>
              <td className="border text-end" >${product.productTotalAmount.toFixed(2)}</td>
            </tr>
          </tfoot>


        </div>
      ))}
        </div>

        </div>
      </div>
    );
  };

