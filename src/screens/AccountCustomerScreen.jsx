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
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { Store } from '../Store';
import { getError, API } from '../utils';
import Modal from 'react-bootstrap/Modal';
import InvoiceListChaNum from './InvoiceListChaNum';

const reducer = (state, action) => {
  switch (action.type) {
    case 'TOTAL_FETCH_REQUEST':
      return { ...state, loading: true };
    case 'TOTAL_FETCH_SUCCESS':
      return {
        ...state,
        invoicesTOT: action.payload,
        loading: false,
      };
    case 'TOTAL_FETCH_FAIL':
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
export default function AccountCustomerScreen() {
  const [
    {
      loading,
      error,
      invoicesTOT,
      loadingDelete,
      loadingUpdate,
      successDelete,
    },
    dispatch,
  ] = useReducer(reducer, {
    loading: true,
    error: '',
  });

  const navigate = useNavigate();

  const { state } = useContext(Store);
  const { userInfo } = state;

  const [total, setTotal] = useState(0);
  const [show, setShow] = useState(false);
  const [invoice, setInvoice] = useState('');
  const [invoices, setInvoices] = useState([]);

  const [invId, setInvId] = useState('');
  const [remNum, setRemNum] = useState('');
  const [invNum, setInvNum] = useState('');
  const [ordNum, setOrdNum] = useState('');
  const [invDat, setInvDat] = useState('');

  const params = useParams();
  const { id: custId } = params;

  const fech1 = userInfo.filtro.firstDat;
  const fech2 = userInfo.filtro.lastDat;
  const codCom = userInfo.filtro.codCom;
  const codCon = userInfo.filtro.codCon;
  const codCus = userInfo.filtro.codCus;
  const codSup = userInfo.filtro.codSup;
  const codPro = userInfo.filtro.codPro;
  const codVal = userInfo.filtro.codVal;
  const codCon2 = userInfo.filtro.codCon2;
  const codEnc = userInfo.filtro.codEnc;
  const codUse = userInfo.filtro.codUse;
  const order = userInfo.filtro.order;
  
 
  // const [id_config, setId_config] = useState(userInfo.codCon);
  // userInfo.filtro.codCon ? setId_config(userInfo.filtro.codCon) : setId_config(userInfo.codCon);



  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: 'TOTAL_FETCH_REQUEST' });
        // const { data } = await axios.get(`${API}/api/invoices/ctaS/${custId}?id_config=${id_config} `, {
           const { data } = await axios.get(`${API}/api/invoices/ctaS/${custId}?configuracion=${codCon}&order=${order}&fech1=${fech1}&fech2=${fech2}&usuario=${codUse}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: 'TOTAL_FETCH_SUCCESS', payload: data });
        // //        let kiki = data?.filter((data) => data.user === custId);
        // const sortedList = data.sort((a, b) => (a.docDat > b.docDat ? -1 : 0));
        // setInvoices(sortedList);
        setInvoices(data);
      } catch (err) {
        dispatch({
          type: 'TOTAL_FETCH_FAIL',
          payload: getError(err),
        });
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    calculatotal();
  }, [invoices]);

  const calculatotal = async () => {
    let sum = 0;
    invoices.forEach((invoice) => {
      invoice.orderItems
        ? (sum = sum - invoice.total)
        : (sum = sum + invoice.total);
    });

    setTotal(sum);
  };
  const handleConsultaRec = (receiptId) => {
    navigate(`/admin/invoicerRecCon/${receiptId}`);
  };



  const handleConsulta = (invoiceId) => {
    navigate(`/admin/invoicerCon/${invoiceId}`);
  };

  // const handleShow = (invoice) => {
  //   //setInvoices(invoice);
  //   //setShow(true);
  // };

  const aplyReceipt = async () => {};

  const payInvoice = async () => {};

  const noDelInvoice = async () => {
    if (
      window.confirm(
        'This Invoice have a Receipt, You Must delete the receipt Before'
      )
    ) {
    }
  };

  const deleteInvoice = async (invoice) => {
    if (invoice.recNum) {
      noDelInvoice();
    } else {
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
  };

  const deleteReceipt = async (invoice) => {
    if (invoice.recNum) {
      noDelInvoice();
    } else {
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
          toast.success('Receipt Applied successfully');
        } catch (err) {
          toast.error(getError(error));
          dispatch({
            type: 'UPDATE_FAIL',
          });
        }
      }
    }
  };
  const parametros = async () => {
    navigate(`/admin/filtros?redirect=/admin/customer/cta/${custId}`);
  };

  const createHandler = async () => {
    navigate(`/admin/customers`);
  };

  return (
    <div>
      <Helmet>
        <title>Cuenta</title>
      </Helmet>
      <Row>
        <Col md={5}>
          <h1>Cuenta Clientes</h1>
        </Col>
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

        <Col md={3}>
          <h3>           Saldo: ${total.toFixed(2)}</h3>
        </Col>
        <Col  className="col text-end">
          <div>
            <Button type="button" onClick={createHandler}>
              Seleccione otro Cliente
              
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
                <th className="text-center">DOCUMENTO</th>
                <th className="text-center">NUMERO</th>
                <th className="text-center">TOTAL</th>
                <th className="text-end">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {invoices?.map((invoice) => (
                <tr key={invoice._id}>
                  <td className="text-center">{invoice.docDat ? invoice.docDat.substring(0, 10): '' }</td>
                  {invoice.orderItems ? <td>Factura</td> : <td>Recibo</td>}
                  {invoice.orderItems ? (
                    <td className="text-end">{invoice.invNum ? invoice.invNum : 'REMITO S/F'}</td>
                  ) : (
                    <td className="text-end">{invoice.recNum}</td>
                  )}


                  <td className="text-end">{invoice.total.toFixed(2)}</td>

                  <td className="text-end">
                    {/* {invoice.orderItems ? (
                      <Button
                        type="button"
                        title="Print Invoice"
                        onClick={() => {
                          navigate(`/invoice/${invoice._id}`);
                        }}
                      >
                        <AiFillPrinter className="text-black-500 font-bold text-xl" />
                      </Button>
                    ) : (
                      <Button
                        type="button"
                        title="Print Receipt"
                        onClick={() => {
                          navigate(`/invoice/${invoice._id}`);
                        }}
                      >
                        <AiFillPrinter className="text-black-500 font-bold text-xl" />
                      </Button>
                    )} */}
                    {/* &nbsp;
                    {invoice.orderItems ? (
                      <Button
                        type="button"
                        title="Send Email Invoice"
                        onClick={() => {
                          navigate(`/invoice/${invoice._id}`);
                        }}
                      >
                        <AiOutlineMail className="text-black-500 font-bold text-xl" />
                      </Button>
                    ) : (
                      <Button
                        type="button"
                        title="Send Email Receipt"
                        onClick={() => {
                          navigate(`/invoice/${invoice._id}`);
                        }}
                      >
                        <AiOutlineMail className="text-black-500 font-bold text-xl" />
                      </Button>
                    )} */}
                    &nbsp;
                    {invoice.orderItems ? (
                      <Button
                        type="button"
                        title="Consulta Factura/Remito"
                        // onClick={() => handleShow(invoice)}
                        onClick={() => handleConsulta(invoice._id)}
                        >
                        <AiOutlineEdit className="text-blue-500 font-bold text-xl" />
                      </Button>
                    ) : (
                      <Button
                        type="button"
                        title="Consulta Recibo"
                        onClick={() => handleConsultaRec(invoice._id)}
                        >
                        <AiOutlineEdit className="text-blue-500 font-bold text-xl" />
                      </Button>
                    )}
                    &nbsp;
                    {/* {invoice.orderItems ? (
                      <Button
                        type="button"
                        title="Pay Invoice"
                        onClick={() => payInvoice(invoice)}
                      >
                        <AiOutlineEdit className="text-blue-500 font-bold text-xl" />
                      </Button>
                    ) : (
                      <Button
                        type="button"
                        title="Aply Invoice "
                        onClick={() => aplyReceipt(invoice)}
                      >
                        <AiOutlineEdit className="text-blue-500 font-bold text-xl" />
                      </Button>
                    )} */}
                    &nbsp;
                    {invoice.orderItems ? (
                      <Button
                        type="button"
                        title="Delete Invoice"
                        onClick={() => deleteInvoice(invoice)}
                        disabled={true}
                      >
                        <AiOutlineDelete className="text-red-500 font-bold text-xl" />
                      </Button>
                    ) : (
                      <Button
                        type="button"
                        title="Delete Receipt"
                        onClick={() => deleteReceipt(invoice)}
                        disabled={true}
                      >
                        <AiOutlineDelete className="text-red-500 font-bold text-xl" />
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
