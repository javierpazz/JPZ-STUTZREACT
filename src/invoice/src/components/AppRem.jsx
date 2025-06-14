import { useContext, useState, useRef, useEffect, useReducer } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ClientDetails from './ClientDetails';
import Dates from './Dates';
import Footer from './Footer';
import Header from './Header';
import MainDetails from './MainDetails';
import Notes from './Notes';
import Table from './Table';
import { toast } from 'react-toastify';
import TableForm from './TableForm';
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

function AppRem() {
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

  const navigate = useNavigate();

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    invoice: { orderItems },
    receipt: { receiptItems },
  } = state;

  const { invoice, receipt, userInfo, values } = state;

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
  const [showCus, setShowCus] = useState(false);

  const getTodayInGMT3 = () => {
    const now = new Date();
    // Convertimos a la hora de Argentina (GMT-3)
    const offset = now.getTimezoneOffset(); // En minutos
    const localDate = new Date(now.getTime() - (offset + 180) * 60 * 1000); // 180 = 3 horas
    
    return localDate.toISOString().split("T")[0];
  };

  // const [codUse, setCodUse] = useState('');
  const [codCus, setCodCus] = useState('');
  const [codCust, setCodCust] = useState('');
  const [name, setName] = useState('');
  const [userObj, setUserObj] = useState({});
  const [remNum, setRemNum] = useState('');
  const [remNumImp, setRemNumImp] = useState('');
  const [remDat, setRemDat] = useState(getTodayInGMT3());
  const [invNum, setInvNum] = useState('');
  const [invDat, setInvDat] = useState('');
  const [recNum, setRecNum] = useState('');
  const [recDat, setRecDat] = useState(getTodayInGMT3());
  const [codVal, setCodVal] = useState('');
  const [codval, setCodval] = useState('');
  const [desval, setDesval] = useState('');
  const [valueeR, setValueeR] = useState('');
  const [desVal, setDesVal] = useState('');
  const [numval, setNumval] = useState(' ');
  // const [userss, setUserss] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [valuess, setValuess] = useState([]);
  const [codPro, setCodPro] = useState('');
  const [address, setAddress] = useState('Direccion Usuario');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [bankName, setBankName] = useState('');
  const [bankAccount, setBankAccount] = useState('');
  const [website, setWebsite] = useState('');
  const [clientName, setClientName] = useState('');
  const [clientAddress, setClientAddress] = useState('');
  const [dueDat, setDueDat] = useState(getTodayInGMT3());
  const [notes, setNotes] = useState('');
  const [desPro, setDesPro] = useState('');
  const [quantity, setQuantity] = useState(0);
  const [price, setPrice] = useState(0);
  const [porIva, setPorIva] = useState(0);
  const [amount, setAmount] = useState(0);
  const [amountval, setAmountval] = useState(0);
  const [list, setList] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalSubImp, setTotalSubImp] = useState(0);
  const [taxImp, setTaxImp] = useState(0);
  const [totalImp, setTotalImp] = useState(0);
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
        orderItems?.reduce((a, c) => a + (c.quantity * c.price * (1+(c.porIva/100))), 0)
      );
    };
    if (numval === '') {
      setNumval(' ');
    }
    setCodCus(codCus);
    setDesVal(desVal);
    calculateAmountval(amountval);
    addToCartHandler(valueeR);
  }, [orderItems, numval, desval, recNum, recDat]);

  useEffect(() => {
    clearitems();
    input2Ref.current.focus()
    const fetchData = async () => {
      try {
        const { data } = await axios.get(`${API}/api/customers/`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        setCustomers(data);
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {}
    };
    fetchData();
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

  const getTotal = () => {
    return orderItems.reduce((acc, item) => acc + item.quantity * item.price, 0).toFixed(2);
  };

  const getIVA = () => {
    return orderItems.reduce((acc, item) => acc + (item.quantity * item.price * item.porIva) / 100, 0).toFixed(2);
  };

  const getTotalWithIVA = () => {
    return (parseFloat(getTotal()) + parseFloat(getIVA())).toFixed(2);
  };

  const handleShowCus = () => {
    setShowCus(true);
    input21Ref.current.focus();
  };


  const searchUser = (codCus) => {
    const usersRow = customers.find((row) => row._id === codCus);
    setUserObj(usersRow);
    setCodCus(usersRow._id);
    setCodCust(usersRow.codCus);
    setName(usersRow.nameCus);
  };

  
  const ayudaCus = (e) => {
    e.key === "Enter" && buscarPorCodCus(codCust);
    e.key === "F2" && handleShowCus(codCus);
    e.key === "Tab" && buscarPorCodCus(codCust);
  };
  

  const buscarPorCodCus = (codCust) => {
    const usersRow = customers.find((row) => row.codCus === codCust);
    if (!usersRow) {
        setCodCus('');
        setCodCust('');
        setName('Elija Cliente');
    }else{
      setCodCus(usersRow._id);
      setCodCust(usersRow.codCust);
      setUserObj(usersRow);
      setName(usersRow.nameCus);
      input6Ref.current.focus();
      };
  };

  const handleChange = (e) => {
    searchUser(e.target.value);
  };
  const submitHandlerCus = async (e) => {
    e.preventDefault();
    setShowCus(false)
  };


  const searchValue = (codVal) => {
    const valuesRow = valuess.find((row) => row._id === codVal);
    setValueeR(valuesRow);
    setCodVal(valuesRow.codVal);
    setDesVal(valuesRow.desVal);
  };

  const handleValueChange = (e) => {
    searchValue(e.target.value);
  };

  const placeCancelInvoiceHandler = async () => {};

  const placeInvoiceHandler = async () => {
      if (window.confirm('Esta seguro de Grabar?')) {
      if (isPaying && (!recNum || !recDat || !desVal)) {
        unloadpayment();
      } else {
        if (remDat && codCus) {
          orderItems.map((item) => stockHandler({ item }));
          const round2 = (num) => Math.round(num * 100 + Number.EPSILON) / 100; // 123.2345 => 123.23
          invoice.subTotal = round2(
            invoice.orderItems.reduce((a, c) => a + c.quantity * c.price, 0)
          );
          invoice.shippingPrice = 0;

          //        invoice.shippingPrice =
          //        invoice.subTotal > 100 ? round2(0) : round2(10);
          // invoice.tax = round2((poriva/100) * invoice.subTotal);
          invoice.tax = round2(
            invoice.orderItems.reduce((a, c) => a + c.quantity * c.price * (c.porIva/100), 0)
          );
          invoice.total = round2(
            invoice.subTotal + invoice.shippingPrice + invoice.tax
          );
          invoice.totalBuy = 0;
          invoice.codCus = codCus;
          invoice.codCon = userInfo.codCon;
          invoice.user = userInfo._id,
          invoice.codConNum = codConNum;

          invoice.codSup = '0';
          invoice.remNum = remNum;
          invoice.remDat = remDat;
          invoice.invNum = 0;
          invoice.invDat = null;
          invoice.recNum = 0;
          invoice.recDat = null;
          invoice.desVal = desVal;
          invoice.notes = notes;

          if (0 && recDat && desVal) {
            receipt.subTotal = invoice.subTotal;
            receipt.total = invoice.total;
            receipt.totalBuy = invoice.totalBuy;
            receipt.codCus = invoice.codCus;
            receipt.codCon = invoice.codCon;
            receipt.user = userInfo._id,
            receipt.codConNum = invoice.codConNum;
            receipt.codSup = '0';
            receipt.recNum = invoice.recNum;
            receipt.recDat = invoice.recDat;
            receipt.desVal = invoice.desVal;
            receipt.notes = invoice.notes;

            receiptHandler();
          }
          orderHandler();
          setShowInvoice(true);
          //      handlePrint();
        }
      }
    };
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

          codCus: receipt.codCus,
          codCon: receipt.codCon,
          user: userInfo._id,
          codConNum: receipt.codConNum,

          //          codSup: receipt.codSup,

          remNum: receipt.remNum,
          invNum: receipt.invNum,
          invDat: receipt.invDat,
          recNum: receipt.recNum,
          recDat: receipt.recDat,
          desval: receipt.desval,
          notes: receipt.notes,
          salbuy: 'SALE',
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
    // console.log(item.item._id);

    try {
      dispatch({ type: 'CREATE_REQUEST' });
      await axios.put(
        `${API}/api/products/downstock/${item.item._id}`,
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

          codCus: invoice.codCus,
          codCon: invoice.codCon,
          user: userInfo._id,
          codConNum: invoice.codConNum,

          //        codSup: invoice.codSup,

          remNum: invoice.remNum,
          remDat: invoice.remDat,
          invNum: invoice.invNum,
          invDat: invoice.invDat,
          recNum: invoice.recNum,
          recDat: invoice.recDat,
          desVal: invoice.desVal,
          notes: invoice.notes,
          salbuy: 'SALE',
        },
        {
          headers: {
            authorization: `Bearer ${userInfo.token}`,
          },
        }
      );
      //ctxDispatch({ type: 'INVOICE_CLEAR' });
      //      dispatch({ type: 'CREATE_SUCCESS' });
      //      localStorage.removeItem('orderItems');
      setIsPaying(false);
      setDesval('');
      setDesVal('');
      setRemNumImp(data.invoice.remNum);
      setTotalSubImp(data.invoice.subTotal);
      setTaxImp(data.invoice.tax);
      setTotalImp(data.invoice.total);
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
        <title>Remitos de Venta</title>
      </Helmet>

      <main>
        {!showInvoice ? (
          <>
            {/* name, address, email, phone, bank name, bank account number, website client name, client address, invoice number, Fecha Factura, Fecha Vencimiento, notes */}
            <div>
              <div className="bordeTable">
              <Row>
                  <Col md={4}>
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
                              REMITO DE VENTA
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
                          <Form.Label>Codigo Cliente</Form.Label>
                          <Form.Control
                            className="input"
                            ref={input2Ref}
                            placeholder="Codigo Cliente"
                            value={codCust}
                            onChange={(e) => setCodCust(e.target.value)}
                            // onKeyDown={(e) => e.key === "Enter" && buscarPorCodCus(codCust)}
                            onKeyDown={(e) => ayudaCus(e)}
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
                      onClick={() => handleShowCus()}
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
                            type="number"
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

                {/* <div className="bordeTable">
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
                              type="number"
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
                          disabled={
                            orderItems.length === 0 ||
                            !remNum ||
                            !remDat ||
                            !codCus
                          }
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
                </div> */}
              </div>
              <div className="bordeTable">
                <div className="bordeTableinput">
                  <Row>
                    <Col md={4} sm={3} xs={12}>
                      <div className="d-grid">
                        <Button
                          type="button"
                          onClick={placeCancelInvoiceHandler}
                          disabled={
                            orderItems.length === 0 ||
                            !remDat ||
                            !codCus
                          }
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
                          disabled={
                            orderItems.length === 0 ||
                            !remDat ||
                            !codCus
                          }
                        >
                          GRABA REMITO
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
                              {amountval.toFixed(2)}
                            </h3>
                          </ListGroup.Item>
                        </Card.Title>
                      </Card.Body>
                    </Col>
                  </Row>
                </div>

                {/* This is our table form */}
                <article>
                  <TableForm
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
                    //                    totInvwithTax={totInvwithTax}
                    //                    setTotInvwithTax={setTotInvwithTax}
                  />
                </article>


                <Modal
                  // input21Ref={input21Ref}
                  size="md"
                  show={showCus}
                  onHide={() => setShowCus(false)}
                  aria-labelledby="example-modal-sizes-title-lg"
                >
                  <Modal.Header closeButton>
                    <Modal.Title id="example-modal-sizes-title-lg">
                    Elija un Cliente
                    </Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                  <Col md={12}>
                    <Card.Body>
                      <Card.Title>
                      <Form onSubmit={submitHandlerCus}>
                            <Form.Group className="mb-3" controlId="name">
                            {/* <Form.Group className="input" controlId="name"> */}
                          <Form.Label>Clientes</Form.Label>
                          <Form.Select
                            className="input"
                            onClick={(e) => handleChange(e)}
                          >
                            {customers.map((elemento) => (
                              <option key={elemento._id} value={elemento._id}>
                                {elemento.nameCus}
                              </option>
                            ))}
                          </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="name">
                              <Form.Control
                                placeholder="Cliente"
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
            <Button onClick={() => clearitems()}>Nuevo Remito</Button>

            {/* Invoice Preview */}

            <div ref={componentRef} className="p-5">
              <Header handlePrint={handlePrint} />

              <div className="container mt-4">
      <div className="card border-dark">
        <div className="card-header bg-dark text-white text-center"></div>
        <div className="card-body">
          
        <div className="card-header text-black text-center">REMITO</div>
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
              <strong>     Comp. Nro:</strong> {remNumImp}</p>
              <p><strong>Fecha de Emision:</strong> {remDat}</p>
              <p><strong>CUIT:</strong> {config.cuit}</p>
              <p><strong>Ingresos Brutos:</strong> {config.ib}</p>
              <p><strong>Fecha de Inicio de Actividades:</strong> {config.feciniact}</p>
            </div>
          </div>
                    <hr />
            <div className="row">
              <div className="col-md-6">
                <p><strong>CUIT:</strong> {userObj.cuit}</p>
                <p><strong>Condición IVA:</strong> {userObj.coniva}</p>
              </div>
              <div className="col-md-6">
                <p><strong>Apellido y Nombre / Razon Social:</strong> {userObj.nameCus}</p>
                <p><strong>Dirección:</strong> {userObj.domcomer}</p>
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
                    <th className="text-end">Unidad</th>
                    <th className="text-end">Precio</th>
                    <th className="text-end">Subtotal</th>
                    <th className="text-end">IVA (%)</th>
                    <th className="text-end">Subtotal c/IVA</th>
                  </tr>
                </thead>
                <tbody>
                  {orderItems.map((item, index) => (
                    <tr key={item.id}>
                      <td>{index + 1}</td>
                      <td>{item.title}</td>
                      <td className="text-end">{item.quantity}</td>
                      <td>{item.medPro}</td>
                      <td className="text-end">${item.price}</td>
                      <td className="text-end">${(item.quantity * item.price).toFixed(2)}</td>
                      <td className="text-end">%{item.porIva}</td>
                      <td className="text-end">${(item.quantity * item.price*(1+(item.porIva/100))).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="text-end">
                {/* <p><strong>Subtotal:</strong> ${totalSubImp}</p>
                <p><strong>IVA:</strong> ${taxImp}</p> */}
                <h5><strong>Total:</strong> ${totalImp}</h5>
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

export default AppRem;
