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
import ProductSelector from '../../../screens/ProductSelector';


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
  porIva,
  setPorIva,
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
  const [id_config, setId_config] = useState(userInfo.codCon);

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
  const [productss, setProductss] = useState([]);
  const [productR, setProductR] = useState({});
  const [stock, setStock] = useState(0);
  const [miStock, setMiStock] = useState(0);
  const [showPro, setShowPro] = useState(false);
  const [codProd, setCodProd] = useState('');
  const [medPro, setMedPro] = useState('');

  useEffect(() => {
    input8Ref.current.focus()
    const fetchData = async () => {
      try {
        const { data } = await axios.get(`${API}/api/products/xpv?id_config=${id_config}`, {
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
  const unloadpayment = async () => {
    if (window.confirm('El Importe tiene que ser mayor a Cero')) {
    }
    };
    
    
  const addToCartHandler = async (itemInv) => {
    if (amount <= 0) {unloadpayment();} else {
    quantity = round2(quantity);
    amount = round2(amount);
    price = round2(price);
    porIva = round2(porIva);

    if (codPro && quantity > 0) {
      input8Ref.current.focus()
      ctxDispatch({
        type: 'INVOICE_ADD_ITEM',
        payload: { ...itemInv, quantity, amount, price, porIva},
      });
    }
  };
  };
  const removeItemHandler = (itemInv) => {
    input8Ref.current.focus()
    ctxDispatch({ type: 'INVOICE_REMOVE_ITEM', payload: itemInv });
  };

  // Edit function
  // const submitHandlerPro = async (e) => {
  //   e.preventDefault();
  //   setShowPro(false)
  //   input8Ref.current.focus()
  // };


  const searchProduct = (codPro) => {
    const productRow = productss.find((row) => row._id === codPro);
    setProductR(productRow);
    setCodPro(productRow._id);
    setCodProd(productRow.codPro);
    setDesPro(productRow.title);
    setMedPro(productRow.medPro);
    setQuantity(1);
    setPrice(productRow.price);
    setPorIva(productRow.porIva);
    setAmount(productRow.price);
    setStock(productRow.inStock);
    setMiStock(productRow.minStock);
  };


  const ayudaPro = (e) => {
    e.key === "Enter" && buscarPorCodPro(codProd);
    e.key === "F2" && handleShowPro(codPro);
  };
  

  const buscarPorCodPro = (codProd) => {
    if (codProd==='') {
      input0Ref.current.focus();
    } else {
    const productRow = productss.find((row) => (row.codPro === codProd || row.codigoPro === codProd));

    if (!productRow) {
        setCodPro('');
        setCodProd('');
        setDesPro('Elija un Producto');
        setMedPro('');
        setQuantity(0);
        setPrice(0);
        setPorIva(0);
        setAmount(0);
        setStock(0);
        setProductR({});
        setMiStock(0);
      }else{
        setProductR(productRow);
        setCodPro(productRow._id);
        setCodProd(productRow.codProd);
        setDesPro(productRow.title);
        setMedPro(productRow.medPro);
        setQuantity(1);
        setPrice(productRow.price);
        setPorIva(productRow.porIva);
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
      setQuantity(e.target.value);
      toast.error('Este Producto no tiene stock');
    }
    if (stock-e.target.value <= miStock) {
      setQuantity(e.target.value);
      toast.error('Este Producto tiene Minimo Stock');
    }
  };

  const handleChange = (e) => {
    searchProduct(e.target.value);
  };

  // const handleShowPro = () => {
  //   setShowPro(true);
  //   input22Ref.current.focus();
  // };

  const handleShowPro = () => {
    // setShowSup(true);
    setModalOpen(true)
    input22Ref.current.focus();
  };

  const submitHandlerPro = async (e) => {
    e.preventDefault();
    setShowPro(false)
    input8Ref.current.focus()
  };

  const handleChangePro = (e) => {
    searchPro(e.target.value);
  };


  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const modalRef = useRef(null);

  const handleSelect = (product) => {
    setSelectedProduct(product);

    setCodPro(product._id);
    setCodProd(product.codigoPro);
    setDesPro(product.title);
    input8Ref.current.focus()

    setModalOpen(false);
  };

  // Cerrar con Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setModalOpen(false);
      }
    };

    if (modalOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [modalOpen]);

  // Cerrar al hacer clic fuera del modal
  const handleClickOutside = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      setModalOpen(false);
    }
  };

  useEffect(() => {
    if (modalOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [modalOpen]);




  return (
    <>
      <ToastContainer position="top-right" theme="colored" />

      <div className="bordeTable">
        <form>
          <Row>
            <Col md={1}>
              <Card.Body>
                <Card.Title>
                  <Form.Group className="input" controlId="name">
                    <Form.Label>Producto Codigo</Form.Label>
                    <Form.Control
                      className="input"
                      ref={input8Ref}
                      placeholder="Codigo Producto"
                      value={codProd}
                      onChange={(e) => setCodProd(e.target.value)}
                      // onKeyDown={(e) => e.key === "Enter" && buscarPorCodPro(codProd)}
                      onKeyDown={(e) => ayudaPro(e)}
                      // disabled={isPaying}
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
                          <Form.Label>Producto</Form.Label>
                          <h3>{desPro}</h3>
                        </Form.Group>
                      </Card.Title>
                    </Card.Body>
                  </Col>


            <Col md={1}>
              <Card.Body>
                <Card.Title>
                  <Form.Group className="input" controlId="name">
                    <Form.Label>Cantidad</Form.Label>
                    <Form.Control
                      className="input"
                      type="number"
                      ref={input9Ref}
                      placeholder="Cantidad"
                      value={quantity}
                      onChange={(e) => stockControl(e)}
                      onKeyDown={(e) => e.key === "Enter" && input10Ref.current.focus()}
                      // disabled={isPaying}
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
                          <Form.Label>Medida</Form.Label>
                          <h3>{medPro}</h3>
                        </Form.Group>
                      </Card.Title>
                    </Card.Body>
                  </Col>

            <Col md={1}>
              <Card.Body>
                <Card.Title>
                  <Form.Group className="input" controlId="name">
                    <Form.Label>Precio</Form.Label>
                    <Form.Control
                      className="input"
                      ref={input10Ref}
                      type="number"
                      placeholder="Precio"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && input11Ref.current.focus()}
                      // disabled={isPaying}
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
                    <Form.Label>Total</Form.Label>
                    <p>{amount.toFixed(2)}</p>
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
                      // disabled={isPaying}
                    >
                      {isEditing ? 'Editing Row Item' : 'Agrega'}
                    </Button>
                  </Form.Group>
                </Card.Title>
              </Card.Body>
            </Col>

          </Row>
        </form>
      {modalOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            zIndex: 1000
          }}
        >
          <div
            ref={modalRef}
            style={{
              backgroundColor: '#fff',
              width: '400px',
              borderRadius: '8px',
              boxShadow: '0 0 10px rgba(0,0,0,0.3)'
            }}
          >
            <div style={{ padding: '10px', borderBottom: '1px solid #ccc', textAlign: 'right' }}>
              <button onClick={() => setModalOpen(false)} style={{ fontWeight: 'bold' }}>X</button>
            </div>
            <ProductSelector  onSelect={handleSelect} productss={productss}  />
          </div>
        </div>
      )}
        
      </div>
      {/* Table items */}

      <table width="100%" className="mb-10">
        <thead>
          <tr className="bg-gray-100 p-1">
            <td className="font-bold">Codigo Producto </td>
            <td className="font-bold">Descripcion Producto </td>
            <td className="font-bold">Candidad</td>
            <td className="font-bold">Unidad</td>
            <td className="font-bold">Precio</td>
            <td className="font-bold">Total</td>
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
                <td>{itemInv.medPro}</td>
                <td>{itemInv.price}</td>
                <td className="amount">{(itemInv.quantity * itemInv.price).toFixed(2)}</td>
                <td>
                  <Button
                    className="mt-0 mb-0 bg-yellow-300 text-black py-1 px-1 rounded shadow border-2 border-yellow-300 hover:bg-transparent hover:text-blue-500 transition-all duration-300"
                    onClick={() => removeItemHandler(itemInv)}
                    // disabled={isPaying}
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
