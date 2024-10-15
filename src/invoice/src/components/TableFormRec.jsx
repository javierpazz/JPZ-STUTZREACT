import React, { useContext, useState, useEffect, useReducer } from 'react';
import axios from 'axios';
import { AiOutlineDelete, AiOutlineEdit } from 'react-icons/ai';
// import { v4 as uuidv4 } from 'uuid';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Store } from '../../../Store';
import { getError, API } from '../../../utils';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        valuees: action.payload.valuees,
        page: action.payload.page,
        pages: action.payload.pages,
        loading: false,
      };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export default function TableFormRec({
  codVal,
  setCodVal,
  desval,
  setDesval,
  quantity,
  setQuantity,
  amountval,
  setAmountval,
  list,
  setList,
  total,
  setTotal,
}) {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    receipt: { receiptItems },
    userInfo,
  } = state;

  const [
    {
      loading,
      error,
      products,
      pages,
      loadingCreate,
      loadingDelete,
      successDelete,
    },
    dispatch,
  ] = useReducer(reducer, {
    loading: true,
    error: '',
  });

  const [isEditing, setIsEditing] = useState(false);
  const [valuees, setValuees] = useState([]);
  const [valueeR, setValueeR] = useState('');
  const [numval, setNumval] = useState(' ');
  const [stock, setStock] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(`${API}/api/valuees/`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        setValuees(data);
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {}
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (numval === '') {
      setNumval(' ');
    }
    setCodVal(codVal);
  }, [numval, codVal, amountval]);

  // Calculate items amountval function
  useEffect(() => {
    const calculateAmount = (amountval) => {};

    calculateAmount(amountval);
  }, [codVal, amountval]);

  // Submit form function
  const handleSubmit = (e) => {
    e.preventDefault();
    addToCartHandler();
  };

  const addToCartHandler = async (itemVal) => {
    if (codVal && amountval > 0) {
      ctxDispatch({
        type: 'RECEIPT_ADD_ITEM',
        payload: { ...itemVal, desval, amountval, numval },
      });
    }
  };

  const removeItemHandler = (itemVal) => {
    ctxDispatch({ type: 'RECEIPT_REMOVE_ITEM', payload: itemVal });
  };

  // Edit function

  const searchValuee = (codVal) => {
    const valueeR = valuees.find((row) => row._id === codVal);
    setValueeR(valueeR);
    setCodVal(valueeR._id);
    setDesval(valueeR.desVal);
  };

  const handleChange = (e) => {
    searchValuee(e.target.value);
  };

  return (
    <>
      <ToastContainer position="top-right" theme="colored" />

      <div className="bordeTable">
        <form>
          <Row>
            <Col md={2}>
              <Card.Body>
                <Card.Title>
                  <Form.Group className="input" controlId="name">
                    <Form.Label>Value Code</Form.Label>
                    <Form.Control
                      className="input"
                      placeholder="Value Code"
                      value={codVal}
                      onChange={(e) => setCodVal(e.target.value)}
                      required
                    />
                  </Form.Group>
                </Card.Title>
              </Card.Body>
            </Col>

            <Col md={5}>
              <Card.Body>
                <Card.Title>
                  <Card.Title>
                    <Form.Group className="input" controlId="name">
                      <Form.Label>Valuee Description</Form.Label>
                      <Form.Select
                        className="input"
                        onClick={(e) => handleChange(e)}
                      >
                        {valuees.map((elementoP) => (
                          <option key={elementoP._id} value={elementoP._id}>
                            {elementoP.desVal}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Card.Title>
                </Card.Title>
              </Card.Body>
            </Col>
            <Col md={2}>
              <Card.Body>
                <Card.Title>
                  <Form.Group className="input" controlId="name">
                    <Form.Label>Value Number</Form.Label>
                    <Form.Control
                      className="input"
                      placeholder="Value Number"
                      value={numval}
                      onChange={(e) => setNumval(e.target.value)}
                      required
                    />
                  </Form.Group>
                </Card.Title>
              </Card.Body>
            </Col>

            <Col md={1}>
              <Card.Body>
                <Card.Title>
                  <Form.Group className="input" controlId="amount">
                    <Form.Label>Amount</Form.Label>
                    <Form.Control
                      className="input"
                      placeholder="Amount"
                      value={amountval}
                      onChange={(e) => setAmountval(e.target.value)}
                      required
                    />
                  </Form.Group>
                </Card.Title>
              </Card.Body>
            </Col>

            <Col md={2}>
              <Card.Body>
                <Card.Title>
                  <Form.Group>
                    <Button
                      onClick={() => addToCartHandler(valueeR)}
                      className="mt-3 mb-1 bg-yellow-300 text-black py-1 px-1 rounded shadow border-2 border-yellow-300 hover:bg-transparent hover:text-blue-500 transition-all duration-300"
                      disabled={!codVal || !numval || !amountval}
                    >
                      {isEditing ? 'Editing Row Item' : 'Add Table Item'}
                    </Button>
                  </Form.Group>
                </Card.Title>
              </Card.Body>
            </Col>
          </Row>
        </form>
      </div>
      {/* Table items */}

      <table width="100%" className="mb-10">
        <thead>
          <tr className="bg-gray-100 p-1">
            <td className="font-bold">Value Code</td>
            <td className="font-bold">Value Description</td>
            <td className="font-bold">Value Number</td>
            <td className="font-bold">Amount</td>
            <td className="font-bold">Options</td>
          </tr>
        </thead>
        {receiptItems.map((itemVal) => (
          <React.Fragment key={itemVal._id}>
            <tbody>
              <tr className="h-10">
                <td>{itemVal._id}</td>
                <td>{itemVal.desval}</td>
                <td>{itemVal.numval}</td>
                <td>{itemVal.amountval}</td>
                <td>
                  <Button
                    className="mt-0 mb-0 bg-yellow-300 text-black py-1 px-1 rounded shadow border-2 border-yellow-300 hover:bg-transparent hover:text-blue-500 transition-all duration-300"
                    onClick={() => removeItemHandler(itemVal)}
                  >
                    <AiOutlineDelete className="text-red-500 font-bold text-xl" />
                  </Button>
                </td>
              </tr>
            </tbody>
          </React.Fragment>
        ))}
      </table>
    </>
  );
}
