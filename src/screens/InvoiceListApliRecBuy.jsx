import axios from 'axios';
import React, { useContext, useEffect, useReducer, useState } from 'react';
import { toast } from 'react-toastify';
import Button from 'react-bootstrap/Button';

import { Helmet } from 'react-helmet-async';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { Store } from '../Store';
import { getError, API } from '../utils';

const reducer = (state, action) => {
  switch (action.type) {
    case 'TOTAL_FETCH_REQUEST':
      return { ...state, loading: true };
    case 'TOTAL_FETCH_SUCCESS':
      return {
        ...state,
        invoices: action.payload,
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
export default function InvoiceListApliRec({
  recNum,
  recDat,
  suppId,
  show,
  setShow,
}) {
  //const recNum = { props.recNum };
  const [{ loading, error, invoices, loadingDelete }, dispatch] = useReducer(
    reducer,
    {
      loading: true,
      error: '',
    }
  );

  const { state } = useContext(Store);
  const { userInfo } = state;
  const [total, setTotal] = useState(0);
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
        const { data } = await axios.get(`${API}/api/invoices/BtoAply/${suppId} `, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: 'TOTAL_FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({
          type: 'TOTAL_FETCH_FAIL',
          payload: getError(err),
        });
      }
    };
    fetchData();
  }, []);

  const selectHandle = (invoice) => {
    setInvId(invoice._id);
    setTotal(invoice.total);
    setName(invoice.supplier.name);
    setRemNum(invoice.remNum);
    setOrdNum(invoice.ordNum);
    setInvNum(invoice.invNum);
    setInvDat(invoice.invDat);
  };

  const applyHandler = () => {
    if (window.confirm('Are you sure to Apply?')) {
      applyReceipt(invId);
      setShow(false);

      //navigate(`/admin/invoicesRec`);
    }
  };

  const applyReceipt = async (invId) => {
    try {
      //          dispatch({ type: 'UPDATE_REQUEST' });
      await axios.put(
        `${API}/api/invoices/${invId}/applyrecbuy`,
        {
          recNum: recNum,
          recDat: recDat,
        },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      //          dispatch({type: 'UPDATE_SUCCESS' });
      toast.success('Receipt Applied successfully');
      //          navigate('/admin/products');
    } catch (err) {
      toast.error(getError(err));
      //          dispatch({ type: 'UPDATE_FAIL' });
    }
  };

  return (
    <div>
      <Helmet>
        <title>Sale Invoices</title>
      </Helmet>
      <Row>
        <Col md={1}>
          <Card.Body>
            <Card.Title>
              <Form.Group className="input">
                <Form.Label>Invoice N°</Form.Label>
                <p>{invNum}</p>
              </Form.Group>
            </Card.Title>
          </Card.Body>
        </Col>
        <Col md={1}>
          <Card.Body>
            <Card.Title>
              <Form.Group className="input">
                <Form.Label>Invoice Date</Form.Label>
                <p>{invDat}</p>
              </Form.Group>
            </Card.Title>
          </Card.Body>
        </Col>
        <Col md={1}>
          <Card.Body>
            <Card.Title>
              <Form.Group className="input">
                <Form.Label>Remit N°</Form.Label>
                <p>{remNum}</p>
              </Form.Group>
            </Card.Title>
          </Card.Body>
        </Col>
        <Col md={1}>
          <Card.Body>
            <Card.Title>
              <Form.Group className="input">
                <Form.Label>Order</Form.Label>
                <p>{ordNum}</p>
              </Form.Group>
            </Card.Title>
          </Card.Body>
        </Col>
        <Col md={1}>
          <Card.Body>
            <Card.Title>
              <Form.Group className="input">
                <Form.Label>Client</Form.Label>
                <p>{name}</p>
              </Form.Group>
            </Card.Title>
          </Card.Body>
        </Col>
        <Col md={1}>
          <Card.Body>
            <Card.Title>
              <Form.Group className="input">
                <Form.Label>Amount</Form.Label>
                <p>{total}</p>
              </Form.Group>
            </Card.Title>
          </Card.Body>
        </Col>
        <Col md={1} className="col text-end">
          <div>
            <Button type="button" onClick={() => setShow(false)}>
              Cancel
            </Button>
          </div>
        </Col>

        <Col md={1} className="col text-end">
          <div>
            <Button
              type="button"
              onClick={applyHandler}
              disabled={!total || !invNum}
            >
              Apply
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
                <th>PAGADA</th>
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
                  <td>{invoice.ordNum}</td>
                  <td>{invoice.recNum}</td>
                  <td>
                    {invoice.supplier
                      ? invoice.supplier.name
                      : 'DELETED SUPPLIER'}
                  </td>
                  <td>
                    {invoice.isPaid ? invoice.paidAt.substring(0, 10) : 'No'}
                  </td>
                  <td>{invoice.desVal}</td>
                  <td>{invoice.total.toFixed(2)}</td>

                  <td>
                    <Col md={2}>
                      <Button
                        type="button"
                        onClick={() => {
                          selectHandle(invoice);
                        }}
                      >
                        Select
                      </Button>
                    </Col>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}
