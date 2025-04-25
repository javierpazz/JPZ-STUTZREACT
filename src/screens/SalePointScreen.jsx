import { useContext, useEffect, useReducer, useState } from 'react';
import Axios from 'axios';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Helmet } from 'react-helmet-async';
import { Store } from '../Store';
import { getError, API } from '../utils';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, configu: action.payload, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};




export default function SalePointScreen() {
  const [{ loading, error, configu }, dispatch] = useReducer(reducer, {
    configu: [],
    loading: true,
    error: '',
  });
  const navigate = useNavigate();
  const { search } = useLocation();
  const redirectInUrl = new URLSearchParams(search).get('redirect');
  const redirect = redirectInUrl ? redirectInUrl : '/';


  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;

  const getTodayInGMT3 = () => {
    const now = new Date();
    // Convertimos a la hora de Argentina (GMT-3)
    const offset = now.getTimezoneOffset(); // En minutos
    const localDate = new Date(now.getTime() - (offset + 180) * 60 * 1000); // 180 = 3 horas
    
    return localDate.toISOString().split("T")[0];
  };

  const filtro = {
    firstDat : getTodayInGMT3(),
    lastDat : getTodayInGMT3(),
    codCus : '',
    codSup : '',
    codPro : '',
    codEnc : '',
    codCom : '',
    codVal : '',
    codCon : '',
    codUse : '',
    nameCus : 'Todos',
    nameCon : 'Todos',
    nameUse : 'Todos',
    nameSup : 'Todos',
    desPro : 'Todos',
    nameCom : 'Todos',
    desVal : 'Todos',
    nameEnc : 'Todos',
    order : 'newest',
  };


  const [name, setName] = useState("");
  const [salePoint, setSalePoint] = useState("");
  const [codCon, setCodCon] = useState('');
  const [configurationObj, setConfigurationObj] = useState({});
  
  const [configus, setConfigus] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const result = await Axios.get(`${API}/api/configurations/admin`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        
        dispatch({ type: 'FETCH_SUCCESS', payload: result.data.configurations});
        setConfigus(result.data.configurations);
        
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: err.message });
      }
      
    };
    fetchData();

  }, []);


  const searchProduct = (codCon) => {
    const configusR = configus.find((row) => row._id === codCon);
    setConfigurationObj(configusR);
    setCodCon(configusR._id);
    setName(configusR.name);
    setSalePoint(configusR.codCon);
  };


  const handleChange = (e) => {
    searchProduct(e.target.value);
  };


  
  const submitHandler = async (e) => {
    e.preventDefault();
    userInfo.codCon = codCon;
    userInfo.salePoint = salePoint;
    userInfo.nameCon = name;
    userInfo.configurationObj = configurationObj

      userInfo.filtro = filtro;
      userInfo.filtro.codCon = codCon;
      userInfo.filtro.nameCon = name;

      localStorage.setItem('userInfo', JSON.stringify(userInfo));
      navigate(redirect);

    localStorage.setItem('userInfo', JSON.stringify(userInfo));
    // navigate('/admin/dashboard');
    navigate('/');
    window.location.reload();
  };
  
  // useEffect(() => {
  //   if (userInfo) {
    //     navigate(redirect);
    //   }
    // }, [navigate, redirect, userInfo]);
    
    return (
      <Container className="small-container">
      <Helmet>
        <title>Puntos de Venta</title>
      </Helmet>
      <h1 className="my-3">Elija Punto de Venta</h1>
      <Form onSubmit={submitHandler}>
      <Form.Group className="mb-3" controlId="name">
          <Form.Label>Punto de Venta</Form.Label>
          <Form.Select
                        className="input"
                        onClick={(e) => handleChange(e)}
                      >
                        {configu.map((elemento) => (
                          <option key={elemento._id} value={elemento._id}>
                            {elemento.codCon+"-  -"+elemento.name }
                          </option>
                        ))}
            </Form.Select>
        </Form.Group>


                  <Form.Group className="mb-3" controlId="name">
                    <Form.Control
                      placeholder="Punto de Venta"
                      value={name}
                      disabled={true}
                      required
                    />
                  </Form.Group>




        <div className="mb-3">
          <Button type="submit"
            disabled={name ? false : true}
            >Continuar</Button>
        </div>
      </Form>
    </Container>
  );
}
