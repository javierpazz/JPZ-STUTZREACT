import React, { useContext, useState, useRef, useEffect, useReducer } from 'react';
import axios from 'axios';
import { AiOutlineDelete, AiOutlineEdit } from 'react-icons/ai';
// import { v4 as uuidv4 } from 'uuid';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BiFileFind } from "react-icons/bi";
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
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

export default function TableFormRecCon({
  input0Ref,
  input8Ref,
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
  receiptItems,
}) {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
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

  const round2 = (num) => Math.round(num * 100 + Number.EPSILON) / 100; // 123.2345 => 123.23
  const input9Ref = useRef(null);
  const input10Ref = useRef(null);
  const input11Ref = useRef(null);
  const input22Ref = useRef(null);

  const [isEditing, setIsEditing] = useState(false);
  const [valuees, setValuees] = useState([]);
  const [valueeR, setValueeR] = useState({});
  const [numval, setNumval] = useState(' ');
  const [stock, setStock] = useState(0);
  const [showVal, setShowVal] = useState(false);
  const [codValo, setCodValo] = useState('');

  useEffect(() => {
    input8Ref.current.focus()
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
    amountval = round2(amountval);

    if (codVal && amountval > 0) {
      setCodValo('');
      setAmountval(0);
      setNumval('');
        input8Ref.current.focus()
      ctxDispatch({
        type: 'RECEIPT_ADD_ITEM',
        payload: { ...itemVal, desval, amountval, numval },
      });
    }
  };

  const removeItemHandler = (itemVal) => {
    input8Ref.current.focus()
    ctxDispatch({ type: 'RECEIPT_REMOVE_ITEM', payload: itemVal });
  };

  // Edit function
  const submitHandlerVal = async (e) => {
    e.preventDefault();
    setShowVal(false)
    input8Ref.current.focus()
  };


  const searchValuee = (codVal) => {
    const valueeR = valuees.find((row) => row._id === codVal);
    setAmountval(0);
    setNumval('');
    setValueeR(valueeR);
    setCodVal(valueeR._id);
    setCodValo(valueeR.codVal);
    setDesval(valueeR.desVal);
  };

  const ayudaVal = (e) => {
    e.key === "Enter" && buscarPorCodVal(codValo);
    e.key === "F2" && handleShowVal(codVal);
  };
  

  const buscarPorCodVal = (codValo) => {
    if (codValo==='') {
      input0Ref.current.focus();
    } else {
    const valueeR = valuees.find((row) => row.codVal === codValo);

    if (!valueeR) {
        setValueeR({});
        setCodVal('');
        setCodValo('');
        setDesval('Elija un Valor');
      }else{
        setAmountval(0);
        setNumval('');
        setValueeR(valueeR);
        setCodVal(valueeR._id);
        setCodValo(valueeR.codValo);
        setDesval(valueeR.desVal);
        input9Ref.current.focus()
    };
  };
  };



  const handleChange = (e) => {
    searchValuee(e.target.value);
  };
  const handleShowVal = () => {
    setShowVal(true);
    input22Ref.current.focus();
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
                    <Form.Label>Codigo Valor</Form.Label>
                    <Form.Control
                      className="input"
                      ref={input8Ref}
                      placeholder="Codigo Valor"
                      value={codValo}
                      onChange={(e) => setCodValo(e.target.value)}
                      // onKeyDown={(e) => e.key === "Enter" && buscarPorCodVal(codValo)}
                      onKeyDown={(e) => ayudaVal(e)}
                      required
                    />
                  </Form.Group>
                </Card.Title>
              </Card.Body>
            </Col>

            <Col md={1}>
                    <Button
                      className="mt-3 mb-1 bg-yellow-300 text-black py-1 px-1 rounded shadow border-2 border-yellow-300 hover:bg-transparent hover:text-blue-500 transition-all duration-300"
                      type="button"
                      title="Buscador"
                      onClick={() => handleShowVal()}
                      >
                      <BiFileFind className="text-blue-500 font-bold text-xl" />
                    </Button>
                  </Col>
                  <Col md={4}>
                    <Card.Body>
                      <Card.Title>
                        <Form.Group className="input">
                          <Form.Label>Product</Form.Label>
                          <h3>{desval}</h3>
                        </Form.Group>
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
                      ref={input9Ref}
                      placeholder="Value Number"
                      value={numval}
                      onChange={(e) => setNumval(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && input10Ref.current.focus()}
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
                    <Form.Label>Total</Form.Label>
                    <Form.Control
                      className="input"
                      ref={input10Ref}
                      placeholder="Total"
                      value={amountval}
                      onChange={(e) => setAmountval(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && input11Ref.current.focus()}
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
                      ref={input11Ref}
                      onClick={() => addToCartHandler(valueeR)}
                      className="mt-3 mb-1 bg-yellow-300 text-black py-1 px-1 rounded shadow border-2 border-yellow-300 hover:bg-transparent hover:text-blue-500 transition-all duration-300"
                      disabled={!codVal || !numval || !amountval}
                    >
                      {isEditing ? 'Editing Row Item' : 'Agrega'}
                    </Button>
                  </Form.Group>
                </Card.Title>
              </Card.Body>
            </Col>
          </Row>
        </form>

          <Modal
            // input22Ref={input22Ref}
            size="md"
            show={showVal}
            onHide={() => setShowVal(false)}
            aria-labelledby="example-modal-sizes-title-lg"
          >
            <Modal.Header closeButton>
              <Modal.Title id="example-modal-sizes-title-lg">
              Elija un Valor
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <Col md={12}>
              <Card.Body>
                <Card.Title>
                  <Card.Title>
                      <Form onSubmit={submitHandlerVal}>
                        <Form.Group className="mb-3" controlId="name">
                        {/* <Form.Group className="input" controlId="name"> */}
                         <Form.Label>Description de Valor</Form.Label>
                      <Form.Select
                        className="input"
                        onClick={(e) => handleChange(e)}
                        // disabled={isPaying}
                      >
                        {valuees.map((elementoP) => (
                          <option key={elementoP._id} value={elementoP._id}>
                            {elementoP.desVal}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="name">
                      <Form.Control
                        placeholder="Valor"
                        value={desval}
                        disabled={true}
                        required
                        />
                    </Form.Group>
                      <div className="mb-3">
                        <Button type="submit"
                          // ref={input22Ref}
                          disabled={desval ? false : true}
                          >Continuar</Button>
                      </div>
                      </Form>


                  </Card.Title>
                </Card.Title>
              </Card.Body>
            </Col>
            </Modal.Body>
          </Modal>


      </div>
      {/* Table items */}

      <table width="100%" className="mb-10">
        <thead>
          <tr className="bg-gray-100 p-1">
            <td className="font-bold">Value Code</td>
            <td className="font-bold">Value Description</td>
            <td className="font-bold">Value Number</td>
            <td className="font-bold">Total</td>
            <td className="font-bold">Options</td>
          </tr>
        </thead>
        {receiptItems?.map((itemVal) => (
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
