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
export default function ComprobanteEditScreen() {
  const navigate = useNavigate();
  const params = useParams(); // /comprobante/:id
  const { id: comprobanteId } = params;

  const { state } = useContext(Store);
  const { userInfo } = state;
  const [{ loading, error, loadingUpdate, loadingUpload }, dispatch] =
    useReducer(reducer, {
      loading: true,
      error: '',
    });

  const [codCom, setCodCom] = useState('');
  const [nameCom, setNameCom] = useState('');
  const [claCom, setClaCom] = useState('');
  const [isHaber, setIsHaber] = useState(true);
  const [noDisc, setNoDisc] = useState(true);
  const [toDisc, setToDisc] = useState(false);
  const [itDisc, setItDisc] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`${API}/api/comprobantes/${comprobanteId}`);
        // console.log(data);
        setCodCom(data.codCom);
        setNameCom(data.nameCom);
        setClaCom(data.claCom);
        setIsHaber(data.isHaber);
        setNoDisc(data.noDisc);
        setToDisc(data.toDisc);
        setItDisc(data.itDisc);
        dispatch({ type: 'FETCH_SUCCESS' });
      } catch (err) {
        dispatch({
          type: 'FETCH_FAIL',
          payload: getError(err),
        });
      }
    };
    fetchData();
  }, [comprobanteId]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      dispatch({ type: 'UPDATE_REQUEST' });
      await axios.put(
        `${API}/api/comprobantes/${comprobanteId}`,
        {
          _id: comprobanteId,
          codCom,
          nameCom,
          isHaber,
          noDisc,
          toDisc,
          itDisc,
          claCom,
        },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({
        type: 'UPDATE_SUCCESS',
      });
      toast.success('Comprobante updated successfully');
      navigate('/admin/comprobantes');
    } catch (err) {
      toast.error(getError(err));
      dispatch({ type: 'UPDATE_FAIL' });
    }
  };

  return (
    <Container className="small-container">
      <Helmet>
        <title>Edit Comprobante </title>
      </Helmet>
      <h1>Edit Comprobante </h1>

      {loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <Form onSubmit={submitHandler}>
          <Form.Group className="mb-3" controlId="name">
            <Form.Label>Codigo Comprobante</Form.Label>
            <Form.Control
              value={codCom}
              onChange={(e) => setCodCom(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="name">
            <Form.Label>Tipo Comprobante</Form.Label>
            <Form.Control
              value={nameCom}
              onChange={(e) => setNameCom(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Check
            className="mb-3"
            type="checkbox"
            id="isHaber"
            label="Imputa en Cuenta Haber"
            checked={isHaber}
            onChange={(e) => setIsHaber(e.target.checked)}
          />
          <Form.Check
            className="mb-3"
            type="checkbox"
            id="noDisc"
            label="No Discrimina IVA"
            checked={noDisc}
            onChange={(e) => setNoDisc(e.target.checked)}
          />
          <Form.Check
            className="mb-3"
            type="checkbox"
            id="itDisc"
            label="Discrimina IVA en Item"
            checked={itDisc}
            onChange={(e) => setItDisc(e.target.checked)}
          />
          <Form.Check
            className="mb-3"
            type="checkbox"
            id="toDisc"
            label="Discrimina IVA en Total"
            checked={toDisc}
            onChange={(e) => setToDisc(e.target.checked)}
          />

          {/* <Form.Group className="mb-3" controlId="name">
            <Form.Label>Clave Comprobante</Form.Label>
            <Form.Control
              value={claCom}
              onChange={(e) => setClaCom(e.target.value)}
              required
            />
          </Form.Group> */}
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
