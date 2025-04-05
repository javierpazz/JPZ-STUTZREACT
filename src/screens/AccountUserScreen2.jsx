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
import SearchBox from '../components/SearchBox';
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
    default:
      return state;
  }
};
export default function AccountUserScreen() {
  const [
    { loading, error, invoicesTOT, loadingDelete, successDelete },
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
  const { id: userId } = params;

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: 'TOTAL_FETCH_REQUEST' });
        const { data } = await axios.get(`${API}/api/invoices/ctaS/${userId} `, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: 'TOTAL_FETCH_SUCCESS', payload: data });
        //        let kiki = data?.filter((data) => data.user === userId);
        const sortedList = data.sort((a, b) => (a.docDat > b.docDat ? -1 : 0));
        setInvoices(sortedList);
        console.log(data);
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

  const handleShow = (invoice) => {
    //setInvoices(invoice);
    //setShow(true);
  };

  const deleteHandler = async (invoice) => {
    if (window.confirm('Are you sure to delete?')) {
      try {
        dispatch({ type: 'DELETE_REQUEST' });
        await axios.delete(`${API}/api/invoices/${invoice._id}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        toast.success('invoice deleted successfully');
        dispatch({ type: 'DELETE_SUCCESS' });
      } catch (err) {
        toast.error(getError(error));
        dispatch({
          type: 'DELETE_FAIL',
        });
      }
    }
  };

  const createHandler = async () => {
    navigate(`/admin/users`);
  };

  return (
    <div>
      <Helmet>
        <title>Sale Invoices</title>
      </Helmet>
      <Row>
        <Col>
          <h1>Account</h1>
        </Col>

        <Col>
          <h3>
            {total}
            Total: $
          </h3>
        </Col>
        <Col>
          <SearchBox />
        </Col>

        <Col className="col text-end">
          <div>
            <Button type="button" onClick={createHandler}>
              Select Other User
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
                <th>INVOICE</th>
                <th>Fecha Factura</th>
                <th>RECEIPT</th>
                <th>Fecha</th>
                <th>TOTAL</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {invoices?.map((invoice) => (
                <tr key={invoice._id}>
                  <td>{invoice.invNum}</td>
                  <td>{invoice.docDat}</td>
                  <td>{invoice.invDat}</td>
                  <td>{invoice.recNum}</td>
                  <td>{invoice.recDat}</td>
                  <td>{invoice.total.toFixed(2)}</td>

                  <td>
                    {invoice.orderItems ? (
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
                    )}
                    &nbsp;
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
                    )}
                    &nbsp;
                    {invoice.orderItems ? (
                      <Button
                        type="button"
                        title="Consult Invoice"
                        onClick={() => handleShow(invoice)}
                      >
                        <AiOutlineEdit className="text-blue-500 font-bold text-xl" />
                      </Button>
                    ) : (
                      <Button
                        type="button"
                        title="Consult Receipt"
                        onClick={() => handleShow(invoice)}
                      >
                        <AiOutlineEdit className="text-blue-500 font-bold text-xl" />
                      </Button>
                    )}
                    &nbsp;
                    {invoice.orderItems ? (
                      <Button
                        type="button"
                        title="Delete Invoice"
                        onClick={() => deleteHandler(invoice._id)}
                        //disabled={invoice.invNum < 40}
                      >
                        <AiOutlineDelete className="text-red-500 font-bold text-xl" />
                      </Button>
                    ) : (
                      <Button
                        type="button"
                        title="Delete Receipt"
                        onClick={() => deleteHandler(invoice._id)}
                        //disabled={invoice.invNum < 40}
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
