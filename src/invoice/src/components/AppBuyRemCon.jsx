import { useContext, useState, useRef, useEffect, useReducer } from 'react';
import { useNavigate, useParams  } from 'react-router-dom';
import axios from 'axios';
import ClientDetails from './ClientDetails';
import Dates from './Dates';
import Footer from './Footer';
import Header from './Header';
import MainDetails from './MainDetails';
import Notes from './Notes';
import Table from './Table';
import { toast } from 'react-toastify';
import TableFormCon from './TableFormCon';
import ListGroup from 'react-bootstrap/ListGroup';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { BiFileFind } from "react-icons/bi";
import { Store } from '../../../Store';
import ReactToPrint from 'react-to-print';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { Helmet } from 'react-helmet-async';
import LoadingBox from '../../../components/LoadingBox';
import { getError, API } from '../../../utils';

const reducer = (state, action) => {
  switch (action.type) {

    case 'ORDER_FETCH_REQUEST':
        return { ...state, loading: true, error: '' };
    case 'ORDER_FETCH_SUCCESS':
        return { ...state, loading: false, invoice: action.payload, error: '' };
    case 'ORDER_FETCH_FAIL':
        return { ...state, loading: false, error: action.payload };

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
        suppliers: action.payload.supliers,
        page: action.payload.page,
        pages: action.payload.pages,
        loading: false,
      };
    case 'SUPPLIER_FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };

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

function AppBuyRemCon
() {
  const [
    { loading, error, invoice, values, pages, loadingDelete, successDelete },
    dispatch,
  ] = useReducer(reducer, {
    loading: true,
    invoice: {},
    loadingVal: true,
    error: '',
  });

  const navigate = useNavigate();

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    receipt: { receiptItems },
  } = state;

  const { receipt, userInfo } = state;

  const params = useParams();
  const { id: invoiceId } = params;

  const input1Ref = useRef(null);
  const input2Ref = useRef(null);
  const input3Ref = useRef(null);
  const input4Ref = useRef(null);
  const input5Ref = useRef(null);
  const input6Ref = useRef(null);
  const input7Ref = useRef(null);
  const input8Ref = useRef(null);
  const input9Ref = useRef(null);
  const input0Ref = useRef(null);
  
  const input20Ref = useRef(null);
  const input21Ref = useRef(null);


  const [codConNum, setCodConNum] = useState(userInfo.configurationObj.codCon);
  const [showSup, setShowSup] = useState(false);

  const [codUse, setCodUse] = useState('');
  const [name, setName] = useState('');
  const [suppObj, setSuppObj] = useState({});
  const [remNum, setRemNum] = useState('');
  const today = new Date().toISOString().split("T")[0];
  const [remDat, setRemDat] = useState(today);
  const [invNum, setInvNum] = useState('');
  const [invDat, setInvDat] = useState('');
  const [recNum, setRecNum] = useState('');
  const [recDat, setRecDat] = useState(today);
  const [codVal, setCodVal] = useState('');
  const [desval, setDesval] = useState('');
  const [valueeR, setValueeR] = useState('');
  const [desVal, setDesVal] = useState('');
  const [numval, setNumval] = useState(' ');
  const [userss, setUserss] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [codSup, setCodSup] = useState('');
  const [codSupp, setCodSupp] = useState('');
  const [valuess, setValuess] = useState([]);
  const [codPro, setCodPro] = useState('');
  const [codPro1, setCodPro1] = useState('');
  const [address, setAddress] = useState('Direccion Usuario');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [bankName, setBankName] = useState('');
  const [bankAccount, setBankAccount] = useState('');
  const [website, setWebsite] = useState('');
  const [clientName, setClientName] = useState('');
  const [clientAddress, setClientAddress] = useState('');
  const [dueDat, setDueDat] = useState(today);
  const [notes, setNotes] = useState('');
  const [desPro, setDesPro] = useState('');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [porIva, setPorIva] = useState(0);
  const [amount, setAmount] = useState(0);
  const [amountval, setAmountval] = useState(0);
  const [list, setList] = useState([]);
  const [total, setTotal] = useState(0);
  const [width] = useState(641);
  const [showInvoice, setShowInvoice] = useState(false);

  const [isPaying, setIsPaying] = useState(false);


  const config = {
    salePoint: userInfo.configurationObj.codCon,
    name: userInfo.configurationObj.name,
    cuit: userInfo.configurationObj.cuit,
    address: userInfo.configurationObj.domcomer,
    ivaCondition: userInfo.configurationObj.coniva,
    ib: userInfo.configurationObj.ib,
    feciniact: userInfo.configurationObj.feciniact,
    invoiceNumber: "",
    date: "",

  };



  const componentRef = useRef();
  const handlePrint = () => {
    window.print();
  };

  useEffect(() => {
    const calculateAmountval = (amountval) => {
      setAmountval(
        invoice.totalBuy
      );
    };
    if (numval === '') {
      setNumval(' ');
    }
    setCodUse(codSup);
    setDesVal(desVal);
    calculateAmountval(amountval);
    addToCartHandler(valueeR);
  }, [numval, desval, recNum, recDat]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(`${API}/api/users/`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        setUserss(data);
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {}
    };
    fetchData();
  }, []);

  useEffect(() => {
    clearitems();
    input2Ref.current.focus()
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
      const fetchOrder = async () => {
        try {
          dispatch({ type: 'ORDER_FETCH_REQUEST' });
          const { data } = await axios.get(`${API}/api/invoices/${invoiceId}`, {
            headers: { authorization: `Bearer ${userInfo.token}` },
          });
          dispatch({ type: 'ORDER_FETCH_SUCCESS', payload: data });
          setCodUse(data.user);
          // setCodComp(invoice.codCom);
          // setCodCust(invoice.codCus);
          // setName(invoice.supplier.name);
          // setNameCom(invoice.nameCom);
    
          setRemNum(invoice.remNum);
        } catch (err) {
          dispatch({ type: 'ORDER_FETCH_FAIL', payload: getError(err) });
        }
      };
      fetchOrder();
    }, []);
  
  
  useEffect(() => {
    const fetchDataVal = async () => {
      try {
        const { data } = await axios.get(`${API}/api/valuees/`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        setValuess(data);
        dispatch({ type: 'VALUE_FETCH_SUCCESS', payload: data });
      } catch (err) {}
    };
    fetchDataVal();
  }, []);

  useEffect(() => {
    if (window.innerWidth < width) {
      alert('Place your phone in landscape mode for the best experience');
    }
  }, [width]);


  const handleShowSup = () => {
    setShowSup(true);
  };

  const searchSup = (codSup) => {
    const supplierRow = suppliers.find((row) => row._id === codSup);
    setSuppObj(supplierRow);
    setCodSup(supplierRow._id);
    setCodSupp(supplierRow.codSup);
    setName(supplierRow.name);
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
        setName('Elija Proovedor');
    }else{
      setCodSup(supplierRow._id);
      setCodSupp(supplierRow.codSup);
      setName(supplierRow.name);
      input6Ref.current.focus();
      };
  };


  const submitHandlerSup = async (e) => {
    e.preventDefault();
    setShowSup(false)
  };

  const handleChange = (e) => {
    searchSup(e.target.value);
  };

  const searchValue = (codVal) => {
    const valuesRow = valuess.find((row) => row._id === codVal);
    setValueeR(valuesRow);
    setCodVal(valuesRow.codVal);
    setDesVal(valuesRow.desVal);
    setDesVal(valuesRow.desVal);
    setDesval(valuesRow.desVal);
  };

  const handleValueChange = (e) => {
    searchValue(e.target.value);
  };

  const placeCancelInvoiceHandler = async () => {};

  const placeInvoiceHandler = async () => {
    setShowInvoice(true);
};

  /////////////////////////////////////////////

  const addToCartHandler = async (itemVal) => {
    ctxDispatch({
      type: 'RECEIPT_CLEAR',
    });
    localStorage.removeItem('receiptItems');
    ctxDispatch({
      type: 'RECEIPT_ADD_ITEM',
      payload: { ...itemVal, desval, amountval, numval },
    });
  };

  /////////////////////////////////////////////

  const receiptHandler = async () => {
    try {
      dispatch({ type: 'CREATE_REQUEST' });
      const { data } = await axios.post(
        `${API}/api/receipts`,
        {
          receiptItems: receipt.receiptItems,
          shippingAddress: receipt.shippingAddress,
          paymentMethod: receipt.paymentMethod,
          subTotal: receipt.subTotal,
          shippingPrice: receipt.shippingPrice,
          tax: receipt.tax,
          total: receipt.total,
          totalBuy: receipt.totalBuy,

          //          codUse: receipt.codUse,

          codSup: receipt.codSup,
          codCon: receipt.codCon,
          codConNum: receipt.codConNum,

          remNum: receipt.remNum,
          remDat: receipt.remDat,
          invNum: receipt.invNum,
          invDat: receipt.invDat,
          recNum: receipt.recNum,
          recDat: receipt.recDat,
          desval: receipt.desval,
          notes: receipt.notes,
          salbuy: 'BUY',
        },
        {
          headers: {
            authorization: `Bearer ${userInfo.token}`,
          },
        }
      );
      ctxDispatch({ type: 'RECEIPT_CLEAR' });
      dispatch({ type: 'CREATE_SUCCESS' });
      localStorage.removeItem('receiptItems');
      //navigate(`/order/${data.order._id}`);
    } catch (err) {
      dispatch({ type: 'CREATE_FAIL' });
      toast.error(getError(err));
    }
  };

  /////////////////////////////////////////////

  const stockHandler = async (item) => {
    try {
      dispatch({ type: 'CREATE_REQUEST' });
      await axios.put(
        `${API}/api/products/upstock/${item.item._id}`,
        {
          quantitys: item.item.quantity,
        },
        {
          headers: {
            authorization: `Bearer ${userInfo.token}`,
          },
        }
      );
      dispatch({ type: 'CREATE_SUCCESS' });
    } catch (err) {
      dispatch({ type: 'CREATE_FAIL' });
      toast.error(getError(err));
    }
  };

  const orderHandler = async () => {
    try {
      dispatch({ type: 'CREATE_REQUEST' });
      const { data } = await axios.post(
        `${API}/api/invoices/rem`,

        {
          orderItems: invoice.orderItems,
          shippingAddress: invoice.shippingAddress,
          paymentMethod: invoice.paymentMethod,
          subTotal: invoice.subTotal,
          shippingPrice: invoice.shippingPrice,
          tax: invoice.tax,
          total: invoice.total,
          totalBuy: invoice.totalBuy,

          codSup: invoice.codSup,
          codCon: invoice.codCon,
          codConNum: invoice.codConNum,
          
          remNum: invoice.remNum,
          remDat: invoice.remDat,
          invNum: invoice.invNum,
          invDat: invoice.invDat,
          recNum: invoice.recNum,
          recDat: invoice.recDat,
          desVal: invoice.desVal,
          notes: invoice.notes,
          salbuy: 'BUY',
        },
        {
          headers: {
            authorization: `Bearer ${userInfo.token}`,
          },
        }
      );
      //      ctxDispatch({ type: 'INVOICE_CLEAR' });
      //    dispatch({ type: 'CREATE_SUCCESS' });
      //  localStorage.removeItem('orderItems');
      setIsPaying(false);
      setDesval('');
      setDesVal('');
      setRecNum('');
      setRecDat('');
      setNumval(' ');
      setAmountval(0);
      //navigate(`/order/${data.order._id}`);
    } catch (err) {
      dispatch({ type: 'CREATE_FAIL' });
      toast.error(getError(err));
    }
  };

  /////////////////////////////////////////////
  const Paying = () => {
    setIsPaying(!isPaying);
    if (isPaying) {
      setDesval('');
      setDesVal('');
      setRecNum('');
      setRecDat('');
      setNumval(' ');
      setAmountval(0);
    }
  };

  const unloadpayment = async () => {
    if (window.confirm('Are you fill all Dates?')) {
    }
  };

  const clearitems = () => {
    ctxDispatch({ type: 'INVOICE_CLEAR' });
    dispatch({ type: 'CREATE_SUCCESS' });
    localStorage.removeItem('orderItems');
    localStorage.removeItem('receiptItems');
    setShowInvoice(false);
  };

  return (
    <>
      <Helmet>
        <title>Remito de Ingreso</title>
      </Helmet>

      <main>
        {!showInvoice ? (
          <>
            {/* name, address, email, phone, bank name, bank account number, website client name, client address, invoice number, Fecha Factura, Fecha Vencimiento, notes */}
            <div>
              <div className="bordeTable">
              <Row>
                  <Col md={3}>
                    <Card.Body>
                      <Card.Title>
                      <ListGroup.Item>
                            <h3>
                              
                            </h3>
                          </ListGroup.Item>

                      </Card.Title>
                    </Card.Body>
                  </Col>

                  <Col md={8} className="mt-1 text-black py-1 px-1 rounded ">
                      <Card.Body>
                        <Card.Title>
                          <ListGroup.Item>
                            <h3>
                              REMITO DE COMPRA Nro.: {invoice.codConNum +'-'+invoice.remNum}
                            </h3>
                          </ListGroup.Item>
                        </Card.Title>
                      </Card.Body>
                    </Col>


                </Row>


                <Row>
                  <Col md={2}>
                    <Card.Body>
                      <Card.Title>
                        <Form.Group className="input" controlId="name">
                          <Form.Label>Codigo Proovedor</Form.Label>
                          <Form.Control
                            className="input"
                            ref={input2Ref}
                            placeholder="Codigo Proovedor"
                            value={codSupp}
                            onChange={(e) => setCodSupp(e.target.value)}
                            // onKeyDown={(e) => e.key === "Enter" && buscarPorCodSup(codSupp)}
                            onKeyDown={(e) => ayudaSup(e)}
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
                      onClick={() => handleShowSup()}
                      >
                      <BiFileFind className="text-blue-500 font-bold text-xl" />
                    </Button>
                  </Col>

                  <Col md={8} className="mt-1 text-black py-1 px-1 rounded ">
                      <Card.Body>
                        <Card.Title>
                          <ListGroup.Item>
                            <h3>
                              {name}
                            </h3>
                          </ListGroup.Item>
                        </Card.Title>
                      </Card.Body>
                    </Col>


                </Row>

                <Row>
                <Col md={1}>
                    <Card.Body>
                      <Card.Title>
                        <Form.Group className="input" controlId="name">
                          <Form.Label>Remito N°</Form.Label>
                          <Form.Control
                            className="input"
                            ref={input6Ref}
                            placeholder="Remito N°"
                            value={remNum}
                            onChange={(e) => setRemNum(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && input9Ref.current.focus()}
                            required
                          />
                        </Form.Group>
                      </Card.Title>
                    </Card.Body>
                  </Col>

                  <Col md={2}>
                    <Card.Body>
                      <Card.Title>
                        <Form.Group className="input" controlId="name">
                          <Form.Label>Fecha Remito</Form.Label>
                          <Form.Control
                            className="input"
                            ref={input9Ref}
                            type="date"
                            placeholder="Fecha Remito"
                            value={remDat}
                            onChange={(e) => setRemDat(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && input5Ref.current.focus()}
                            required
                          />
                        </Form.Group>
                      </Card.Title>
                    </Card.Body>
                  </Col>
                  <Col md={2}>
                    <Card.Body>
                      <Card.Title>
                        <Form.Group className="input" controlId="name">
                          <Form.Label>Fecha Vencimiento</Form.Label>
                          <Form.Control
                            className="input"
                            ref={input5Ref}
                            type="date"
                            placeholder="Fecha Vencimiento"
                            value={dueDat}
                            onChange={(e) => setDueDat(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && input7Ref.current.focus()}
                            required
                          />
                        </Form.Group>
                      </Card.Title>
                    </Card.Body>
                  </Col>
                  <Col md={6}>
                    <Card.Body>
                      <Card.Title>
                        <Form.Group className="input" controlId="name">
                          <Form.Label>Observaciones</Form.Label>
                          <textarea
                            className="input"
                            ref={input7Ref}
                            placeholder="Observaciones "
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && input8Ref.current.focus()}
                          ></textarea>
                        </Form.Group>
                      </Card.Title>
                    </Card.Body>
                  </Col>
                </Row>

                <div className="bordeTable">
                  <Row>
                    <Col md={2}>
                      <Card.Body>
                        <Card.Title>
                          <Form.Group className="input" controlId="name">
                            <Form.Label>Values</Form.Label>
                            <Form.Select
                              className="input"
                              onClick={(e) => handleValueChange(e)}
                              disabled={!isPaying}
                            >
                              {valuess.map((elementoV) => (
                                <option
                                  key={elementoV._id}
                                  value={elementoV._id}
                                >
                                  {elementoV.desVal}
                                </option>
                              ))}
                            </Form.Select>
                          </Form.Group>
                        </Card.Title>
                      </Card.Body>
                    </Col>

                    <Col md={2}>
                      <Card.Body>
                        <Card.Title>
                          <Form.Group className="input" controlId="name">
                            <Form.Label>Valor N°</Form.Label>
                            <Form.Control
                              className="input"
                              placeholder="Valor N°"
                              value={numval}
                              onChange={(e) => setNumval(e.target.value)}
                              disabled={!isPaying}
                              required
                            />
                          </Form.Group>
                        </Card.Title>
                      </Card.Body>
                    </Col>
                    <Col md={3}>
                      <Card.Body>
                        <Card.Title>
                          <Form.Group className="input" controlId="name">
                            <Form.Label>Fecha</Form.Label>
                            <Form.Control
                              className="input"
                              type="date"
                              placeholder="Fecha"
                              value={recDat}
                              onChange={(e) => setRecDat(e.target.value)}
                              disabled={!isPaying}
                              required
                            />
                          </Form.Group>
                        </Card.Title>
                      </Card.Body>
                    </Col>

                    <Col md={2}>
                      <Card.Body>
                        <Card.Title>
                          <Form.Group className="input" controlId="name">
                            <Form.Label>Recibo N°</Form.Label>
                            <Form.Control
                              className="input"
                              placeholder="Recibo N°"
                              value={recNum}
                              onChange={(e) => setRecNum(e.target.value)}
                              disabled={!isPaying}
                              required
                            />
                          </Form.Group>
                        </Card.Title>
                      </Card.Body>
                    </Col>
                    <Col md={2}>
                      <div className="d-grid">
                        <Button
                          type="button"
                          onClick={Paying}
                          className="mt-3 mb-1 bg-yellow-300 text-black py-1 px-1 rounded shadow border-2 border-yellow-300 hover:bg-transparent hover:text-blue-500 transition-all duration-300"
                          disabled={true}
                        >
                          {isPaying ? 'Not Payment' : 'Carga Pago'}
                        </Button>
                      </div>
                      {loading && <LoadingBox></LoadingBox>}
                    </Col>
                    <Col md={1}>
                      <div
                        className="d-grid mt-3 mb-1 py-1 px-1 transition-all
                        duration-300"
                      >
                        {isPaying && desval && recNum && recDat
                          ? 'Cargado'
                          : 'No Cargado '}
                      </div>
                      {loading && <LoadingBox></LoadingBox>}
                    </Col>
                  </Row>
                </div>
              </div>
              <div className="bordeTable">
                <div className="bordeTableinput">
                  <Row>
                    <Col md={4} sm={3} xs={12}>
                      <div className="d-grid">
                        <Button
                          type="button"
                          onClick={placeCancelInvoiceHandler}
                        //   disabled={
                        //     orderItems.length === 0 ||
                        //     !remNum ||
                        //     !remDat ||
                        //     !codSup
                        //   }
                        >
                          CANCELA
                        </Button>
                      </div>
                      {loading && <LoadingBox></LoadingBox>}
                    </Col>

                    <Col md={4} sm={3} xs={12}>
                      <div className="d-grid">
                        <Button
                          type="button"
                          ref={input0Ref}
                          onClick={placeInvoiceHandler}
                        //   disabled={
                        //     orderItems.length === 0 ||
                        //     !remNum ||
                        //     !remDat ||
                        //     !codSup
                        //   }
                        >
                          CONSULTA
                        </Button>
                      </div>
                      {loading && <LoadingBox></LoadingBox>}
                    </Col>

                    <Col md={4} sm={3} xs={12}>
                      <Card.Body>
                        <Card.Title>
                          <ListGroup.Item>
                            <h3>
                              Total: $
                              {(+invoice.totalBuy).toFixed(2)}
                            </h3>
                          </ListGroup.Item>
                        </Card.Title>
                      </Card.Body>
                    </Col>
                  </Row>
                </div>

                {/* This is our table form */}
                <article>
                  <TableFormCon
                    input0Ref={input0Ref}
                    input8Ref={input8Ref}
                    codPro={codPro}
                    setCodPro={setCodPro}
                    desPro={desPro}
                    setDesPro={setDesPro}
                    quantity={quantity}
                    setQuantity={setQuantity}
                    price={price}
                    setPrice={setPrice}
                    porIva={porIva}
                    setPorIva={setPorIva}
                    amount={amount}
                    setAmount={setAmount}
                    list={list}
                    setList={setList}
                    total={total}
                    setTotal={setTotal}
                    valueeR={valueeR}
                    desval={desval}
                    numval={numval}
                    isPaying={isPaying}
                    orderItems={invoice.orderItems}
                    //                    totInvwithTax={totInvwithTax}
                    //                    setTotInvwithTax={setTotInvwithTax}
                  />
                </article>

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
                            onClick={(e) => handleChange(e)}
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
                                value={name}
                                disabled={true}
                                required
                                />
                            </Form.Group>
                              <div className="mb-3">
                                <Button type="submit"
                                  // ref={input21Ref}
                                  disabled={name ? false : true}
                                  >Continuar</Button>
                              </div>
                              </Form>
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
            <ReactToPrint
              trigger={() => <Button type="button">Print / Download</Button>}
              content={() => componentRef.current}
            />
            <Button onClick={() => clearitems()}>CANCELA</Button>

            {/* Invoice Preview */}

            <div ref={componentRef} className="p-5">
              <Header handlePrint={handlePrint} />

              <div className="container mt-4">
      <div className="card border-dark">
        <div className="card-header bg-dark text-white text-center"></div>
        <div className="card-body">
          
        <div className="card-header text-black text-center">REMITO</div>

          <div className="row">
            <div className="row">
              <div className="col-md-6">
                <p><strong>Apellido y Nombre / Razon Social:</strong> {invoice.supplier.name}</p>
                <p><strong>Domicilio Comercial:</strong> {invoice.supplier.domcomer}</p>
                </div>
              <div className="col-md-6">
                <p><strong>CUIT:</strong> {invoice.supplier.cuit}</p>
                <p><strong>Condición IVA:</strong> {invoice.supplier.coniva} </p>
              </div>
          </div>
          </div>
                    <hr />
                    <div className="row">
            <div className="col-md-6">
              <p><strong>{userInfo.nameCon}</strong></p>
              <p><strong>Razon Social:</strong> {userInfo.nameCon}</p>
              <p><strong>Domicilio Comercial:</strong> {config.address}</p>
              <p><strong>Condición frente al IVA:</strong> {config.ivaCondition}</p>
            </div>
            <div className="col-md-6 ">
              <p><strong>REMITO</strong></p>
              <p><strong>Punto de Venta:</strong> {config.salePoint}    
              <strong>     Comp. Nro:</strong> {invoice.remNum}</p>
              <p><strong>Fecha de Emision:</strong> {invoice.remDat.substring(0, 10)}</p>
              <p><strong>CUIT:</strong> {config.cuit}</p>
              <p><strong>Ingresos Brutos:</strong> {config.ib}</p>
              <p><strong>Fecha de Inicio de Actividades:</strong> {config.feciniact}</p>
            </div>
          </div>
          </div>
          { true &&
          (
            <div>
              <table className="table table-bordered mt-3">
                <thead className="table-dark text-white">
                  <tr>
                    <th>#</th>
                    <th>Descripción</th>
                    <th className="text-end">Cantidad</th>
                    <th className="text-end">Precio</th>
                    <th className="text-end">Subtotal</th>
                    <th className="text-end">IVA (%)</th>
                    <th className="text-end">Subtotal c/IVA</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.orderItems.map((item, index) => (
                    <tr key={item.id}>
                      <td>{index + 1}</td>
                      <td>{item.title}</td>
                      <td className="text-end">{item.quantity}</td>
                      <td className="text-end">${item.price.toFixed(2)}</td>
                      <td className="text-end">${(item.quantity * item.price).toFixed(2)}</td>
                      <td className="text-end">%{item.porIva}</td>
                      <td className="text-end">${(item.quantity * item.price*(1+(item.porIva/100))).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="text-end">
              <p><strong>Subtotal:</strong> ${invoice.subTotal.toFixed(2)}</p>
                <p><strong>IVA:</strong> ${invoice.tax.toFixed(2)}</p>
                <h5><strong>Total:</strong> ${invoice.totalBuy.toFixed(2)}</h5>
              </div>
            </div>
          )}


      </div>
    </div>





            </div>
          </>
        )}
      </main>
    </>
  );
}

export default AppBuyRemCon
;
