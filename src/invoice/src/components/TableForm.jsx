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
import { API } from '../../../utils';


const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        products: action.payload.products,
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

export default function TableForm({
  input0Ref,
  input8Ref,
  codPro,
  setCodPro,
  desPro,
  setDesPro,
  quantity,
  setQuantity,
  price,
  setPrice,
  amount,
  setAmount,
  list,
  setList,
  total,
  setTotal,
  isPaying,
}) {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    invoice: { orderItems },
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

  const input9Ref = useRef(null);
  const input10Ref = useRef(null);
  const input11Ref = useRef(null);

  const [isEditing, setIsEditing] = useState(false);
  const [productss, setProductss] = useState([]);
  const [productR, setProductR] = useState({});
  const [stock, setStock] = useState(0);
  const [miStock, setMiStock] = useState(0);
  const [showPro, setShowPro] = useState(false);
  const [codProd, setCodProd] = useState('');

  useEffect(() => {
    input8Ref.current.focus()
    const fetchData = async () => {
      try {
        const { data } = await axios.get(`${API}/api/products/`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        setProductss(data);
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {}
    };
    fetchData();
  }, []);

  // Calculate items amount function
  useEffect(() => {
    const calculateAmount = (amount) => {
      setAmount(quantity * price);
    };

    calculateAmount(amount);
  }, [codPro, amount, price, quantity, setAmount]);

  // Submit form function
  const handleSubmit = (e) => {
    e.preventDefault();
    addToCartHandler();
  };

  const addToCartHandler = async (itemInv) => {
    if (codPro && quantity > 0) {
      input8Ref.current.focus()
      ctxDispatch({
        type: 'INVOICE_ADD_ITEM',
        payload: { ...itemInv, quantity, amount, price },
      });
    }
  };

  const removeItemHandler = (itemInv) => {
    input8Ref.current.focus()
    ctxDispatch({ type: 'INVOICE_REMOVE_ITEM', payload: itemInv });
  };

  // Edit function

  const searchProduct = (codPro) => {
    const productRow = productss.find((row) => row._id === codPro);
    setProductR(productRow);
    setCodPro(productRow._id);
    setCodProd(productRow.codPro);
    setDesPro(productRow.title);
    setQuantity(1);
    setPrice(productRow.price);
    setAmount(productRow.price);
    setStock(productRow.inStock);
    setMiStock(productRow.minStock);
  };

  const buscarPorCodPro = (codProd) => {
    if (codProd==='') {
      input0Ref.current.focus();
    } else {
    const productRow = productss.find((row) => row.codPro === codProd);

    if (!productRow) {
        setCodPro('');
        setCodProd('');
        setDesPro('Elija un Producto');
        setQuantity(0);
        setPrice(0);
        setAmount(0);
        setStock(0);
        setProductR({});
        setMiStock(0);
      }else{
        setProductR(productRow);
        setCodPro(productRow._id);
        setCodProd(productRow.codProd);
        setDesPro(productRow.title);
        setQuantity(1);
        setPrice(productRow.price);
        setAmount(productRow.price);
        setStock(productRow.inStock);
        setMiStock(productRow.minStock);
        input11Ref.current.focus()
        setCodProd('');
    };
  };
  };



  const stockControl = (e) => {
    if (e.target.value <= stock) {
      setQuantity(e.target.value);
    } else {
      toast.error('This Product does not have stock enough');
    }
    if (stock-e.target.value <= miStock) {
      setQuantity(e.target.value);
      toast.error('This Product has Minim Stock');
    }
  };

  const handleChange = (e) => {
    searchProduct(e.target.value);
  };

  const handleShowPro = () => {
    setShowPro(true);
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
                    <Form.Label>Product Code</Form.Label>
                    <Form.Control
                      className="input"
                      ref={input8Ref}
                      placeholder="Codigo Producto"
                      value={codProd}
                      onChange={(e) => setCodProd(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && buscarPorCodPro(codProd)}
                      disabled={isPaying}
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
                      onClick={() => handleShowPro()}
                      >
                      <BiFileFind className="text-blue-500 font-bold text-xl" />
                    </Button>
                  </Col>
                  <Col md={4}>
                    <Card.Body>
                      <Card.Title>
                        <Form.Group className="input">
                          <Form.Label>Product</Form.Label>
                          <h3>{desPro}</h3>
                        </Form.Group>
                      </Card.Title>
                    </Card.Body>
                  </Col>


            <Col md={1}>
              <Card.Body>
                <Card.Title>
                  <Form.Group className="input" controlId="name">
                    <Form.Label>Quantity</Form.Label>
                    <Form.Control
                      className="input"
                      ref={input9Ref}
                      placeholder="Quantity"
                      value={quantity}
                      onChange={(e) => stockControl(e)}
                      onKeyDown={(e) => e.key === "Enter" && input10Ref.current.focus()}
                      disabled={isPaying}
                      required
                    />
                  </Form.Group>
                </Card.Title>
              </Card.Body>
            </Col>

            <Col md={1}>
              <Card.Body>
                <Card.Title>
                  <Form.Group className="input" controlId="name">
                    <Form.Label>Price</Form.Label>
                    <Form.Control
                      className="input"
                      ref={input10Ref}
                      placeholder="Price"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && input11Ref.current.focus()}
                      disabled={isPaying}
                      required
                    />
                  </Form.Group>
                </Card.Title>
              </Card.Body>
            </Col>

            <Col md={1}>
              <Card.Body>
                <Card.Title>
                  <Form.Group className="input">
                    <Form.Label>Amount</Form.Label>
                    <h3>{amount}</h3>
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
                      onClick={() => addToCartHandler(productR)}
                      className="mt-3 mb-1 bg-yellow-300 text-black py-1 px-1 rounded shadow border-2 border-yellow-300 hover:bg-transparent hover:text-blue-500 transition-all duration-300"
                      disabled={isPaying}
                    >
                      {isEditing ? 'Editing Row Item' : 'Add Table Item'}
                    </Button>
                  </Form.Group>
                </Card.Title>
              </Card.Body>
            </Col>

          </Row>
        </form>
          <Modal
            size="md"
            show={showPro}
            onHide={() => setShowPro(false)}
            aria-labelledby="example-modal-sizes-title-lg"
          >
            <Modal.Header closeButton>
              <Modal.Title id="example-modal-sizes-title-lg">
              Elija un Producto
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <Col md={4}>
              <Card.Body>
                <Card.Title>
                  <Card.Title>
                    <Form.Group className="input" controlId="name">
                      <Form.Label>Product Description</Form.Label>
                      <Form.Select
                        className="input"
                        onClick={(e) => handleChange(e)}
                        disabled={isPaying}
                      >
                        {productss.map((elementoP) => (
                          <option key={elementoP._id} value={elementoP._id}>
                            {elementoP.title}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
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
            <td className="font-bold">Product Code</td>
            <td className="font-bold">Product Description</td>
            <td className="font-bold">Quantity</td>
            <td className="font-bold">Price</td>
            <td className="font-bold">Amount</td>
            <td className="font-bold">Options</td>
          </tr>
        </thead>
        {orderItems.map((itemInv) => (
          <React.Fragment key={itemInv._id}>
            <tbody>
              <tr className="h-10">
                <td>{itemInv._id}</td>
                <td>{itemInv.title}</td>
                <td>{itemInv.quantity}</td>
                <td>{itemInv.price}</td>
                <td className="amount">{itemInv.quantity * itemInv.price}</td>
                <td>
                  <Button
                    className="mt-0 mb-0 bg-yellow-300 text-black py-1 px-1 rounded shadow border-2 border-yellow-300 hover:bg-transparent hover:text-blue-500 transition-all duration-300"
                    onClick={() => removeItemHandler(itemInv)}
                    disabled={isPaying}
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
