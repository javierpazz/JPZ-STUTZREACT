import React, { useContext, useEffect, useReducer, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { Store } from '../Store';
import { getError } from '../utils';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import { Helmet } from 'react-helmet-async';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import Button from 'react-bootstrap/Button';
import { API } from '../utils';

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
export default function ConfigurationEditScreen() {
  const navigate = useNavigate();
  const params = useParams(); // /configuration/:id
  const { id: configurationId } = params;

  const { state } = useContext(Store);
  const { userInfo } = state;
  const [{ loading, error, loadingUpdate, loadingUpload }, dispatch] =
    useReducer(reducer, {
      loading: true,
      error: '',
    });

  const [codCon, setCodCon] = useState('');
  const [name, setName] = useState('');
  const [cuit, setCuit] = useState('');
  const [domcomer, setDomcomer] = useState('');
  const [coniva, setConiva] = useState('');
  const [ib, setIb] = useState('');
  const [feciniact, setFeciniact] = useState('');



  const [email, setEmail] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(
          `${API}/api/configurations/${configurationId}`
        );
        setCodCon(data.codCon);
        setName(data.name);
        setCuit(data.cuit);
        setDomcomer(data.domcomer);
        setConiva(data.coniva);
        setIb(data.ib);
        setFeciniact(data.feciniact);
        dispatch({ type: 'FETCH_SUCCESS' });
      } catch (err) {
        dispatch({
          type: 'FETCH_FAIL',
          payload: getError(err),
        });
      }
    };
    fetchData();
  }, [configurationId]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      dispatch({ type: 'UPDATE_REQUEST' });
      await axios.put(
        `${API}/api/configurations/${configurationId}`,
        {
          _id: configurationId,
          codCon,
          name,
          cuit,
          domcomer,
          coniva,
          ib,
          feciniact,
        },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({
        type: 'UPDATE_SUCCESS',
      });
      toast.success('configuration updated successfully');
      navigate('/admin/configurations');
    } catch (err) {
      toast.error(getError(err));
      dispatch({ type: 'UPDATE_FAIL' });
    }
  };

  return (
    <Container className="small-container">
      <Helmet>
        <title>Edit Punto de Venta </title>
      </Helmet>
      <h1>Edit Punto de Venta </h1>

      {loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <Form onSubmit={submitHandler}>
          <Form.Group className="mb-3" controlId="slug">
            <Form.Label>Punto Venta Nro</Form.Label>
            <Form.Control
              value={codCon}
              onChange={(e) => setCodCon(e.target.value)}
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
          <Form.Group className="mb-3" controlId="name">
            <Form.Label>Domicilio Comercial</Form.Label>
            <Form.Control
              value={domcomer}
              onChange={(e) => setDomcomer(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="name">
            <Form.Label>CUIT</Form.Label>
            <Form.Control
              value={cuit}
              onChange={(e) => setCuit(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="name">
            <Form.Label>Condicion Frente al IVA</Form.Label>
            <Form.Control
              value={coniva}
              onChange={(e) => setConiva(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="name">
            <Form.Label>Ingresos Brutos</Form.Label>
            <Form.Control
              value={ib}
              onChange={(e) => setIb(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="name">
            <Form.Label>Fecha Inicio Actividades</Form.Label>
            <Form.Control
              value={feciniact}
              onChange={(e) => setFeciniact(e.target.value)}
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
