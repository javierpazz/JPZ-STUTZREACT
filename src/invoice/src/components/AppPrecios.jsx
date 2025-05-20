import { useContext, useState, useEffect, useReducer } from 'react';
import { useLocation, useNavigate  } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import ListGroup from 'react-bootstrap/ListGroup';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { BiFileFind } from "react-icons/bi";
import { Store } from '../../../Store';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { Helmet } from 'react-helmet-async';
import LoadingBox from '../../../components/LoadingBox';
import { getError, API } from '../../../utils';

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

        case 'SUPPLIER_FETCH_REQUEST':
            return { ...state, loading: true };
          case 'SUPPLIER_FETCH_SUCCESS':
            return {
              ...state,
              products: action.payload.products,
              page: action.payload.page,
              pages: action.payload.pages,
              loading: false,
            };
          case 'SUPPLIER_FETCH_FAIL':
            return { ...state, loading: false, error: action.payload };
      

        /////////////
    case 'VALUE_FETCH_REQUEST':
      return { ...state, loadingVal: true };
    case 'VALUE_FETCH_SUCCESS':
      return {
        ...state,
        values: action.payload.values,
        pageVal: action.payload.page,
        pagesVal: action.payload.pages,
        loadingVal: false,
      };
    case 'VALUE_FETCH_FAIL':
      return { ...state, loadingVal: false, error: action.payload };
    default:
      return state;
  }
};

function AppPrecios() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const redirectInUrl = new URLSearchParams(search).get('redirect');
  const redirect = redirectInUrl ? redirectInUrl : '/';
  const [category, setCategory] = useState('');


const [
    {
      loading,
      error,
      products,
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

  const { state, dispatch: ctxDispatch } = useContext(Store);

  const { userInfo } = state;


  const [codConNum, setCodConNum] = useState(userInfo.configurationObj.codCon);
  const [id_config, setId_config] = useState(userInfo.codCon);
  const [showPro1, setShowPro1] = useState(false);
  const [showPro2, setShowPro2] = useState(false);
  const [showSup, setShowSup] = useState(false);
  const [porcen, setPorcen] = useState('');

  // const [codUse, setomdUse] = useState('');
  const [codProd1, setCodProd1] = useState('');
  const [codPro1, setCodPro1] = useState('');
  const [codProd2, setCodProd2] = useState('');
  const [codPro2, setCodPro2] = useState('');
  const [desPro1, setDesPro1] = useState('');
  const [desPro2, setDesPro2] = useState('');
  const [productss, setProductss] = useState([]);
  const [productR, setProductR] = useState({});
  const [suppObj, setSuppObj] = useState({});
  const [codSup, setCodSup] = useState('');
  const [codSupp, setCodSupp] = useState('');
  const [nameSup, setNameSup] = useState('');
  const [suppliers, setSuppliers] = useState([]);
  
  const today = new Date().toISOString().split("T")[0];
  const [order, setOrder] = useState('newest');
  const [informe, setInforme] = useState('/admin/productsList');

  // const [userss, setUserss] = useState([]);
  const [width] = useState(641);
  const [showInvoice, setShowInvoice] = useState(false);

  const [isPaying, setIsPaying] = useState(false);

  const filtroCero = {
    codProd1 : '',
    desProd1 : 'Elija Producto',
    codProd2 : '',
    desProd2 : 'Elija Producto',
    order : 'newest',
  };



  const filtro = {
    codProd1 : codProd1,
    codProd2 : codProd2,
    order : order,
  };

  
//   useEffect(() => {
//     if (userInfo.filtro) { 
//       setCodPro1(userInfo.filtro.codPro1);
//       setDesPro1(userInfo.filtro.desPro1);
//       setCodPro2(userInfo.filtro.codPro2);
//       setDesPro2(userInfo.filtro.desPro2);
//       setOrder(userInfo.filtro.order);
//     }else{
//       setDesPro1('Elija Producto');
//       setDesPro2('Elija Producto');
//       setOrder('newest');
//     }
//     ;
// }, []);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(`${API}/api/products/xpv?id_config=${id_config}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        setProductss(data);
        dispatch({ type: 'SUPPLIER_FETCH_SUCCESS', payload: data });
      } catch (err) {}
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchDataVal = async () => {
      try {
        const { data } = await axios.get(`${API}/api/suppliers/`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        setSuppliers(data);
        dispatch({ type: 'SUPPLIER_FETCH_SUCCESS', payload: data });
      } catch (err) {}
    };
    fetchDataVal();
  }, []);


  useEffect(() => {
    if (window.innerWidth < width) {
      alert('Place your phone in landscape mode for the best experience');
    }
  }, [width]);





  const handleShowPro1 = () => {
    setShowPro1(true);
  };
  const handleShowPro2 = () => {
    setShowPro2(true);
  };

  const handleChangePro1 = (e) => {
    searchProduct1(e.target.value);
  };
  const handleChangePro2 = (e) => {
    searchProduct2(e.target.value);
  };


  const submitHandlerPro1 = async (e) => {
    e.preventDefault();
    setShowPro1(false)
  };
  const submitHandlerPro2 = async (e) => {
    e.preventDefault();
    setShowPro2(false)
  };


  const searchProduct1 = (codPro1) => {
    const productRow = productss.find((row) => row._id === codPro1);
    setProductR(productRow);
    setCodPro1(productRow._id);
    setCodProd1(productRow.codPro);
    setDesPro1(productRow.title);
  };
  const searchProduct2 = (codPro2) => {
    const productRow = productss.find((row) => row._id === codPro2);
    setProductR(productRow);
    setCodPro2(productRow._id);
    setCodProd2(productRow.codPro);
    setDesPro2(productRow.title);
  };


  const ayudaPro1 = (e) => {
    e.key === "Enter" && buscarPorCodPro1(codProd1);
    e.key === "F2" && handleShowPro1(codPro1);
    e.key === "Tab" && buscarPorCodPro1(codProd1);
  };
  const ayudaPro2 = (e) => {
    e.key === "Enter" && buscarPorCodPro2(codProd2);
    e.key === "F2" && handleShowPro2(codPro2);
    e.key === "Tab" && buscarPorCodPro2(codProd2);
  };
  

  const buscarPorCodPro1 = (codProd1) => {
    const productRow = productss.find((row) => row.codigoPro === codProd1);

    if (!productRow) {
        setCodPro1('');
        setCodProd1('');
        setDesPro1('Elija un Producto');
        setProductR({});
      }else{
        setProductR(productRow);
        setCodPro1(productRow._id);
        setCodProd1(productRow.codigoPro);
        setDesPro1(productRow.title);
    };
  };
  const buscarPorCodPro2 = (codProd2) => {
    const productRow = productss.find((row) => row.codigoPro === codProd2);

    if (!productRow) {
        setCodPro2('');
        setCodProd2('');
        setDesPro2('Elija un Producto');
        setProductR({});
      }else{
        setProductR(productRow);
        setCodPro2(productRow._id);
        setCodProd2(productRow.codigoPro);
        setDesPro2(productRow.title);
    };
  };

  const handleShowSup = () => {
    setShowSup(true);
  };

  const submitHandlerSup = async (e) => {
    e.preventDefault();
    setShowSup(false)
  };

  const handleChangeSup = (e) => {
    searchSup(e.target.value);
  };


  const searchSup = (codSup) => {
    const supplierRow = suppliers.find((row) => row._id === codSup);
    setSuppObj(supplierRow);
    setCodSup(supplierRow._id);
    setCodSupp(supplierRow.codSup);
    setNameSup(supplierRow.name);
  };


  const ayudaSup = (e) => {
    e.key === "Enter" && buscarPorCodSup(codSupp);
    e.key === "F2" && handleShowSup(codSup);
    e.key === "Tab" && buscarPorCodSup(codSupp);
  };
  

  const buscarPorCodSup = (codSupp) => {
    const supplierRow = suppliers.find((row) => row.codSup === codSupp);
    if (!supplierRow) {
        setCodSup('');
        setCodSupp('');
        setNameSup('Todos');
    }else{
      setCodSup(supplierRow._id);
      setCodSupp(supplierRow.codSup);
      setNameSup(supplierRow.name);
      };
  };



const unloadpayment = async () => {
if (window.confirm('El porcentaje tiene que ser mayor a Cero')) {
}
};




  const disminuyeHandler = async () => {
    if (porcen <= 0) {unloadpayment();} else {
    if (window.confirm('Confirma los Datos?')) {
            try {
            const { data } = await axios.put(`${API}/api/products/dispre/?configuracion=${id_config}&supplier=${codSup}&category=${category}&codProd1=${codProd1}&codProd2=${codProd2}&porcen=${porcen}`, {
              headers: { Authorization: `Bearer ${userInfo.token}` },
                  });
              // setCuentas(data.resultado);
              console.log(data);
            } catch (err) {
              dispatch({
                payload: getError(err),
              });
            }
              // navigate(redirect);
          };  

  };
};
  
  const aumentaHandler = async () => {
    if (porcen <= 0) {unloadpayment();} else {
      if (window.confirm('Confirma los Datos?')) {
      try {
      const { data } = await axios.put(`${API}/api/products/aumpre/?configuracion=${id_config}&category=${category}&supplier=${codSup}&codProd1=${codProd1}&codProd2=${codProd2}&porcen=${porcen}`, {
        headers: { Authorization: `Bearer ${userInfo.token}` },
            });
        // setCuentas(data.resultado);
        console.log(data);
      } catch (err) {
        dispatch({
          payload: getError(err),
        });
      }
        // navigate(redirect);
    };  
  };
  };


  return (
    <>
      <Helmet>
        <title>Modifica Precios</title>
      </Helmet>

      <main>
        {!showInvoice ? (
          <>
            {/* name, address, email, phone, bank name, bank account number, website client name, client address, invoice number, Fecha Factura, Fecha Vencimiento, notes */}
            <div>
              <div className="bordeTable">
                <div className="bordeTableinput">
                <div className="bordeTableinput">
                <Col md={11} className="mt-1 text-black py-1 px-1 rounded ">
                      <Card.Body>
                        <Card.Title>
                          <ListGroup.Item>
                            <h3>
                              PARAMETROS PARA MODIFICAR PRECIOS
                            </h3>
                          </ListGroup.Item>
                        </Card.Title>
                      </Card.Body>
                    </Col>


                <Row>


                </Row>

                <Row>
                  <Col md={2}>
                    <Card.Body>
                      <Card.Title>
                        <Form.Group className="input" controlId="name">
                          <Form.Label>Codigo Proovedor</Form.Label>
                          <Form.Control
                            className="input"
                            placeholder="Codigo Proovedor"
                            value={codSupp}
                            onChange={(e) => setCodSupp(e.target.value)}
                            // onKeyDown={(e) => e.key === "Enter" && buscarPorCodSup(codSupp)}
                            onKeyDown={(e) => ayudaSup(e)}
                            // buscarPorCodSup
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
                      onClick={() => handleShowSup()}
                      >
                      <BiFileFind className="text-blue-500 font-bold text-xl" />
                    </Button>
                  </Col>

                  <Col md={3} className="mt-1 text-black py-1 px-1 rounded ">
                      <Card.Body>
                        <Card.Title>
                          <ListGroup.Item>
                            <h3>
                              {nameSup}
                            </h3>
                          </ListGroup.Item>
                        </Card.Title>
                      </Card.Body>
                    </Col>

                    <Col md={3}>
                <Form.Group  className="input" controlId="name">
                  <Form.Label>Categoria</Form.Label>
                  <Form.Control
                    className="input"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                    />
                </Form.Group>
              </Col>

            </Row>
                <Row>
            <Col md={2}>
              <Card.Body>
                <Card.Title>
                  <Form.Group className="input" controlId="name">
                    <Form.Label>Desde Producto</Form.Label>
                    <Form.Control
                      className="input"
                      placeholder="Codigo Producto"
                      value={codProd1}
                      onChange={(e) => setCodProd1(e.target.value)}
                      // onKeyDown={(e) => e.key === "Enter" && buscarPorCodPro(codProd)}
                      onKeyDown={(e) => ayudaPro1(e)}
                      disabled={isPaying}
                      // required
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
                      onClick={() => handleShowPro1()}
                      >
                      <BiFileFind className="text-blue-500 font-bold text-xl" />
                    </Button>
                  </Col>

                  <Col md={3} className="mt-1 text-black py-1 px-1 rounded ">
                      <Card.Body>
                        <Card.Title>
                          <ListGroup.Item>
                            <h3>
                              {desPro1}
                            </h3>
                          </ListGroup.Item>
                        </Card.Title>
                      </Card.Body>
                    </Col>

                    <Col md={2}>
              <Card.Body>
                <Card.Title>
                  <Form.Group className="input" controlId="name">
                    <Form.Label>Hasta Producto</Form.Label>
                    <Form.Control
                      className="input"
                      placeholder="Codigo Producto"
                      value={codProd2}
                      onChange={(e) => setCodProd2(e.target.value)}
                      // onKeyDown={(e) => e.key === "Enter" && buscarPorCodPro(codProd)}
                      onKeyDown={(e) => ayudaPro2(e)}
                      disabled={isPaying}
                      // required
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
                      onClick={() => handleShowPro2()}
                      >
                      <BiFileFind className="text-blue-500 font-bold text-xl" />
                    </Button>
                  </Col>

                  <Col md={3} className="mt-1 text-black py-1 px-1 rounded ">
                      <Card.Body>
                        <Card.Title>
                          <ListGroup.Item>
                            <h3>
                              {desPro2}
                            </h3>
                          </ListGroup.Item>
                        </Card.Title>
                      </Card.Body>
                    </Col>

                </Row>
                </div>
                  <Row>
                    <Col md={4} sm={3} xs={12}>
                      <div className="d-grid">
                        <Button
                          className="mt-4 mb-1 bg-yellow-300 text-black py-1 px-1 rounded shadow border-2 border-yellow-300 hover:bg-transparent hover:text-blue-500 transition-all duration-300"
                          type="button"
                          onClick={disminuyeHandler}
                          >
                          DISMINUIR
                        </Button>
                      </div>
                      {loading && <LoadingBox></LoadingBox>}
                    </Col>
                    <Col md={4} sm={3} xs={12}>
                    <Form.Group className="mb-3" controlId="inStock">
                    <Form.Label>Porcentaje</Form.Label>
                    <Form.Control
                        value={porcen}
                        type="number"
                        onChange={(e) => setPorcen(e.target.value)}
                        required
                        />
                    </Form.Group>
                    </Col>

                    <Col md={4} sm={3} xs={12}>
                      <div className="d-grid">
                        <Button
                          className="mt-4 mb-1 bg-yellow-300 text-black py-1 px-1 rounded shadow border-2 border-yellow-300 hover:bg-transparent hover:text-blue-500 transition-all duration-300"
                          onClick={aumentaHandler}
                          >
                          AUMENTAR
                        </Button>
                      </div>
                      {loading && <LoadingBox></LoadingBox>}
                    </Col>

                  </Row>


                </div>
                <Modal
                  size="md"
                  show={showSup}
                  onHide={() => setShowSup(false)}
                  aria-labelledby="example-modal-sizes-title-lg"
                >
                  <Modal.Header closeButton>
                    <Modal.Title id="example-modal-sizes-title-lg">
                    Elija un Proovedor
                    </Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                  <Col md={12}>
                    <Card.Body>
                      <Card.Title>
                      <Form onSubmit={submitHandlerSup}>
                          <Form.Group className="mb-3" controlId="name">
                          {/* <Form.Group className="input" controlId="name"> */}
                          <Form.Label>Proveedor</Form.Label>
                          <Form.Select
                            className="input"
                            onClick={(e) => handleChangeSup(e)}
                          >
                            {suppliers.map((elemento) => (
                              <option key={elemento._id} value={elemento._id}>
                                {elemento.name}
                              </option>
                            ))}
                          </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="name">
                              <Form.Control
                                placeholder="Proveedor"
                                value={nameSup}
                                disabled={true}
                                required
                                />
                            </Form.Group>
                              <div className="mb-3">
                                <Button type="submit"
                                  disabled={nameSup ? false : true}
                                  >Continuar</Button>
                              </div>
                              </Form>
                      </Card.Title>
                    </Card.Body>
                  </Col>
                  </Modal.Body>
                </Modal>

                <Modal
            size="md"
            show={showPro1}
            onHide={() => setShowPro1(false)}
            aria-labelledby="example-modal-sizes-title-lg"
          >
            <Modal.Header closeButton>
            <Modal.Title id="example-modal-sizes-title-lg">Elija un Producto</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <Col md={12}>
              <Card.Body>
                <Card.Title>
                  <Card.Title>
                      <Form onSubmit={submitHandlerPro1}>
                        <Form.Group className="mb-3" controlId="name">
                        {/* <Form.Group className="input" controlId="name"> */}
                        <Form.Label>Productos</Form.Label>


                      <Form.Select
                        className="input"
                        onClick={(e) => handleChangePro1(e)}
                        disabled={isPaying}
                      >
                        {productss.map((elementoP) => (
                          <option key={elementoP._id} value={elementoP._id}>
                            {elementoP.title}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="name">
                              <Form.Control
                                placeholder="Producto"
                                value={desPro1}
                                disabled={true}
                                required
                                />
                            </Form.Group>
                              <div className="mb-3">
                                <Button type="submit"
                                  disabled={desPro1 ? false : true}
                                  >Continuar</Button>
                              </div>
                              </Form>


                  </Card.Title>
                </Card.Title>
              </Card.Body>
            </Col>
            </Modal.Body>
          </Modal>

          <Modal
            size="md"
            show={showPro2}
            onHide={() => setShowPro2(false)}
            aria-labelledby="example-modal-sizes-title-lg"
          >
            <Modal.Header closeButton>
            <Modal.Title id="example-modal-sizes-title-lg">Elija un Producto</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <Col md={12}>
              <Card.Body>
                <Card.Title>
                  <Card.Title>
                      <Form onSubmit={submitHandlerPro2}>
                        <Form.Group className="mb-3" controlId="name">
                        {/* <Form.Group className="input" controlId="name"> */}
                        <Form.Label>Productos</Form.Label>


                      <Form.Select
                        className="input"
                        onClick={(e) => handleChangePro2(e)}
                        disabled={isPaying}
                      >
                        {productss.map((elementoP) => (
                          <option key={elementoP._id} value={elementoP._id}>
                            {elementoP.title}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="name">
                              <Form.Control
                                placeholder="Producto"
                                value={desPro2}
                                disabled={true}
                                required
                                />
                            </Form.Group>
                              <div className="mb-3">
                                <Button type="submit"
                                  disabled={desPro2 ? false : true}
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
            </div>
          </>
        ) : (
          <>
            <Button onClick={() => clearitems()}>Nueva Factura</Button>

          </>
        )}
      </main>
    </>
  );
}

export default AppPrecios;
