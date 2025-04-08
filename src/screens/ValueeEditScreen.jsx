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
export default function ValueEditScreen() {
  const navigate = useNavigate();
  const params = useParams(); // /valuee/:id
  const { id: valueeId } = params;

  const { state } = useContext(Store);
  const { userInfo } = state;
  const [{ loading, error, loadingUpdate, loadingUpload }, dispatch] =
    useReducer(reducer, {
      loading: true,
      error: '',
    });

  const [codVal, setCodVal] = useState('');
  const [desVal, setDesVal] = useState('');

  useEffect(() => {
    if (valueeId === "0") {
      setCodVal('');
      setDesVal('');
    }
    else {
      const fetchData = async () => {
        try {
          dispatch({ type: 'FETCH_REQUEST' });
          const { data } = await axios.get(`${API}/api/valuees/${valueeId}`);
          setCodVal(data.codVal);
          setDesVal(data.desVal);
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
  }, [valueeId]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (valueeId === "0") {
    try {
        dispatch({ type: 'UPDATE_REQUEST' });
        await axios.post(
          `${API}/api/valuees`,
          {
            codVal,
            desVal,
          },
          {
            headers: { Authorization: `Bearer ${userInfo.token}` },
          }
        );
        dispatch({
          type: 'UPDATE_SUCCESS',
        });
        toast.success('Value updated successfully');
        navigate('/admin/valuees');
      } catch (err) {
        toast.error(getError(err));
        dispatch({ type: 'UPDATE_FAIL' });
      }
      }
      else 
      {
        try {
        dispatch({ type: 'UPDATE_REQUEST' });
        await axios.put(
          `${API}/api/valuees/${valueeId}`,
          {
            // _id: valueeId,
            codVal,
            desVal,
          },
          {
            headers: { Authorization: `Bearer ${userInfo.token}` },
          }
        );
        dispatch({
          type: 'UPDATE_SUCCESS',
        });
        toast.success('Value updated successfully');
        navigate('/admin/valuees');
      } catch (err) {
        toast.error(getError(err));
        dispatch({ type: 'UPDATE_FAIL' });
      }
    };
  };

  return (
    <Container className="small-container">
      <Helmet>
        <title>Edit Valor</title>
      </Helmet>
      <h1>Edit Valor</h1>

      {false ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <Form onSubmit={submitHandler}>
          <Form.Group className="mb-3" controlId="slug">
            <Form.Label>Codigo</Form.Label>
            <Form.Control
              value={codVal}
              onChange={(e) => setCodVal(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="desVal">
            <Form.Label>Descripcion Valor</Form.Label>
            <Form.Control
              value={desVal}
              onChange={(e) => setDesVal(e.target.value)}
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
