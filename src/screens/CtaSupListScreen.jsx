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
export default function CtaSupListScreen() {
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
           const { data } = await axios.get(`${API}/api/invoices/ctasup/?configuracion=${codCon}&order=${order}&fech1=${fech1}&fech2=${fech2}&usuario=${codUse}&supplier=${codSup}`, {
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
    navigate('/admin/filtros?redirect=/admin/informe/CtaSup');
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
                <Form.Check
            className="mb-3"
            type="checkbox"
            id="isDet"
            label="Detallado"
            checked={isDet}
            onChange={(e) => setIsDet(e.target.checked)}
            />
              </div>

        {/* Contenido que se imprime */}
        <div ref={printRef}>
        {(isDet) ? (
          <div className="p-4 space-y-10">
            <h1 className="text-2xl font-bold mb-6">
              Cuenta Corriente Proovedores - Total General: ${saldoTotalGeneral.toFixed(2)}
            </h1>
  
            {cuentas.map((cuenta) => (
              <div key={cuenta.id_client} className="border rounded-xl p-4 shadow-md">
                <h2 className="text-xl font-semibold text-blue-700 mb-4">
                  { `${cuenta.codSupp} - ${cuenta.nombreSupplier}`}
                </h2>
  
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="p-2 border">Fecha</th>
                      <th className="p-2 border">Comprobante</th>
                      <th className="p-2 border">Numero</th>
                      <th className="p-2 border">Usuario</th>
                      <th className="p-2 border">Pto.Venta</th>
                      <th className="p-2 border">Haber</th>
                      <th className="p-2 border">Debe</th>
                      <th className="p-2 border">Saldo Acumulado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cuenta.movimientos.map((mov, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="p-2 border">{mov.fecha.substring(0, 10)}</td>
                        <td className="p-2 border">{mov.compDes}</td>
                        <td className="p-2 border text-end">{mov.compNum}</td>
                        <td className="p-2 border">{mov.nameUse}</td>
                        <td className="p-2 border">{mov.nameCon}</td>
                        <td className="p-2 border text-end">${mov.total.toFixed(2)}</td>
                        <td className="p-2 border text-end">${mov.totalBuy.toFixed(2)}</td>
                        <td className="p-2 border text-end font-semibold">${mov.saldoAcumulado.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-gray-100 font-bold">
                      <td className="p-2 border" colSpan={7}>Saldo Total</td>
                      <td className="p-2 border text-end">${cuenta.saldoTotal.toFixed(2)}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            ))}
          </div>
            ) : (
              <div className="p-4 space-y-10">
              <h1 className="text-2xl font-bold mb-6">
                Cuenta Corriente Proovedores - Total General: ${saldoTotalGeneral.toFixed(2)}
              </h1>
    
              {cuentas.map((cuenta) => (
                <div key={cuenta.id_client} className="border rounded-xl p-4 shadow-md">
                  <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="p-2 border">Fecha</th>
                          <th className="p-2 border">Comprobante</th>
                          <th className="p-2 border">Numero</th>
                          <th className="p-2 border">Usuario</th>
                          <th className="p-2 border">Pto.Venta</th>
                          <th className="p-2 border">Haber</th>
                          <th className="p-2 border">Debe</th>
                          <th className="p-2 border">Saldo Acumulado</th>
                        </tr>
                      </thead>
                    <tfoot>
                      <tr className="bg-gray-100 font-bold">
                        <td className="p-2 border" colSpan={7}>{ `${cuenta.codSupp} - ${cuenta.nombreSupplier}`}
                        </td>
                        <td className="p-2 border text-end">${cuenta.saldoTotal.toFixed(2)}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              ))}
            </div>
       )}
        </div>
      </div>
    );
  };


