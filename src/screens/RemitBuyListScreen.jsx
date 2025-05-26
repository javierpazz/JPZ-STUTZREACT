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
import InvoiceListChaNum from './InvoiceListChaNum';

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
    default:
      return state;
  }
};
export default function RemitBuyListScreen() {
  const [
    {
      loading,
      error,
      invoices,
      invoicesT,
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
        // const { data } = await axios.get(`${API}/api/invoices/remitB?page=${page}&id_config=${id_config} `, {
        //   headers: { Authorization: `Bearer ${userInfo.token}` },
        // });
        const { data } = await axios.get(`${API}/api/invoices/searchremB?page=${page}&order=${order}&fech1=${fech1}&fech2=${fech2}&configuracion=${codCon}&usuario=${codUse}&supplier=${codSup}`,{
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
  }, [page, userInfo, successDelete, show]);

  const handleShow = (invoice) => {
    setInvoice(invoice);
    setShow(true);
  };

  const handleConsulta = (invoiceId) => {
    // navigate(`/admin/invoicerBuyRemCon/${invoiceId}`);
    navigate(`/admin/invoicerBuyRemCon/${invoiceId}?redirect=/admin/remitsBuy`);  };

//do
const controlStockHandler = async (invoice) => {
  invoice.orderItems.map((item) => stockHandler({ item }));
};

const stockHandler = async (item) => {
try {
  dispatch({ type: 'CREATE_REQUEST' });
  await axios.put(
    `${API}/api/products/downstock/${item.item._id}`,
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
    if (
      window.confirm(
        'Este Remito tiene una Orden de Pago aplicada, debe eliminar la Orden para Hacerlo'
      )
    ) {
    }
  };


  const deleteHandler = async (invoice) => {
      if (window.confirm('Esta seguro de Borrar?')) {
    if (invoice.recNum) {
      noDelInvoice();
    } else {
      if (!invoice.invNum) {
        //do
      controlStockHandler(invoice);
      try {
        dispatch({ type: 'DELETE_REQUEST' });
        await axios.delete(`${API}/api/invoices/${invoice._id}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        toast.success('Remito Borrado');
        dispatch({ type: 'DELETE_SUCCESS' });
      } catch (err) {
        toast.error(getError(error));
        dispatch({
          type: 'DELETE_FAIL',
        });
      }
    }
      else {
              try {
                dispatch({ type: 'UPDATE_REQUEST' });
                await axios.put(
                  `${API}/api/invoices/${invoice._id}/deleteremit`,
                  {
                    remNum: null,
                    // invNum: null,
                  },
                  {
                    headers: { Authorization: `Bearer ${userInfo.token}` },
                  }
                );
                dispatch({ type: 'UPDATE_SUCCESS' });
                toast.success('Remito Borrado');
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
    invoicesT?.map((inv) => (tot = tot + inv.totalBuy));
    setTotal(tot);
  };

  const parametros = async () => {
    navigate('/admin/filtros?redirect=/admin/remitsBuy');
  };


  const createHandler = async () => {
      navigate(`/admin/remiterBuy`);
  };

  return (
    <div>
      <Helmet>
        <title>Remitos de Compra</title>
      </Helmet>
      <Row>
        <Col>
          <h1>Remitos de Compra</h1>
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
              Crea Remito de Compra
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
                <th className="text-center">FECHA</th>
                <th className="text-center">REMITO</th>
                <th className="text-center">COMPROBANTE</th>
                <th className="text-center">ORDEN</th>
                <th className="text-center">PROVEEDOR</th>
                <th className="text-center">PAGOS</th>
                <th className="text-center">FORMA PAGO</th>
                <th className="text-end">TOTAL</th>
                <th className="text-end">ACCIONES</th>
              </tr>
            </thead>
            <tbody>
              {invoices?.map((invoice) => (
                <tr key={invoice._id}>
                  <td className="text-center">{invoice.remDat.substring(0, 10)}</td>
                  <td className="text-end">{invoice.remNum}</td>
                  <td className="text-end">{invoice.invNum}</td>
                  <td className="text-end">{invoice.recNum}</td>
                  <td>
                    {invoice.supplier
                      ? invoice.supplier.name
                      : 'DELETED SUPPLIER'}
                  </td>
                  <td className="text-end">{invoice.recNum ? invoice.recDat.substring(0, 10) : 'No'}</td>
                  <td>{invoice.desVal}</td>
                  <td className="text-end">{invoice.totalBuy.toFixed(2)}</td>

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
                    </Button> */}
                    &nbsp;
                    <Button
                      type="button"
                      title="Consulta Remito"
                      onClick={() => handleConsulta(invoice._id)}
                    >
                      <AiOutlineEdit className="text-blue-500 font-bold text-xl" />
                    </Button>
                    {/* &nbsp;
                    <Button
                      type="button"
                      title="Add or Change Invoice or Remit Number"
                      onClick={() => handleShow(invoice._id)}
                    >
                      <AiOutlineEdit className="text-blue-500 font-bold text-xl" />
                    </Button> */}
                    &nbsp;
                    <Button
                      type="button"
                      title="Delete"
                      onClick={() => deleteHandler(invoice)}
                      // disabled={true}
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
                to={`/admin/remitsBuy?page=${x + 1}&id_config=${id_config}`}
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
                Change REmit Invoice Number of {invoice}
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
