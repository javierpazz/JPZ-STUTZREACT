import { useContext, useState, useRef, useEffect, useReducer } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ClientDetails from './ClientDetails';
import Dates from './Dates';
import Footer from './Footer';
import Header from './Header';
import MainDetails from './MainDetails';
import Notes from './Notes';
import TableRec from './TableRec';
import { toast } from 'react-toastify';
import TableFormRec from './TableFormRec';
import ListGroup from 'react-bootstrap/ListGroup';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Store } from '../../../Store';
import ReactToPrint from 'react-to-print';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Helmet } from 'react-helmet-async';
import LoadingBox from '../../../components/LoadingBox';
import { getError, API } from '../../../utils';

const reducer = (state, action) => {
  switch (action.type) {
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

function AppBuyRec() {
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
    receipt: { receiptItems },
  } = state;

  const { receipt, userInfo, values } = state;

  const [codUse, setCodUse] = useState('');
  const [name, setName] = useState('');
  const [remNum, setRemNum] = useState('');
  const [invNum, setInvNum] = useState('');
  const [invDat, setInvDat] = useState('');
  const [recNum, setRecNum] = useState('');
  const [recDat, setRecDat] = useState('');
  const [codVal, setCodVal] = useState('');
  const [desval, setDesval] = useState('');
  const [receiptss, setReceiptss] = useState([]);
  const [userss, setUserss] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [codSup, setCodSup] = useState('');
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
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [amountval, setAmountval] = useState(0);
  const [list, setList] = useState([]);
  const [total, setTotal] = useState(0);
  const [width] = useState(641);
  const [showReceipt, setShowReceipt] = useState(false);

  const componentRef = useRef();
  const handlePrint = () => {
    window.print();
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: 'TOTAL_FETCH_REC_REQUEST' });
        const { data } = await axios.get(`${API}/api/receipts/B`, {
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

  const searchSup = (codSup) => {
    const supplierRow = suppliers.find((row) => row._id === codSup);
    setCodSup(supplierRow._id);
    setName(supplierRow.name);
  };

  //cr/
//
const RecControl = (e) => {
  
  const oldRecipt = receiptss.filter((row) => row.recNum === Number(recNum) && row.supplier === codSup );
  if (oldRecipt.length > 0) {
      toast.error(`This N° ${(recNum)} Receipt Exist, use other Number Please!`);
      setRecNum(e.target.value)
    } else {
      setRecNum(e.target.value)}
    }

//
//cr/


  const handleChange = (e) => {
    searchSup(e.target.value);
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
//cr/
//
const oldRecipt = receiptss.filter((row) => row.recNum === Number(recNum) && row.supplier === codSup );
if (oldRecipt.length > 0) {
    toast.error(`This N° ${(recNum)} Receipt Exist, use other Number Please!`);
    return;
    } else {

//
//cr/

    if (recNum && recDat && codSup) {
      const round2 = (num) => Math.round(num * 100 + Number.EPSILON) / 100; // 123.2345 => 123.23
      receipt.subTotal = round2(
        receipt.receiptItems.reduce((a, c) => a + c.amountval * 1, 0)
      );
      receipt.shippingPrice = receipt.subTotal > 100 ? round2(0) : round2(10);
      receipt.tax = round2(0.15 * 0);
      receipt.total = 0;
      receipt.totalBuy = receipt.subTotal;
      receipt.codSup = codSup;
      receipt.remNum = remNum;
      receipt.invNum = invNum;
      receipt.invDat = invDat;
      receipt.recNum = recNum;
      receipt.recDat = recDat;
      receipt.desval = desval;
      receipt.notes = notes;

      orderHandler();
      setShowReceipt(true);
      //      handlePrint();
    }
  }

  };

  /////////////////////////////////////////////

  const orderHandler = async () => {
    try {
      dispatch({ type: 'CREATE_REQUEST' });
      const { data } = await axios.post(
        `${API}/api/receipts`,
        {
          receiptItems: receipt.receiptItems,
          subTotal: receipt.subTotal,
          total: receipt.total,
          totalBuy: receipt.totalBuy,

          codSup: receipt.codSup,

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
      //      ctxDispatch({ type: 'RECEIPT_CLEAR' });
      //    dispatch({ type: 'CREATE_SUCCESS' });
      //  localStorage.removeItem('receiptItems');
      //navigate(`/order/${data.order._id}`);
    } catch (err) {
      dispatch({ type: 'CREATE_FAIL' });
      toast.error(getError(err));
    }
  };

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
        <title>Receipt Buy Invoices</title>
      </Helmet>

      <main>
        {!showReceipt ? (
          <>
            {/* name, address, email, phone, bank name, bank account number, website client name, client address, receipt number, receipt date, due date, notes */}
            <div>
              <div className="bordeTable">
                <Row>
                  <Col md={4}>
                    <Card.Body>
                      <Card.Title>
                        <Form.Group className="input" controlId="name">
                          <Form.Label>Supplier Code</Form.Label>
                          <Form.Control
                            className="input"
                            placeholder="Supplier Code"
                            value={codSup}
                            onChange={(e) => setCodSup(e.target.value)}
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
                          <Form.Label>Supplier Name</Form.Label>
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
                      </Card.Title>
                    </Card.Body>
                  </Col>
                </Row>

                <Row>
                  <Col md={2}>
                    <Card.Body>
                      <Card.Title>
                        <Form.Group className="input" controlId="name">
                          <Form.Label>Receipt Number</Form.Label>
                          <Form.Control
                            className="input"
                            placeholder="Receipt Number"
                            value={recNum}
                            onChange={(e) => RecControl(e)}
                            // onChange={(e) => setRecNum(e.target.value)}
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
                          <Form.Label>Receipt Date</Form.Label>
                          <Form.Control
                            className="input"
                            type="date"
                            placeholder="Receipt Date"
                            value={recDat}
                            onChange={(e) => setRecDat(e.target.value)}
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
                          <Form.Label>Additional Notes</Form.Label>
                          <textarea
                            className="input"
                            placeholder="Additional notes to the client"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
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
                          disabled={
                            receiptItems.length === 0 ||
                            !recNum ||
                            !recDat ||
                            !codSup
                          }
                        >
                          Cancel
                        </Button>
                      </div>
                      {loading && <LoadingBox></LoadingBox>}
                    </Col>

                    <Col md={4} sm={3} xs={12}>
                      <div className="d-grid">
                        <Button
                          type="button"
                          onClick={placeReceiptHandler}
                          disabled={
                            receiptItems.length === 0 ||
                            !recNum ||
                            !recDat ||
                            !codSup
                          }
                        >
                          Save Recipt
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
                              {receiptItems.reduce(
                                (a, c) => a + c.amountval * 1,
                                0
                              )}
                            </h3>
                          </ListGroup.Item>
                        </Card.Title>
                      </Card.Body>
                    </Col>
                  </Row>
                </div>

                {/* This is our table form */}
                <article>
                  <TableFormRec
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
            <Button onClick={() => clearitems()}>New Receipt</Button>

            {/* receipt Preview */}

            <div ref={componentRef} className="p-5">
              <Header handlePrint={handlePrint} />

              <MainDetails codUse={codUse} name={name} address={address} />

              <ClientDetails
                clientName={clientName}
                clientAddress={clientAddress}
              />

              <Dates invNum={invNum} invDat={invDat} dueDat={dueDat} />

              <TableRec
                desval={desval}
                amountval={amountval}
                receiptItems={receiptItems}
                total={total}
                setTotal={setTotal}
              />

              <Notes notes={notes} />

              <Footer
                name={name}
                address={address}
                website={website}
                email={email}
                phone={phone}
                bankAccount={bankAccount}
                bankName={bankName}
              />
            </div>
          </>
        )}
      </main>
    </>
  );
}

export default AppBuyRec;
