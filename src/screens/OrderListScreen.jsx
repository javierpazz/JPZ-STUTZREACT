import axios from 'axios';
import React, { useContext, useEffect, useReducer, useState } from 'react';
import { toast } from 'react-toastify';
import {
  AiOutlineDelete,
  AiOutlineEdit,
  AiFillPrinter,
  AiOutlineMail,
} from 'react-icons/ai';

import Button from 'react-bootstrap/Button';
import { Helmet } from 'react-helmet-async';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { Store } from '../Store';
import { getError, API } from '../utils';
import Modal from 'react-bootstrap/Modal';
import OrderState from './OrderState';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        orders: action.payload.orders,
        page: action.payload.page,
        pages: action.payload.pages,
        loading: false,
      };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    case 'DELETE_REQUEST':
      return { ...state, loadingDelete: true, successDelete: false };
    case 'DELETE_SUCCESS':
      return {
        ...state,
        loadingDelete: false,
        successDelete: true,
      };
    case 'DELETE_FAIL':
      return { ...state, loadingDelete: false };
    case 'DELETE_RESET':
      return { ...state, loadingDelete: false, successDelete: false };
    default:
      return state;
  }
};
export default function OrderListScreen() {
  const navigate = useNavigate();
  const { state } = useContext(Store);
  const { userInfo } = state;
  const [
    { loading, error, orders, pages, loadingDelete, successDelete },
    dispatch,
  ] = useReducer(reducer, {
    loading: true,
    error: '',
  });

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const page = sp.get('page') || 1;
  const [show, setShow] = useState(false);
  const [invoice, setInvoice] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`${API}/api/orders/admin?page=${page} `, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({
          type: 'FETCH_FAIL',
          payload: getError(err),
        });
      }
    };
    if (successDelete) {
      dispatch({ type: 'DELETE_RESET' });
    } else {
      fetchData();
    }
  }, [page, userInfo, successDelete, show]);

  const noDelOrder = async () => {
    if (window.confirm('This Order Have an Invoice Or Remit, You Must delete this Before')) {
    }
  };


//do
const controlStockHandler = async (order) => {
  order.orderItems.map((item) => stockHandler({ item }));
};

const stockHandler = async (item) => {
try {
  dispatch({ type: 'CREATE_REQUEST' });
  await axios.put(
    `${API}/api/products/upstock/${item.item._id}`,
    {
      quantitys: item.item.quantity,
    },
    {
      headers: {
        authorization: `Bearer ${userInfo.token}`,
      },
    }
  );
  dispatch({ type: 'CREATE_SUCCESS' });
} catch (err) {
  dispatch({ type: 'CREATE_FAIL' });
  toast.error(getError(err));
}
};

//do


  const deleteHandler = async (order) => {
    if (order.remNum || order.invNum) {
      noDelOrder();
    } else {
      if (window.confirm('Are you sure to delete?')) {
        controlStockHandler(order);
        try {
          dispatch({ type: 'DELETE_REQUEST' });
          await axios.delete(`${API}/api/orders/${order._id}`, {
            headers: { Authorization: `Bearer ${userInfo.token}` },
          });
          toast.success('order deleted successfully');
          dispatch({ type: 'DELETE_SUCCESS' });
        } catch (err) {
          toast.error(getError(error));
          dispatch({
            type: 'DELETE_FAIL',
          });
        }
      }
    }
  };

  const handleState = (invoice) => {
    setInvoice(invoice);
    setShow(true);
  };

  const handleShow = (orderId) => {
    navigate(`/admin/invoicerOrd/${orderId}`);
  };
  return (
    <div>
      <Helmet>
        <title>Orders</title>
      </Helmet>
      <h1>Orders</h1>
      {loadingDelete && <LoadingBox></LoadingBox>}
      {loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <>
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>USER</th>
                <th>DATE</th>
                <th>TOTAL</th>
                <th>INVOICE</th>
                <th>STATE</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td>{order._id}</td>
                  <td>{order.user ? order.user.name : 'DELETED CLIENT'}</td>
                  <td>{order.createdAt.substring(0, 10)}</td>
                  <td>{order.total.toFixed(2)}</td>
                  <td>{order.invNum}</td>
                  <td>{order.staOrd}</td>

                  <td>
                    <Button
                      type="button"
                      variant="light"
                      onClick={() => {
                        navigate(`/order/${order._id}`);
                      }}
                    >
                      Details
                    </Button>
                  </td>
                  <td>
                    <Button
                      type="button"
                      title="Imprimir"
                      onClick={() => {
                        navigate(`/invoice/${order._id}`);
                      }}
                    >
                      <AiFillPrinter className="text-black-500 font-bold text-xl" />
                    </Button>
                    &nbsp;
                    <Button
                      type="button"
                      title="Send Email"
                      onClick={() => {
                        navigate(`/invoice/${order._id}`);
                      }}
                    >
                      <AiOutlineMail className="text-black-500 font-bold text-xl" />
                    </Button>
                    &nbsp;
                    <Button
                      type="button"
                      title="Invoice Order"
                      onClick={() => handleShow(order._id)}
                      disabled={order.invNum}
                    >
                      <AiOutlineEdit className="text-blue-500 font-bold text-xl" />
                    </Button>
                    &nbsp;
                    <Button
                      type="button"
                      title="Order State"
                      onClick={() => handleState(order)}
                    >
                      <AiOutlineEdit className="text-blue-500 font-bold text-xl" />
                    </Button>
                    &nbsp;
                    <Button
                      type="button"
                      title="Delete"
                      onClick={() => deleteHandler(order)}
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
                to={`/admin/orders?page=${x + 1}`}
              >
                {x + 1}
              </Link>
            ))}
          </div>
          <Modal
            size="xl"
            show={show}
            onHide={() => setShow(false)}
            aria-labelledby="example-modal-sizes-title-lg"
          >
            <Modal.Header closeButton>
              <Modal.Title id="example-modal-sizes-title-lg">
                State Order N° {invoice._id}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <OrderState invoice={invoice} show={show} setShow={setShow} />
            </Modal.Body>
          </Modal>
        </>
      )}
    </div>
  );
}
