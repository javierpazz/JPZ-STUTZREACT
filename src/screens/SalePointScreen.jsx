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
    localStorage.setItem('userInfo', JSON.stringify(userInfo));
    navigate('/');
  };
  
  // useEffect(() => {
  //   if (userInfo) {
    //     navigate(redirect);
    //   }
    // }, [navigate, redirect, userInfo]);
    
    return (
      <Container className="small-container">
      <Helmet>
        <title>Sale Point</title>
      </Helmet>
      <h1 className="my-3">Choose Sale Point</h1>
      <Form onSubmit={submitHandler}>
      <Form.Group className="mb-3" controlId="name">
          <Form.Label>Sale Point</Form.Label>
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
                      placeholder="Sale Point Choosed"
                      value={name}
                      disabled={true}
                      required
                    />
                  </Form.Group>




        <div className="mb-3">
          <Button type="submit"
            disabled={name ? false : true}
            >Continue</Button>
        </div>
      </Form>
    </Container>
  );
}
