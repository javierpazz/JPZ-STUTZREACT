import axios from 'axios';
import React, { useContext, useEffect, useReducer, useState } from 'react';
import { toast } from 'react-toastify';
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
export default function CajaIngEgrListScreen() {
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
        const { data } = await axios.get(`${API}/api/receipts/searchcajSB?page=${page}&order=${order}&fech1=${fech1}&fech2=${fech2}&configuracion=${codCon}&usuario=${codUse}&encargado=${codEnc}`,{
          headers: { Authorization: `Bearer ${userInfo.token}` },
      });
        dispatch({ type: 'FETCH_SUCCESS', payload: data.resultado });
        setCuentas(data.resultado);
        console.log(cuentas);
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
    navigate('/admin/filtros?redirect=/admin/invoicesCajIngEgr');
  };

  return (
    <div className="p-4 space-y-10">
        <h1 className="text-2xl font-bold mb-6">Consulta Caja   Total General: ${saldoTotalGeneral.toFixed(2)}</h1>
      {cuentas.map((cuenta) => (
        <div key={cuenta.id_client} className="border rounded-xl p-4 shadow-md">
          <h2 className="text-xl font-semibold text-blue-700 mb-4">
            {cuenta.nombreCliente}
          </h2>

          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 border">Fecha</th>
                <th className="p-2 border">Ingresos</th>
                <th className="p-2 border">Egresos</th>
                {/* <th className="p-2 border">Saldo </th> */}
                <th className="p-2 border">Saldo Acumulado</th>
              </tr>
            </thead>
            <tbody>
              {cuenta.movimientos.map((mov, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="p-2 border">{new Date(mov.fecha).toLocaleDateString()}</td>
                  <td className="p-2 border">${mov.totalBuy.toFixed(2)}</td>
                  <td className="p-2 border">${mov.total.toFixed(2)}</td>
                  {/* <td className={`p-2 border ${mov.saldoMovimiento < 0 ? 'text-red-500' : 'text-green-600'}`}>
                    ${mov.saldoMovimiento.toFixed(2)}
                  </td> */}
                  <td className="p-2 border font-semibold">
                    ${mov.saldoAcumulado.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-gray-100 font-bold">
                <td className="p-2 border" colSpan={4}>Saldo Total</td>
                <td className="p-2 border">${cuenta.saldoTotal.toFixed(2)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      ))}


    </div>
  );

}
