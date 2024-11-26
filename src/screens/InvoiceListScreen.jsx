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
    case 'TOTAL_FETCH_REQUEST':
      return { ...state, loading: true };
    case 'TOTAL_FETCH_SUCCESS':
      return {
        ...state,
        invoicesT: action.payload,
        loading: false,
      };
    case 'TOTAL_FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };

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
  const [total, setTotal] = useState(0);
  const [show, setShow] = useState(false);
  const [invoice, setInvoice] = useState('');

  const [invId, setInvId] = useState('');
  const [name, setName] = useState('');
  const [remNum, setRemNum] = useState('');
  const [invNum, setInvNum] = useState('');
  const [ordNum, setOrdNum] = useState('');
  const [invDat, setInvDat] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: 'TOTAL_FETCH_REQUEST' });
        const { data } = await axios.get(`${API}/api/invoices/S `, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: 'TOTAL_FETCH_SUCCESS', payload: data });
        calculatotal();
      } catch (err) {
        dispatch({
          type: 'TOTAL_FETCH_FAIL',
          payload: getError(err),
        });
      }
    };
    fetchData();
  }, [show]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`${API}/api/invoices/adminS?page=${page} `, {
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
  }, [page, userInfo, successDelete, show]);

  const handleShow = (invoice) => {
    setInvoice(invoice);
    setShow(true);
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
    if (
      window.confirm(
        'This Invoice have a Receipt, You Must delete the receipt Before'
      )
    ) {
    }
  };
  


  const deleteHandler = async (invoice) => {
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
            if (window.confirm('Are you sure to delete?')) {
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
                toast.success('Invoice deleted successfully');
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

  const createHandler = async () => {
    if (window.confirm('Are you sure to create?')) {
      navigate(`/admin/invoicer`);
    }
  };

  return (
    <div>
      <Helmet>
        <title>Sale Invoices</title>
      </Helmet>
      <Row>
        <Col>
          <h1>Sale Invoices</h1>
        </Col>
        <Col>
          <h3>
            Total: ${invoicesT?.reduce((a, c) => a + c.total * 1, 0)}
          </h3>
        </Col>
        <Col>
          <SearchBox />
        </Col>

        <Col className="col text-end">
          <div>
            <Button type="button" onClick={createHandler}>
              Create Sale Invoice
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
                <th>FACTURA</th>
                <th>FECHA</th>
                <th>REMITO</th>
                <th>PEDIDO</th>
                <th>RECIBO</th>
                <th>CLIENTE</th>
                <th>PAGOS</th>
                <th>FORMA PAGO</th>
                <th>TOTAL</th>
                <th>ACCIONES</th>
              </tr>
            </thead>
            <tbody>
              {invoices?.map((invoice) => (
                <tr key={invoice._id}>
                  <td>{invoice.invNum}</td>
                  <td>{invoice.invDat.substring(0, 10)}</td>
                  <td>{invoice.remNum}</td>
                  {invoice.ordYes === 'Y' ? <td>{invoice._id}</td> : <td></td>}
                  <td>{invoice.recNum}</td>
                  <td>{invoice.user ? invoice.user.name : 'DELETED USER'}</td>
                  <td>{invoice.recNum ? invoice.recDat : 'No'}</td>
                  <td>{invoice.desVal}</td>
                  <td>{invoice.total.toFixed(2)}</td>

                  <td>
                    <Button
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
                    &nbsp;
                    <Button
                      type="button"
                      title="Add or Change Invoice or Remit Number"
                      onClick={() => handleShow(invoice)}
                    >
                      <AiOutlineEdit className="text-blue-500 font-bold text-xl" />
                    </Button>
                    &nbsp;
                    <Button
                      type="button"
                      title="Delete"
                      onClick={() => deleteHandler(invoice)}
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
                to={`/admin/invoices?page=${x + 1}`}
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
                Change Remit Invoice Number of {invoice._id}
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
