import { useContext, useState, useRef, useEffect, useReducer } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import ClientDetails from './ClientDetails';
import Dates from './Dates';
import Footer from './Footer';
import Header from './Header';
import MainDetails from './MainDetails';
import Notes from './Notes';
import TableRec from './TableRec';
import { toast } from 'react-toastify';
import TableFormRecCon from './TableFormRecCon';
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


    case 'RECIBO_FETCH_REQUEST':
        return { ...state, loading: true, error: '' };
    case 'RECIBO_FETCH_SUCCESS':
        return { ...state, loading: false, recibo: action.payload, error: '' };
    case 'RECIBO_FETCH_FAIL':
        return { ...state, loading: false, error: action.payload };


    case 'VALUE_FETCH_REQUEST':
      return { ...state, loading: true };
    case 'VALUE_FETCH_SUCCESS':
      return {
        ...state,
        values: action.payload.values,
        pageVal: action.payload.page,
        pagesVal: action.payload.pages,
        loading: false,
      };
    case 'VALUE_FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
//cr/
//
case 'TOTAL_FETCH_REC_REQUEST':
  return { ...state, loading: true };
case 'TOTAL_FETCH_REC_SUCCESS':
  return {
    ...state,
    receiptss: action.payload,
    loading: false,
  };
case 'TOTAL_FETCH_REC_FAIL':
  return { ...state, loading: false, error: action.payload };

//
//cr/
      default:
      return state;
  }
};

function AppCajIngCon() {
  const [
    { loading, error, recibo, values, pages, loadingDelete, successDelete },
    dispatch,
  ] = useReducer(reducer, {
    loading: true,
    recibo: {},
    loadingVal: true,
    error: '',
  });

  const navigate = useNavigate();

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;

  const params = useParams();
  const { id: reciboId } = params;

  const input1Ref = useRef(null);
  const input2Ref = useRef(null);
  const input3Ref = useRef(null);
  const input4Ref = useRef(null);
  const input5Ref = useRef(null);
  const input6Ref = useRef(null);
  const input7Ref = useRef(null);
  const input8Ref = useRef(null);
  const input0Ref = useRef(null);

  
  const input20Ref = useRef(null);
  const input21Ref = useRef(null);

  // const [poriva, setPorIva] = useState(userInfo.configurationObj.poriva);
  const [poriva, setPorIva] = useState(21);
  const [codConNum, setCodConNum] = useState(userInfo.configurationObj.codCon);

  const [showEnc, setShowEnc] = useState(false);

  const [codUse, setCodUse] = useState('');
  const [codEnc, setCodEnc] = useState('');
  const [codEncp, setCodEncp] = useState('');
  const [name, setName] = useState('');
  const [userObj, setUserObj] = useState({});
  const [remNum, setRemNum] = useState('');
  const [invNum, setInvNum] = useState('');
  const [invDat, setInvDat] = useState('');
  const [cajNum, setCajNum] = useState('');
  const [cajNumImp, setCajNumImp] = useState('');
  const today = new Date().toISOString().split("T")[0];
  const [cajDat, setCajDat] = useState(today);
  const [codVal, setCodVal] = useState('');
  const [desval, setDesval] = useState('');
  const [receiptss, setReceiptss] = useState([]);
  // const [userss, setUserss] = useState([]);
  const [encargados, setEncargados] = useState([]);
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
  const [dueDat, setDueDat] = useState('');
  const [notes, setNotes] = useState('');
  const [desPro, setDesPro] = useState('');
  const [quantity, setQuantity] = useState(0);
  const [price, setPrice] = useState('');
  const [amountval, setAmountval] = useState('');
  const [list, setList] = useState([]);
  const [total, setTotal] = useState(0);
  const [width] = useState(641);
  const [showReceipt, setShowReceipt] = useState(false);


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
  const fetchData = async () => {
    try {
      dispatch({ type: 'TOTAL_FETCH_REC_REQUEST' });
      const { data } = await axios.get(`${API}/api/receipts/S`, {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      });
      dispatch({ type: 'TOTAL_FETCH_REC_SUCCESS', payload: data });
      setReceiptss(data);
    } catch (err) {
      dispatch({
        type: 'TOTAL_FETCH_REC_FAIL',
        payload: getError(err),
      });
    }
  };
  fetchData();
}, []);
//
//cr/


  useEffect(() => {
    clearitems();
    input2Ref.current.focus()
    const fetchData = async () => {
      try {
        const { data } = await axios.get(`${API}/api/encargados/`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        setEncargados(data);
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
    const calculateAmountval = (amountval) => {
      setAmountval(
        recibo.total
      );
    };
    calculateAmountval(amountval);
  }, [ cajNum, cajDat]);


  useEffect(() => {
    if (window.innerWidth < width) {
      alert('Place your phone in landscape mode for the best experience');
    }
  }, [width]);

  const getTotal = () => {
    return recibo.receiptItems.reduce((acc, item) => acc + item.amountval, 0);
  };


  useEffect(() => {
    const fetchOrder = async () => {
      try {
        dispatch({ type: 'RECIBO_FETCH_REQUEST' });
        const { data } = await axios.get(`${API}/api/receipts/${reciboId}`, {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: 'RECIBO_FETCH_SUCCESS', payload: data });
        setCodUse(data.user);
        // setCodComp(invoice.codCom);
        // setCodCust(invoice.codCus);
        // setName(invoice.supplier.name);
        // setNameCom(invoice.nameCom);
  
        setInvNum(recibo.recNum);
      } catch (err) {
        dispatch({ type: 'RECIBO_FETCH_FAIL', payload: getError(err) });
      }
    };
    fetchOrder();
  }, []);

  const handleShowEnc = () => {
    setShowEnc(true);
    input21Ref.current.focus();
  };


  const searchEnc = (codEnc) => {
    const encargadoRow = encargados.find((row) => row._id === codEnc);
    setCodEnc(encargadoRow._id);
    setCodEncp(encargadoRow.codEnc);
    setName(encargadoRow.name);
  };


  const ayudaEnc = (e) => {
    e.key === "Enter" && buscarPorCodEnc(codEncp);
    e.key === "F2" && handleShowEnc(codEnc);
    e.key === "Tab" && buscarPorCodEnc(codEncp);
  };
  

  const buscarPorCodEnc = (codEncp) => {
    const encargadoRow = encargados.find((row) => row.codEnc === codEncp);
    if (!encargadoRow) {
        setCodEnc('');
        setCodEncp('');
        setName('Elija Encargado');
    }else{
      setCodEnc(encargadoRow._id);
      setCodEncp(encargadoRow.codEnc);
      setName(encargadoRow.name);
      input3Ref.current.focus();
      };
  };


//cr/
//
const RecControl = (e) => {
  // const oldRecipt = receiptss.filter((row) => row.cajNum === Number(cajNum));
  // if (oldRecipt.length > 0) {
  if (false) {
      toast.error(`This N° ${(cajNum)} Receipt Exist, use other Number Please!`);
      setCajNum(e.target.value)
    } else {
      setCajNum(e.target.value)}
    }

//
//cr/



  const submitHandlerEnc = async (e) => {
    e.preventDefault();
    setShowEnc(false)
  };

  const handleChange = (e) => {
    searchEnc(e.target.value);
  };

  
  const searchValue = (codVal) => {
    const valuesRow = valuess.find((row) => row._id === codVal);
    setCodVal(valuesRow.codVal);
    setDesval(valuesRow.desVal);
  };

  const handleValueChange = (e) => {
    searchValue(e.target.value);
  };

  const placeCancelReceiptHandler = async () => {};

  const placeReceiptHandler = async () => {
        setShowReceipt(true);
  };

  /////////////////////////////////////////////


  const clearitems = () => {
    ctxDispatch({ type: 'RECEIPT_CLEAR' });
    dispatch({ type: 'CREATE_SUCCESS' });
    localStorage.removeItem('receiptItems');
    setShowReceipt(false);
  };

  /////////////////////////////////////////////

  return (
    <>
      <Helmet>
        <title>Ingresos de Caja</title>
      </Helmet>

      <main>
        {!showReceipt ? (
          <>
            {/* name, address, email, phone, bank name, bank account number, website client name, client address, Numero, Fecha, Fecha Vencimiento, notes */}
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
                              INGRESO DE CAJA Nro.: {recibo.codConNum +'-'+recibo.cajNum}
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
                          <Form.Label>Codigo Encargado</Form.Label>
                          <Form.Control
                            className="input"
                            ref={input2Ref}
                            placeholder="Codigo Encargado"
                            value={codEncp}
                            onChange={(e) => setCodEncp(e.target.value)}
                            // onKeyDown={(e) => e.key === "Enter" && buscarPorCodEnc(codEncp)}
                            onKeyDown={(e) => ayudaEnc(e)}
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
                      onClick={() => handleShowEnc()}
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
                  <Col md={2}>
                    <Card.Body>
                      <Card.Title>
                        <Form.Group className="input" controlId="name">
                          <Form.Label>Numero</Form.Label>
                          <Form.Control
                            className="input"
                            ref={input3Ref}
                            placeholder="Numero"
                            value={cajNum}
                            onChange={(e) => RecControl(e)}
                            onKeyDown={(e) => e.key === "Enter" && input4Ref.current.focus()}
                            // onChange={(e) => setCajNum(e.target.value)}
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
                          <Form.Label>Fecha</Form.Label>
                          <Form.Control
                            className="input"
                            ref={input4Ref}
                            type="date"
                            placeholder="Fecha"
                            value={cajDat}
                            onChange={(e) => setCajDat(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && input5Ref.current.focus()}
                            required
                          />
                        </Form.Group>
                      </Card.Title>
                    </Card.Body>
                  </Col>
                  <Col md={8}>
                    <Card.Body>
                      <Card.Title>
                        <Form.Group className="input" controlId="name">
                          <Form.Label>Observaciones</Form.Label>
                          <textarea
                            className="input"
                            ref={input5Ref}
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
              </div>
              <div className="bordeTable">
                <div className="bordeTableinput">
                  <Row>
                    <Col md={4} sm={3} xs={12}>
                      <div className="d-grid">
                        <Button
                          type="button"
                          onClick={placeCancelReceiptHandler}
                          // disabled={
                          //   receiptItems.length === 0 ||
                          //   !cajDat ||
                          //   !codEnc
                          // }
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
                          onClick={placeReceiptHandler}
                          // disabled={
                          //   receiptItems.length === 0 ||
                          //   !cajDat ||
                          //   !codEnc
                          // }
                        >
                          IMPRIME
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
                              {(+recibo.total).toFixed(2)}
                            </h3>
                          </ListGroup.Item>
                        </Card.Title>
                      </Card.Body>
                    </Col>
                  </Row>
                </div>

                {/* This is our table form */}
                <article>
                  <TableFormRecCon
                    input0Ref={input0Ref}
                    input8Ref={input8Ref}
                    codVal={codVal}
                    setCodVal={setCodVal}
                    desval={desval}
                    setDesval={setDesval}
                    quantity={quantity}
                    setQuantity={setQuantity}
                    price={price}
                    setPrice={setPrice}
                    amountval={amountval}
                    setAmountval={setAmountval}
                    list={list}
                    setList={setList}
                    total={total}
                    setTotal={setTotal}
                    receiptItems={recibo.receiptItems}
                  />
                </article>

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

            {/* receipt Preview */}

            <div ref={componentRef} className="p-5">
              <Header handlePrint={handlePrint} />

              <div className="container mt-4">
      <div className="card border-dark">
        <div className="card-header bg-dark text-white text-center"></div>
        <div className="card-body">
          
        <div className="text-black text-center">INGRESO DE CAJA</div>
          <div className="row">
            <div className="col-md-6">
              <p><strong>{userInfo.nameCon}</strong></p>
              <p><strong>Razon Social:</strong> {userInfo.nameCon}</p>
              <p><strong>Domicilio Comercial:</strong> {config.address}</p>
              <p><strong>Condición frente al IVA:</strong> {config.ivaCondition}</p>
            </div>
            <div className="col-md-6 ">
              <p><strong>INGRESO DE CAJA</strong></p>
              <p><strong>Punto de Venta:</strong> {config.salePoint}    
              <strong>     Comp. Nro:</strong> {recibo.cajNum}</p>
              <p><strong>Fecha de Emision:</strong> {cajDat}</p>
              <p><strong>CUIT:</strong> {config.cuit}</p>
              <p><strong>Ingresos Brutos:</strong> {config.ib}</p>
              <p><strong>Fecha de Inicio de Actividades:</strong> {config.feciniact}</p>
            </div>
          </div>
            <hr />
            <div className="row">
              <div className="col-md-6">
                <p><strong>Encargado :</strong> {recibo.id_encarg.name}</p>
              </div>
          </div>

          { true &&
          (
            <div>
              <table className="table table-bordered mt-3">
                <thead className="table-dark text-white">
                  <tr>
                    <th>#</th>
                    <th>Valor</th>
                    <th className="text-end">Numero</th>
                    <th className="text-end">Importe</th>
                  </tr>
                </thead>
                <tbody>
                  {recibo.receiptItems.map((item, index) => (
                    <tr key={item.id}>
                      <td>{index + 1}</td>
                      <td>{item.desval}</td>
                      <td className="text-end">{item.numval}</td>
                      <td className="text-end">${item.amountval.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="text-end">
                <h5><strong>Total:</strong> ${recibo.total.toFixed(2)}</h5>
              </div>
            </div>
          )}


        </div>

        


      </div>
    </div>



            </div>
          </>
        )}
      </main>
    </>
  );
}

export default AppCajIngCon;
