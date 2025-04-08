import React, { useContext, useEffect, useReducer, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { Store } from '../Store';
import { getError, API } from '../utils';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import { Helmet } from 'react-helmet-async';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import Button from 'react-bootstrap/Button';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    case 'UPDATE_REQUEST':
      return { ...state, loadingUpdate: true };
    case 'UPDATE_SUCCESS':
      return { ...state, loadingUpdate: false };
    case 'UPDATE_FAIL':
      return { ...state, loadingUpdate: false };
    case 'UPLOAD_REQUEST':
      return { ...state, loadingUpload: true, errorUpload: '' };
    case 'UPLOAD_SUCCESS':
      return {
        ...state,
        loadingUpload: false,
        errorUpload: '',
      };
    case 'UPLOAD_FAIL':
      return { ...state, loadingUpload: false, errorUpload: action.payload };

    default:
      return state;
  }
};
export default function SupplierEditScreen() {
  const navigate = useNavigate();
  const params = useParams(); // /supplier/:id
  const { id: supplierId } = params;

  const { state } = useContext(Store);
  const { userInfo } = state;
  const [{ loading, error, loadingUpdate, loadingUpload }, dispatch] =
    useReducer(reducer, {
      loading: true,
      error: '',
    });

  const [codSup, setCodSup] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [domcomer, setDomcomer] = useState('');
  const [cuit, setCuit] = useState('');
  const [coniva, setConiva] = useState('');

  useEffect(() => {
    if (supplierId === "0") {
    }
    else {
    const fetchData = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`${API}/api/suppliers/${supplierId}`);
        // console.log(data);
        setCodSup(data.codSup);
        setName(data.name);
        setEmail(data.email);
        setDomcomer(data.domcomer);
        setCuit(data.cuit);
        setConiva(data.coniva);
        dispatch({ type: 'FETCH_SUCCESS' });
      } catch (err) {
        dispatch({
          type: 'FETCH_FAIL',
          payload: getError(err),
        });
      }
    };
    fetchData();
    };
  }, [supplierId]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (supplierId === "0") {
      try {
        dispatch({ type: 'UPDATE_REQUEST' });
        await axios.post(
          `${API}/api/suppliers`,
          {
            codSup,
            name,
            email,
            domcomer,
            cuit,
            coniva,
          },
          {
            headers: { Authorization: `Bearer ${userInfo.token}` },
          }
        );
        dispatch({
          type: 'UPDATE_SUCCESS',
        });
        toast.success('Supplier updated successfully');
        navigate('/admin/suppliers');
      } catch (err) {
        toast.error(getError(err));
        dispatch({ type: 'UPDATE_FAIL' });
      }
 
    }
    else{
      try {
      dispatch({ type: 'UPDATE_REQUEST' });
      await axios.put(
        `${API}/api/suppliers/${supplierId}`,
        {
          _id: supplierId,
          codSup,
          name,
          email,
          domcomer,
          cuit,
          coniva,
        },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({
        type: 'UPDATE_SUCCESS',
      });
      toast.success('Supplier updated successfully');
      navigate('/admin/suppliers');
    } catch (err) {
      toast.error(getError(err));
      dispatch({ type: 'UPDATE_FAIL' });
    }
    }
  };

  return (
    <Container className="small-container">
      <Helmet>
        <title>Edita Proveedor</title>
      </Helmet>
      <h1>Edita Proveedor</h1>

      {false ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <Form onSubmit={submitHandler}>
          <Form.Group className="mb-3" controlId="codSup">
            <Form.Label>Codigo</Form.Label>
            <Form.Control
              value={codSup}
              onChange={(e) => setCodSup(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="name">
            <Form.Label>Nombre Comercial</Form.Label>
            <Form.Control
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="email">
            <Form.Label>Email</Form.Label>
            <Form.Control
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="email">
            <Form.Label>Domcomer</Form.Label>
            <Form.Control
              value={domcomer}
              onChange={(e) => setDomcomer(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="email">
            <Form.Label>Cuit</Form.Label>
            <Form.Control
              value={cuit}
              onChange={(e) => setCuit(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="email">
            <Form.Label>Condicion IVA</Form.Label>
            <Form.Control
              value={coniva}
              onChange={(e) => setConiva(e.target.value)}
              required
            />
          </Form.Group>
          <div className="mb-3">
            <Button disabled={loadingUpdate} type="submit">
              Graba
            </Button>
            {loadingUpdate && <LoadingBox></LoadingBox>}
          </div>
        </Form>
      )}
    </Container>
  );
}
