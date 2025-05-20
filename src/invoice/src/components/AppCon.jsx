import { useContext, useState, useRef, useEffect, useReducer } from 'react';
import { useLocation, useNavigate, useParams  } from 'react-router-dom';
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

function AppCon() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const redirectInUrl = new URLSearchParams(search).get('redirect');
  const redirect = redirectInUrl ? redirectInUrl : '/';


  const [
    { loading, error, invoice, values, pages, loadingDelete, successDelete },
    dispatch,
  ] = useReducer(reducer, {
    loading: true,
    invoice: {},
    loadingVal: true,
    error: '',
  });


  const { state, dispatch: ctxDispatch } = useContext(Store);

  const { userInfo } = state;

    const params = useParams();
    const { id: invoiceId } = params;
  
  
  const [width] = useState(641);
  const [showInvoice, setShowInvoice] = useState(true);

  
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
    const fetchOrder = async () => {
      try {
        dispatch({ type: 'ORDER_FETCH_REQUEST' });
        const { data } = await axios.get(`${API}/api/invoices/${invoiceId}`, {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: 'ORDER_FETCH_SUCCESS', payload: data });
        // setCodUse(data.user);
        // setInvNum(invoice.invNum);
      } catch (err) {
        dispatch({ type: 'ORDER_FETCH_FAIL', payload: getError(err) });
      }
    };
    fetchOrder();
  }, []);



  useEffect(() => {
    if (window.innerWidth < width) {
      alert('Place your phone in landscape mode for the best experience');
    }
  }, [width]);


  const placeInvoiceHandler = async () => {
    setShowInvoice(true);
};

  const clearitems = () => {
    ctxDispatch({ type: 'INVOICE_CLEAR' });
    dispatch({ type: 'CREATE_SUCCESS' });
    localStorage.removeItem('orderItems');
    localStorage.removeItem('receiptItems');
    setShowInvoice(false);
    navigate(redirect);
    };

  const generaremito = async(invoiceId) => {
    if (window.confirm('Esta seguro de Grabar?')) {

    try {
        const { data } = await axios.put(`${API}/api/invoices/generaremito/${invoiceId}`,
            {id_config: invoice.id_config },
          {headers: { authorization: `Bearer ${userInfo.token}` },});
    } catch (err) {
      toast.error(getError(err));
    }

    ctxDispatch({ type: 'INVOICE_CLEAR' });
    dispatch({ type: 'CREATE_SUCCESS' });
    localStorage.removeItem('orderItems');
    localStorage.removeItem('receiptItems');
    setShowInvoice(false);
    navigate(redirect);
  }
  };



  return (
    <>
      <Helmet>
        <title>Comprobante de Venta</title>
      </Helmet>


      {loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <>
      <main>
        {!showInvoice ? (

              <div>
              </div>   

        ) : (
          <>
            <ReactToPrint
              trigger={() => <Button type="button">Print / Download</Button>}
              content={() => componentRef.current}
            />
            <Button
             onClick={() => generaremito(invoice._id)}
             disabled={(invoice.codCom.interno || (invoice.remNum > 0))}
            >GENERA REMITO</Button>
            <Button onClick={() => clearitems()}>CANCELA</Button>

            {/* Invoice Preview */}

            <div ref={componentRef} className="p-5">
              <Header handlePrint={handlePrint} />

              <div className="container mt-4">
      <div className="card border-dark">
        <div className="card-header bg-dark text-white text-center"></div>
        <div className="card-body">
          
        <div className="text-black text-center">{invoice.codCom.nameCom}</div>
          <div className="row">
            <div className="col-md-6">
              <p><strong>{userInfo.nameCon}</strong></p>
              <p><strong>Razon Social:</strong> {userInfo.nameCon}</p>
              <p><strong>Domicilio Comercial:</strong> {config.address}</p>
              <p><strong>Condición frente al IVA:</strong> {config.ivaCondition}</p>
            </div>
            <div className="col-md-6 ">
              {/* <p><strong>{invoice?.codCom.nameCom}</strong></p> */}
              <p><strong>Punto de Venta:</strong> {config.salePoint}    
              <strong>     Comp. Nro:</strong> {invoice.invNum}</p>
              <p><strong>Fecha de Emision:</strong> {invoice.invDat.substring(0, 10)}</p>
              <p><strong>CUIT:</strong> {config.cuit}</p>
              <p><strong>Ingresos Brutos:</strong> {config.ib}</p>
              <p><strong>Fecha de Inicio de Actividades:</strong> {config.feciniact}</p>
            </div>
          </div>
                    <hr />
            <div className="row">
              <div className="col-md-6">
                <p><strong>CUIT:</strong> {invoice.id_client.cuit}</p>
                <p><strong>Condición IVA:</strong> {invoice.id_client.coniva}</p>
              </div>
              <div className="col-md-6">
                <p><strong>Apellido y Nombre / Razon Social:</strong> {invoice.id_client.nameCus}</p>
                <p><strong>Dirección:</strong> {invoice.id_client.domcomer}</p>
              </div>
          </div>
          { invoice.codCom.toDisc &&
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
                      <td className="text-end">${item.price}</td>
                      <td className="text-end">${(item.quantity * item.price).toFixed(2)}</td>
                      <td className="text-end">%{item.porIva}</td>
                      <td className="text-end">${(item.quantity * item.price*(1+(item.porIva/100))).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="text-end">
                <p><strong>Subtotal:</strong> ${invoice.subTotal}</p>
                <p><strong>IVA:</strong> ${invoice.tax}</p>
                <h5><strong>Total:</strong> ${invoice.total}</h5>
              </div>
            </div>
          )}

          { invoice.codCom.itDisc &&
          (
            <div>
              <table className="table table-bordered mt-3">
                <thead className="table-dark text-white">
                  <tr>
                    <th>#</th>
                    <th>Descripción</th>
                    <th className="text-end">Cantidad</th>
                    <th className="text-end">Precio</th>
                    <th className="text-end">IVA (%)</th>
                    <th className="text-end">Imp. IVA</th>
                    <th className="text-end">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.orderItems.map((item, index) => (
                    <tr key={item.id}>
                      <td>{index + 1}</td>
                      <td>{item.title}</td>
                      <td className="text-end">{item.quantity}</td>
                      <td className="text-end">${item.price.toFixed(2)}</td>
                      <td className="text-end">%{item.porIva}</td>
                      <td className="text-end">${(item.price*(item.porIva/100)).toFixed(2)}</td>
                      <td className="text-end">${(item.quantity * item.price*(1+(item.porIva/100))).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="text-end">
                <h5><strong>Total:</strong> ${invoice.total}</h5>
              </div>
            </div>
          )}

          { invoice.codCom.noDisc &&
          (
            <div>
              <table className="table table-bordered mt-3">
                <thead className="table-dark text-white">
                  <tr>
                    <th>#</th>
                    <th>Descripción</th>
                    <th className="text-end">Cantidad</th>
                    <th className="text-end">Precio</th>
                    <th className="text-end">IVA (%)</th>
                    <th className="text-end">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.orderItems.map((item, index) => (
                    <tr key={item.id}>
                      <td>{index + 1}</td>
                      <td>{item.title}</td>
                      <td className="text-end">{item.quantity}</td>
                      <td className="text-end">${(item.price*(1+(item.porIva/100))).toFixed(2)}</td>
                      <td className="text-end">$0.00</td>
                      
                      <td className="text-end">${(item.quantity * item.price * (1+(item.porIva/100))).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="text-end">
                <h5><strong>Total:</strong> ${invoice.total.toFixed(2)}</h5>
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

export default AppCon;
