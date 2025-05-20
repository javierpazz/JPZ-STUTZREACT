import { useEffect, useReducer, useState } from 'react';
import axios from 'axios';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Product from '../components/Product';
import { Helmet } from 'react-helmet-async';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import {API} from '../utils';
import { Store } from '../Store';

// import data from '../data';

const reducer = (state, action) => {
  switch (action.type) {
    case 'CONF_FETCH_REQUEST':
      return { ...state, loading: true };
    case 'CONF_FETCH_SUCCESS':
      return { ...state, loading: false };
    case 'CONF_FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, products: action.payload, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

function HomeScreen() {
  const [{ loading, error, products }, dispatch] = useReducer(reducer, {
    products: [],
    loading: true,
    error: '',
  });
  const [configura, setConfigura] = useState([]);
  const [id_config, setId_config] = useState("");



{/* /////////////////  borrar ecomerce  ////////////////////// */}
  // const [products, setProducts] = useState([]);
{/* /////////////////  borrar ecomerce  ////////////////////// */}



  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
      const { data } = await axios.get(`${API}/api/configurations/`);
      console.log(data[0]._id);
      setConfigura(data);
      setId_config(data[0]._id);
      console.log(configura);



        const result = await axios.get(`${API}/api/products?id_config=${id_config}`);
        // const result = await axios.get(`${API}/api/products`);
        dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: err.message });
      }
    };
    fetchData();
  }, []);


  return (
    <div>
      <Helmet>
        <title>Invoicer</title>
      </Helmet>
{/* /////////////////  borrar ecomerce  ////////////////////// */}
      <h1>Featured Products</h1>
      <div className="products">
        {loading ? (
          <LoadingBox />
        ) : error ? (
          <MessageBox variant="danger">{error}</MessageBox>
        ) : (
          <Row>
            {products.map((product) => (
              <Col
                key={product.slug}
                xs={6}
                sm={6}
                md={4}
                lg={3}
                className="mb-3"
              >
                <Product product={product}></Product>
              </Col>
            ))}
          </Row>
        )}
      </div>
{/* /////////////////  borrar ecomerce  ////////////////////// */}
</div>
  );
}
export default HomeScreen;
