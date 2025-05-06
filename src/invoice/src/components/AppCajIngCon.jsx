import { useContext, useState, useRef, useEffect, useReducer } from 'react';
import { useLocation, useNavigate, useParams  } from 'react-router-dom';
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
import LoadingBox from '../../../components/LoadingBox';
import MessageBox from '../../../components/MessageBox';
import { BiFileFind } from "react-icons/bi";
import { Store } from '../../../Store';
import ReactToPrint from 'react-to-print';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { Helmet } from 'react-helmet-async';
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
  const navigate = useNavigate();
  const { search } = useLocation();
  const redirectInUrl = new URLSearchParams(search).get('redirect');
  const redirect = redirectInUrl ? redirectInUrl : '/';

  const [
    { loading, error, recibo, values, pages, loadingDelete, successDelete },
    dispatch,
  ] = useReducer(reducer, {
    loading: true,
    recibo: {},
    loadingVal: true,
    error: '',
  });


  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;

  const params = useParams();
  const { id: reciboId } = params;

  const [width] = useState(641);
  const [showReceipt, setShowReceipt] = useState(true);


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
        // setCodUse(data.user);
        // // setCodComp(invoice.codCom);
        // // setCodCust(invoice.codCus);
        // // setName(invoice.supplier.name);
        // // setNameCom(invoice.nameCom);
  
        // setInvNum(recibo.recNum);
      } catch (err) {
        dispatch({ type: 'RECIBO_FETCH_FAIL', payload: getError(err) });
      }
    };
    fetchOrder();
  }, []);


  const placeReceiptHandler = async () => {
        setShowReceipt(true);
  };



  const clearitems = () => {
    ctxDispatch({ type: 'RECEIPT_CLEAR' });
    dispatch({ type: 'CREATE_SUCCESS' });
    localStorage.removeItem('receiptItems');
    setShowReceipt(false);
    navigate(redirect);
  };


  return (
    <>
      <Helmet>
        <title>Ingresos de Caja</title>
      </Helmet>

      {loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <>
      <main>
        {!showReceipt ? (
          <>
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
              <p><strong>Fecha de Emision:</strong> {recibo.cajDat.substring(0, 10)}</p>
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
      )}

    </>
  );
}

export default AppCajIngCon;
