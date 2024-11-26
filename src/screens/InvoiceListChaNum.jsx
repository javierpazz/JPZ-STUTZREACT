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
export default function InvoiceListChaNum({ invoice, show, setShow }) {
  const { state } = useContext(Store);
  const { userInfo } = state;
  const [total, setTotal] = useState(invoice.total);
  const [invId, setInvId] = useState(invoice._id);
  const [name, setName] = useState(invoice.user.name);
  const [remNum, setRemNum] = useState(invoice.remNum);
  const [invNum, setInvNum] = useState(invoice.invNum);
  const [remNumAux, setRemNumAux] = useState(invoice.remNum);
  const [invNumAux, setInvNumAux] = useState(invoice.invNum);
  const [invDat, setInvDat] = useState(invoice.invDat);
  const [staOrd, setStaOrd] = useState(invoice.staOrd);

  const LoadInvoice = (invoice) => {
    setInvId(invoice._id);
    setTotal(invoice.total);
    setName(invoice.user.name);
    setRemNumAux(invoice.remNum);
    setInvNumAux(invoice.invNum);
    setRemNum(invoice.remNum);
    setInvNum(invoice.invNum);
    setInvDat(invoice.invDat);
    setStaOrd(invoice.staOrd);
  };

  useEffect(() => {
    LoadInvoice(invoice);
    console.log(invoice);
    console.log(invoice.total);
  }, []);

  const applyHandler = () => {
    if (window.confirm('Are you sure to Change?')) {
      applyChange(invId);
      setShow(false);

      //navigate(`/admin/invoicesRec`);
    }
  };

  const applyChange = async (invoiceId) => {
    try {
      //          dispatch({ type: 'UPDATE_REQUEST' });
      await axios.put(
        `${API}/api/invoices/${invoiceId}/applycha`,
        {
          remNum: remNum,
          invNum: invNum,
          staOrd: staOrd,
        },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      //          dispatch({type: 'UPDATE_SUCCESS' });
      toast.success('Remit Invoice Number Changed successfully');
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

      <>
        <h1>{name}</h1>
        <Row>
          <Col md={1}>
            <Card.Body>
              <Card.Title>
                <Form.Group className="input">
                  <Form.Label>Invoice N°</Form.Label>
                  <p>{invNumAux}</p>
                </Form.Group>
              </Card.Title>
            </Card.Body>
          </Col>
          <Col md={2}>
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
                  <p>{remNumAux}</p>
                </Form.Group>
              </Card.Title>
            </Card.Body>
          </Col>
          <Col md={3}>
            <Card.Body>
              <Card.Title>
                <Form.Group className="input">
                  <Form.Label>Order</Form.Label>
                  <p>{invId}</p>
                </Form.Group>
              </Card.Title>
            </Card.Body>
          </Col>
          <Col md={3}>
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
        </Row>

        <h3>New Numbers</h3>
        <Row>
          <Col md={1}>
            <Card.Body>
              <Card.Title>
                <Form.Group className="input" controlId="name">
                  <Form.Label>Invoice N°</Form.Label>
                  <Form.Control
                    className="input"
                    placeholder="Invoice N°"
                    value={invNum}
                    onChange={(e) => setInvNum(e.target.value)}
                    required
                  />
                </Form.Group>
              </Card.Title>
            </Card.Body>
          </Col>
          <Col md={2}>
            <Card.Body>
              <Card.Title>
                <Form.Group className="input"></Form.Group>
              </Card.Title>
            </Card.Body>
          </Col>
          <Col md={1}>
            <Card.Body>
              <Card.Title>
                <Form.Group className="input" controlId="name">
                  <Form.Label>Remit N°</Form.Label>
                  <Form.Control
                    className="input"
                    placeholder="Remit N°"
                    value={remNum}
                    onChange={(e) => setRemNum(e.target.value)}
                    required
                  />
                </Form.Group>
              </Card.Title>
            </Card.Body>
          </Col>
          <Col md={5}>
            <Card.Body>
              <Card.Title>
                <Form.Group className="input"></Form.Group>
              </Card.Title>
            </Card.Body>
          </Col>

          <Col md={1} className="col text-end">
            <div>
              <Button
                type="button"
                onClick={() => setShow(false)}
                disable="false"
              >
                Cancel
              </Button>
            </div>
          </Col>
          <Col md={1} className="col text-end">
            <div>
              <Button type="button" onClick={applyHandler} disable="false">
                Change
              </Button>
            </div>
          </Col>
        </Row>
      </>
    </div>
  );
}
