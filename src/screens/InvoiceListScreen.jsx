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
import InvoiceListChaNum from './../screens/InvoiceListChaNum';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        invoices: action.payload.invoices,
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
    case 'UPDATE_REQUEST':
      return { ...state, loadingUpdate: true };
    case 'UPDATE_SUCCESS':
      return { ...state, loadingUpdate: false };
    case 'UPDATE_FAIL':
      return { ...state, loadingUpdate: false };

    default:
      return state;
  }
};
export default function InvoiceListScreen() {
  const [
    {
      loading,
      error,
      invoices,
      invoicesT,
      pages,
      loadingUpdate,
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
  const [total, setTotal] = useState(0);
  const [show, setShow] = useState(false);
  const [invoice, setInvoice] = useState('');
  
  
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
        // const { data } = await axios.get(`${API}/api/invoices/adminS?page=${page}&id_config=${id_config} `, {
          const { data } = await axios.get(`${API}/api/invoices/searchinvS?page=${page}&order=${order}&fech1=${fech1}&fech2=${fech2}&configuracion=${codCon}&usuario=${codUse}&customer=${codCus}&comprobante=${codCom}`,{
            headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
        //        calculatotal();
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
  }, [page, userInfo, successDelete, show, order, page, codCus]);

  const handleShow = (invoice) => {
    setInvoice(invoice);
    setShow(true);
  };
  const handleConsulta = (invoiceId) => {
    // navigate(`/admin/invoicerCon/${invoiceId}`);
    navigate(`/admin/invoicerCon/${invoiceId}?redirect=/admin/invoices`);
  };

//do
const controlStockHandler = async (invoice) => {
  invoice.orderItems.map((item) => stockHandler({ item }));
};

const stockHandler = async (item) => {
try {
  dispatch({ type: 'CREATE_REQUEST' });
  await axios.put(
    `${API}/api/products/upstock/${item.item._id}`,
    {
      quantitys: item.item.quantity,
    },
    {
      headers: {
        authorization: `Bearer ${userInfo.token}`,
      },
    }
  );
  dispatch({ type: 'CREATE_SUCCESS' });
} catch (err) {
  dispatch({ type: 'CREATE_FAIL' });
  toast.error(getError(err));
}
};

//do



  const noDelInvoice = async () => {
    if (window.confirm('Este Comprobante tiene un Recibo, Debe primero eliminarlo para continuar'))
    {
    }
  };
  


  const deleteHandler = async (invoice) => {
    if (window.confirm('Esta seguro de Borrar?')) {
    if (invoice.recNum) {
      noDelInvoice();
    } else {
      if (!invoice.ordYes) {
        //do
        controlStockHandler(invoice);
        try {
          dispatch({ type: 'DELETE_REQUEST' });
          await axios.delete(`${API}/api/orders/${invoice._id}`, {
            headers: { Authorization: `Bearer ${userInfo.token}` },
          });
          toast.success('order deleted successfully');
          dispatch({ type: 'DELETE_SUCCESS' });
        } catch (err) {
          toast.error(getError(error));
          dispatch({
            type: 'DELETE_FAIL',
          });
        }

        //do
      }
      else {
              try {
                dispatch({ type: 'UPDATE_REQUEST' });
                await axios.put(
                  `${API}/api/invoices/${invoice._id}/deleteinvoice`,
                  {
                    remNum: null,
                    invNum: null,
                  },
                  {
                    headers: { Authorization: `Bearer ${userInfo.token}` },
                  }
                );
                dispatch({ type: 'UPDATE_SUCCESS' });
                toast.success('Factura Borrada');
              } catch (err) {
                toast.error(getError(error));
                dispatch({
                  type: 'UPDATE_FAIL',
                });
              }
            
          }
    }
  }
  };

  const calculatotal = () => {
    let tot = 0;
    invoicesT?.map((inv) => (tot = tot + inv.priceTotal));
    setTotal(tot);
  };

  const parametros = async () => {
    navigate('/admin/filtros?redirect=/admin/invoices');
  };
  const createHandler = async () => {
    navigate(`/admin/invoicer`);
};

  return (
    <div>
      <Helmet>
        <title>Comprobantes Venta</title>
      </Helmet>
      <Row>
        <Col>
          <h1>Comprobantes Venta</h1>
        </Col>
        {/* <ListGroup.Item>
                  <div className="d-grid">
                    <Button
                      type="button"
                      variant="primary"
                      onClick={checkoutHandler}
                    >
                      Filtros
                    </Button>
                  </div>
                </ListGroup.Item> */}

        {userInfo.isAdmin && (
        <Col className="col text-end">
          <div>
            <Button type="button"
                    variant="primary"
                    onClick={parametros}
                  >
              Ver Filtros
            </Button>
            </div>
        </Col>
        )}
        <Col className="col text-end">
          <div>
            <Button type="button" onClick={createHandler}>
              Crea Comprobante Venta
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
              <th className="text-center">COMPROBANTE</th>
                <th className="text-center">NUMERO</th>
                <th className="text-center">FECHA</th>
                <th className="text-center">REMITO</th>
                <th className="text-center">PEDIDO</th>
                <th className="text-center">RECIBO</th>
                <th className="text-center">CLIENTE</th>
                <th className="text-center">PAGOS</th>
                <th className="text-end">TOTAL</th>
                <th className="text-end">ACCIONES</th>
              </tr>
            </thead>
            <tbody>
              {invoices?.map((invoice) => (
                <tr key={invoice._id}>
                  <td >{invoice.codCom.nameCom}</td>
                  <td className="text-end">{invoice.invNum ? invoice.invNum : 'REMITO S/F'}</td>
                  <td className="text-center">{invoice.invDat ? invoice.invDat.substring(0, 10): ''}</td>
                  <td className="text-end">{invoice.remNum}</td>
                      {invoice.ordYes === 'Y' ? <td className="text-end">{invoice._id}</td> : <td></td>}
                  <td className="text-end">{invoice.recNum}</td>
                  <td>{invoice.id_client ? invoice.id_client.nameCus : 'CLIENTE BORRADO'}</td>
                  <td className="text-center">{invoice.recDat ? invoice.recDat.substring(0, 10) : 'No'}</td>
                  <td className="text-end">{invoice.total.toFixed(2)}</td>

                  <td className="text-end">
                    {/* <Button
                      type="button"
                      title="Imprimir"
                      onClick={() => {
                        navigate(`/invoice/${invoice._id}`);
                      }}
                    >
                      <AiFillPrinter className="text-black-500 font-bold text-xl" />
                    </Button>
                    &nbsp;
                    <Button
                      type="button"
                      title="Send Email"
                      onClick={() => {
                        navigate(`/invoice/${invoice._id}`);
                      }}
                    >
                      <AiOutlineMail className="text-black-500 font-bold text-xl" />
                    </Button>
                    &nbsp; */}
                    <Button
                      type="button"
                      title="Consulta Comprobante"
                      onClick={() => handleConsulta(invoice._id)}
                    >
                      <AiOutlineEdit className="text-blue-500 font-bold text-xl" />
                    </Button>
                    &nbsp;
                    <Button
                      type="button"
                      title="Agrega o Cambia Numero de Remito y/o Comprobante"
                      onClick={() => handleShow(invoice)}
                      disabled={!(invoice.codCom.interno)}
                    >
                      <AiOutlineEdit className="text-blue-500 font-bold text-xl" />
                    </Button>
                    &nbsp;
                    <Button
                      type="button"
                      title="Delete"
                      onClick={() => deleteHandler(invoice)}
                      disabled={true}
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
                to={`/admin/invoices?page=${x + 1}&id_config=${id_config}`}
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
                Cambia Numero de Remito y/o Comprobante {invoice.invNum}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <InvoiceListChaNum
                invoice={invoice}
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
