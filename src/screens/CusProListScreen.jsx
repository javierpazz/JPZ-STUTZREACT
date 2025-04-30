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
import exportToExcel from '../components/ExportToExcel';

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
export default function CusProListScreen() {
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


  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        // const { data } = await axios.get(`${API}/api/receipts/cajaS?page=${page}&id_config=${id_config} `, {
        //   headers: { Authorization: `Bearer ${userInfo.token}` },
        // });
        // const { data } = await axios.get(`${API}/api/receipts/searchingegrSB?fech1=${fech1}&fech2=${fech2}&configuracion=${codCon}&usuario=${codUse}&encargado=${codEnc}`,{
           const { data } = await axios.get(`${API}/api/invoices/cuspro/?configuracion=${codCon}&order=${order}&fech1=${fech1}&fech2=${fech2}&usuario=${codUse}&customer=${codCus}&producto=${codPro}`, {
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



  const saldoTotalGeneral = cuentas.reduce(
    (acc, cliente) => acc + cliente.saldoTotal,
    0
  );
  



  const parametros = async () => {
    navigate('/admin/filtros?redirect=/admin/informe/cuspro');
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
              onClick={() => exportToExcel(cuentas)}>
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
        <h1 className="text-2xl font-bold mb-4">Clientes - Productos Vendidos</h1>
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
                {cuentas.map((client) => (
                <div key={client.clientId} style={{ marginBottom: '30px' }}>
                    <h2 style={{ fontWeight: 'bold', marginBottom: '10px' }}>
                    {client.clientcodCus || 'Sin Codigo'} -  {client.clientNameCus || 'Sin Nombre'}
                    </h2>
                    <thead>
                          <tr className="bg-gray-100">
                            <th className="p-2 border">Producto</th>
                            <th className="p-2 border" >--------------- </th>
                            <th className="p-2 border">Cant.Vendida</th>
                            <th className="p-2 border">Importe sin IVA</th>
                            <th className="p-2 border">Cant.Comprada</th>
                            <th className="p-2 border">Importe sin IVA</th>
                            <th className="p-2 border">Diferencia</th>
                            <th className="p-2 border">Ganancia</th>
                          </tr>
                        </thead>
                <tbody>
                        {client.products.map((product, index) => (
                    // <div key={index} style={{ marginLeft: '20px', marginBottom: '5px' }}>
                    //     {product.totalQuantity.toFixed(2)} {product.title}  ➔ Total Sin IVA  ${product.totalAmount.toFixed(2)}
                    // </div>

                    <tr key={index} className="hover:bg-gray-50">
                    <td className="border" colSpan={2}>{product.title}</td>
                    <td className="border text-end" >{product.totalQuantity.toFixed(2)}</td>
                    <td className="border text-end" >{product.totalAmount.toFixed(2)}</td>
                  </tr>
      
                  ))}
                </tbody>
                <tfoot>
                    <tr className="bg-gray-100 font-bold">
                      <td className="border"  colSpan={3}>TOTAL {client.clientNameCus}</td>
                      <td className="border text-end" >${client.totalAmountClient.toFixed(2)}</td>
                    </tr>
                  </tfoot>
                  </div>
                ))}
            </div>
        </div>
      </div>
    );
  };


