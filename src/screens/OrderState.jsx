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
    case 'STATE_FETCH_REQUEST':
      return { ...state, loadingVal: true };
    case 'STATE_FETCH_SUCCESS':
      return {
        ...state,
        stateOrds: action.payload.stateOrds,
        pageVal: action.payload.page,
        pagesVal: action.payload.pages,
        loadingVal: false,
      };
    case 'STATE_FETCH_FAIL':
      return { ...state, loadingVal: false, error: action.payload };

    default:
      return state;
  }
};
export default function OrderState({ invoice, show, setShow }) {
  const [
    {
      loading,
      error,
      stateOrds,
      pages,
      loadingVal,
      loadingDelete,
      successDelete,
    },
    dispatch,
  ] = useReducer(reducer, {
    loading: true,
    loadingVal: true,
    error: '',
  });

  const { state } = useContext(Store);
  const { userInfo } = state;
  const [total, setTotal] = useState(invoice.total);
  const [invId, setInvId] = useState(invoice._id);
  const [name, setName] = useState(invoice.user.name);
  const [remNum, setRemNum] = useState(invoice.remNum);
  const [invNum, setInvNum] = useState(invoice.invNum);
  const [createdAt, setCreatedAt] = useState(invoice.createdAt);
  const [codSta, setCodSta] = useState('');
  const [desval, setDesval] = useState('');
  const [staOrd, setStaOrd] = useState(invoice.staOrd);
  const [staOrdAux, setStaOrdAux] = useState(invoice.staOrd);
  const [stateOrdss, setStateOrdss] = useState([]);
  const [stateOrdR, setStateOrdR] = useState('');

  const LoadInvoice = (invoice) => {
    setInvId(invoice._id);
    setTotal(invoice.total);
    setName(invoice.user.name);
    setRemNum(invoice.remNum);
    setInvNum(invoice.invNum);
    setCreatedAt(invoice.createdAt);
    setStaOrd(invoice.staOrd);
    setStaOrdAux(invoice.staOrd);
  };

  useEffect(() => {
    const fetchDataVal = async () => {
      try {
        const { data } = await axios.get(`${API}/api/stateOrds/`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        setStateOrdss(data);
        console.log(data);

        dispatch({ type: 'STATE_FETCH_SUCCESS', payload: data });
      } catch (err) {}
    };
    fetchDataVal();
  }, []);

  useEffect(() => {
    LoadInvoice(invoice);
  }, []);

  const stateHandler = () => {
    if (window.confirm('Are you sure to Change?')) {
      setStaOrdAux(staOrd);
      applyState(invId);
      setShow(false);

      //navigate(`/admin/invoicesRec`);
    }
  };

  const applyState = async (invoiceId) => {
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

  const searchValue = (codSta) => {
    const stateOrdRow = stateOrdss.find((row) => row._id === codSta);
    setStateOrdR(stateOrdRow);
    setCodSta(stateOrdRow._id);
    setStaOrd(stateOrdRow.name);
  };

  const handleValueChange = (e) => {
    searchValue(e.target.value);
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
                  <Form.Label>Factura N°</Form.Label>
                  <p>{invNum}</p>
                </Form.Group>
              </Card.Title>
            </Card.Body>
          </Col>
          <Col md={2}>
            <Card.Body>
              <Card.Title>
                <Form.Group className="input">
                  <Form.Label>Order Date</Form.Label>
                  <p>{createdAt}</p>
                </Form.Group>
              </Card.Title>
            </Card.Body>
          </Col>
          <Col md={1}>
            <Card.Body>
              <Card.Title>
                <Form.Group className="input">
                  <Form.Label>Remito N°</Form.Label>
                  <p>{remNum}</p>
                </Form.Group>
              </Card.Title>
            </Card.Body>
          </Col>
          <Col md={3}>
            <Card.Body>
              <Card.Title>
                <Form.Group className="input">
                  <Form.Label>Order State</Form.Label>
                  <p>{staOrdAux}</p>
                </Form.Group>
              </Card.Title>
            </Card.Body>
          </Col>
          <Col md={1}>
            <Card.Body>
              <Card.Title>
                <Form.Group className="input">
                  <Form.Label>Total</Form.Label>
                  <p>{total}</p>
                </Form.Group>
              </Card.Title>
            </Card.Body>
          </Col>
        </Row>

        <h3>New State Order</h3>
        <Row>
          <Col md={4}>
            <Card.Body>
              <Card.Title>
                <Form.Group className="input"></Form.Group>
              </Card.Title>
            </Card.Body>
          </Col>

          <Col md={2}>
            <Card.Body>
              <Card.Title>
                <Form.Group className="input" controlId="name">
                  <Form.Label>State Orders</Form.Label>
                  <Form.Select
                    className="input"
                    onClick={(e) => handleValueChange(e)}
                  >
                    {stateOrdss.map((elementoV) => (
                      <option key={elementoV._id} value={elementoV._id}>
                        {elementoV.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Card.Title>
            </Card.Body>
          </Col>

          <Col md={3}>
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
              <Button type="button" onClick={stateHandler} disable="false">
                Change
              </Button>
            </div>
          </Col>
        </Row>
      </>
    </div>
  );
}
