import React, { useContext, useEffect, useReducer, useState } from 'react';
import axios from 'axios';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { toast } from 'react-toastify';
import { AiOutlineDelete, AiOutlineEdit } from 'react-icons/ai';
import { Store } from '../Store';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { getError, API } from '../utils';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        comprobantes: action.payload.comprobantes,
        page: action.payload.page,
        pages: action.payload.pages,
        loading: false,
      };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    case 'CREATE_REQUEST':
      return { ...state, loadingCreate: true };
    case 'CREATE_SUCCESS':
      return {
        ...state,
        loadingCreate: false,
      };
    case 'CREATE_FAIL':
      return { ...state, loadingCreate: false };

    case 'DELETE_REQUEST':
      return { ...state, loadingDelete: true, successDelete: false };
    case 'DELETE_SUCCESS':
      return {
        ...state,
        loadingDelete: false,
        successDelete: true,
      };
    case 'DELETE_FAIL':
      return { ...state, loadingDelete: false, successDelete: false };

    case 'DELETE_RESET':
      return { ...state, loadingDelete: false, successDelete: false };
    default:
      return state;
  }
};

export default function ComprobanteListScreen() {
  const [
    {
      loading,
      error,
      comprobantes,
      pages,
      loadingCreate,
      loadingDelete,
      successDelete,
    },
    dispatch,
  ] = useReducer(reducer, {
    loading: true,
    error: '',
  });

  const navigate = useNavigate();
  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const page = sp.get('page') || 1;

  const { state } = useContext(Store);
  const { userInfo } = state;
  const [id_config, setId_config] = useState(userInfo.codCon);
  console.log(id_config);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(`${API}/api/comprobantes/admin?page=${page}&id_config=${id_config} `, 
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });

        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {}
    };

    if (successDelete) {
      dispatch({ type: 'DELETE_RESET' });
    } else {
      fetchData();
    }
  }, [page, userInfo, successDelete]);

  const listado = async () => {
    navigate('/admin/comprobanteList?redirect=/admin/comprobantes');
  };
  const createHandler = async () => {
        navigate(`/admin/comprobante/0`);
  };

  const deleteHandler = async (comprobante) => {
    if (window.confirm('Are you sure to delete?')) {
      try {
        await axios.delete(`${API}/api/comprobantes/${comprobante._id}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        toast.success('comprobante deleted successfully');
        dispatch({ type: 'DELETE_SUCCESS' });
      } catch (err) {
        toast.error(getError(error));
        dispatch({
          type: 'DELETE_FAIL',
        });
      }
    }
  };

  return (
    <div>
      <Row>
        <Col>
          <h1>Comprobantes</h1>
        </Col>
        <Col className="col text-end">
          <div>
            <Button type="button"
                    variant="primary"
                    onClick={listado}
                  >
              Listar
            </Button>
            </div>
        </Col>
        <Col className="col text-end">
          <div>
            <Button type="button" onClick={createHandler}>
              Crea Comprobante
            </Button>
          </div>
        </Col>
      </Row>

      {loadingCreate && <LoadingBox></LoadingBox>}

      {loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <>
          <table className="table">
            <thead>
              <tr>
                <th>CODIGO COMPROBANTE</th>
                <th>DESCRIPCION</th>
                <th>IMPUTA EN CUENTA</th>
                <th>TIPO</th>
                <th>NUMERACION</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {comprobantes.map((comprobante) => (
                <tr key={comprobante._id}>
                  <td className='text-end'>{comprobante.codCom}</td>
                  <td>{comprobante.nameCom}</td>
                  <td>{comprobante.isHaber == true ? 'HABER' : 'DEBE'}</td>
                  <td>{comprobante.interno == false ? 'REMOTO' : 'INTERNO'}</td>
                  <td className='text-end'>{comprobante.numInt}</td>
                  <td>
                    <Button
                      type="button"
                      title="Edit"
                      onClick={() =>
                        navigate(`/admin/comprobante/${comprobante._id}`)
                      }
                    >
                      <AiOutlineEdit className="text-blue-500 font-bold text-xl" />
                    </Button>
                    &nbsp;
                    <Button
                      type="button"
                      title="Delete"
                      onClick={() => deleteHandler(comprobante)}
                    >
                      <AiOutlineDelete className="text-red-500 font-bold text-xl" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div>
            {[...Array(pages).keys()].map((x) => (
              <Link
                className={x + 1 === Number(page) ? 'btn text-bold' : 'btn'}
                key={x + 1}
                to={`/admin/comprobantes?page=${x + 1}&id_config=${id_config}`}
              >
                {x + 1}
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
