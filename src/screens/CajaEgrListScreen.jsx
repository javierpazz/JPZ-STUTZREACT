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
export default function CajaEgrListScreen() {
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
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        // const { data } = await axios.get(`${API}/api/receipts/cajaB?page=${page}&id_config=${id_config} `, {
        //   headers: { Authorization: `Bearer ${userInfo.token}` },
        // });
        const { data } = await axios.get(`${API}/api/receipts/searchcajB?page=${page}&order=${order}&fech1=${fech1}&fech2=${fech2}&configuracion=${codCon}&usuario=${codUse}&encargado=${codEnc}`,{
          headers: { Authorization: `Bearer ${userInfo.token}` },
      });
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
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

  const handleShow = (receipt) => {
    setRecNum(receipt.recNum);
    setRecDat(receipt.recDat);
    setUserId(receipt.user._id);
    setShow(true);
  };

  const handleConsulta = (receiptId) => {
    // navigate(`/admin/invoicerCajEgrCon/${receiptId}`);
    navigate(`/admin/invoicerCajEgrCon/${receiptId}?redirect=/admin/invoicesCajEgr`);
  };


//dr



const prodeleteReceipt = (receipt) => {
  if (window.confirm('Are you sure to delete?')) {
      deleteReceipt(receipt);

    }
  };

  const deleteReceipt = async (receipt) => {
      // buscar todas loock at the invoices that have a receipt and modify de numRec by null
      try {
        dispatch({ type: 'DELETE_REQUEST' });
        await axios.delete(`${API}/api/receipts/${receipt._id}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        toast.success('receipt deleted successfully');
        dispatch({ type: 'DELETE_SUCCESS' });
      } catch (err) {
        toast.error(getError(error));
        dispatch({
          type: 'DELETE_FAIL',
        });
      }
  };

  const parametros = async () => {
    navigate('/admin/filtros?redirect=/admin/invoicesCajEgr');
  };


  const createHandler = async () => {
      navigate(`/admin/invoicerCajEgr`);
  };

  return (
    <div>
      <Helmet>
        <title>Retiro de Caja</title>
      </Helmet>
      <Row>
        <Col>
          <h1>Retiro de Caja</h1>
        </Col>
        {userInfo.isAdmin && (
          <Col className="col text-end">
          <div>
            <Button type="button"
                    variant="primary"
                    onClick={parametros}
                    disabled={!userInfo.isAdmin}
                    >
              Ver Filtros
            </Button>
            </div>
        </Col>
                  )}


        <Col className="col text-end">
          <div>
            <Button type="button" onClick={createHandler}>
              Crea Retiro de Caja
            </Button>
          </div>
        </Col>
      </Row>

      {loadingDelete && <LoadingBox></LoadingBox>}
      {loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <>
          <table className="table">
            <thead>
              <tr>
                <th className="text-center">Nro Comp</th>
                <th className="text-center">FECHA</th>
                <th className="text-center">ENCARGADO</th>
                <th className="text-center">VALOR</th>
                <th className="text-end">TOTAL</th>
                <th className="text-end">ACCIONES</th>
              </tr>
            </thead>
            <tbody>
              {receipts?.map((receipt) => (
                <tr key={receipt._id}>
                  <td className="text-end">{receipt.cajNum}</td>
                  <td className="text-center">{receipt.cajDat ? receipt.cajDat.substring(0, 10): ''}</td>
                  <td>{receipt.id_encarg ? receipt.id_encarg.name : ''}</td>
                  <td>{receipt.desval}</td>
                  <td className="text-end">{receipt.totalBuy.toFixed(2)}</td>

                  <td className="text-end">
                    {/* <Button
                      type="button"
                      title="Imprimir"
                      onClick={() => {
                        navigate(`/receipt/${receipt._id}`);
                      }}
                    >
                      <AiFillPrinter className="text-black-500 font-bold text-xl" />
                    </Button>
                    &nbsp;
                    <Button
                      type="button"
                      title="Send Email"
                      onClick={() => {
                        navigate(`/receipt/${receipt._id}`);
                      }}
                    >
                      <AiOutlineMail className="text-black-500 font-bold text-xl" />
                    </Button>
                    &nbsp; */}
                    <Button
                      type="button"
                      title="Consulta Retiro de Caja"
                      onClick={() => handleConsulta(receipt._id)}
                    >
                      <AiOutlineEdit className="text-blue-500 font-bold text-xl" />
                    </Button>
                    {/* <Button
                      type="button"
                      title="Apply Receipt to Invoice"
                      onClick={() => handleShow(receipt)}
                    >
                      <AiOutlineEdit className="text-blue-500 font-bold text-xl" />
                    </Button> */}
                    &nbsp;
                    <Button
                      type="button"
                      title="Delete"
                      onClick={() => prodeleteReceipt(receipt)}
                    >
                      <AiOutlineDelete className="text-red-500 font-bold text-xl" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div>
            {[...Array(pages).keys()].map((x) => (
              <Link
                className={x + 1 === Number(page) ? 'btn text-bold' : 'btn'}
                key={x + 1}
                to={`/admin/invoicesCajEgr?page=${x + 1}&id_config=${id_config}`}
              >
                {x + 1}
              </Link>
            ))}
          </div>
          <Modal
            size="xl"
            show={show}
            onHide={() => setShow(false)}
            aria-labelledby="example-modal-sizes-title-lg"
          >
            <Modal.Header closeButton>
              <Modal.Title id="example-modal-sizes-title-lg">
                Invoices To Apply Recibo N° {recNum}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <InvoiceListApliRec
                recNum={recNum}
                recDat={recDat}
                userId={userId}
                show={show}
                setShow={setShow}
              />
            </Modal.Body>
          </Modal>
        </>
      )}
    </div>
  );
}
