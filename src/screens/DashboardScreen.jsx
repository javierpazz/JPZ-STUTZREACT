import React, { useContext, useEffect, useReducer, useState } from 'react';
import Chart from 'react-google-charts';
import axios from 'axios';
import { Store } from '../Store';
import { getError, API } from '../utils';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        summary: action.payload,
        loading: false,
      };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};
export default function DashboardScreen() {
  const [{ loading, summary, error }, dispatch] = useReducer(reducer, {
    loading: true,
    error: '',
  });
  const { state } = useContext(Store);
  const { userInfo } = state;

  const fech1 = userInfo.filtro.firstDat;
  const fech2 = userInfo.filtro.lastDat;
  const codCon = userInfo.filtro.codCon;
  const codCom = userInfo.filtro.codCom;
  const codCus = userInfo.filtro.codCus;
  const codSup = userInfo.filtro.codSup;
  const codPro = userInfo.filtro.codPro;
  const codVal = userInfo.filtro.codVal;
  const codCon2 = userInfo.filtro.codCon2;
  const codEnc = userInfo.filtro.codEnc;
  const codUse = userInfo.filtro.codUse;
  const order = userInfo.filtro.order;
  



  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(`${API}/api/orders/summary?fech1=${fech1}&fech2=${fech2}&configuracion=${codCon}&usuario=${codUse}&customer=${codCus}`, {
            headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
        console.log(data);
      } catch (err) {
        dispatch({
          type: 'FETCH_FAIL',
          payload: getError(err),
        });
      }
    };
    fetchData();
  }, [userInfo]);

  const optionsPrIO = {
    title: 'Recepcion y Entregas de Productos',
    curveType: 'function',
    legend: { position: 'bottom' },
  };

  const optionsBuOu = {
    title: 'Compras y Pagos',
    curveType: 'function',
    legend: { position: 'bottom' },
  };

  const optionsSaIn = {
    title: 'Ventas y Cobros',
    curveType: 'function',
    legend: { position: 'bottom' },
  };

  const optionsMon = {
    title: 'Flujo de Dinero',
    curveType: 'function',
    legend: { position: 'bottom' },
  };

  const optionsSal = {
    title: 'Ventas y Compras',
    curveType: 'function',
    legend: { position: 'bottom' },
  };
  const optionsCat = {
    title: 'Categories',
    is3D: true,
  };

  const navigate = useNavigate();

  const parametros = async () => {
    navigate(`/admin/filtros?redirect=/admin/dashboard`);
  };


  return (
    <div>
      <h1>Dashboard</h1>


      {loading ? (
        <LoadingBox />
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <>
          <Row>
            <Col md={2}>
              <Card>
                <Card.Body>
                  <Card.Title>
                    {summary.customers && summary.customers[0]
                      ? summary.customers[0].numCustomers
                      : 0}
                  </Card.Title>
                  <Card.Text> Clientes</Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={2}>
              <Card>
                <Card.Body>
                  <Card.Title>
                    {summary.users && summary.users[0]
                      ? summary.users[0].numUsers
                      : 0}
                  </Card.Title>
                  <Card.Text> Usuarios</Card.Text>
                </Card.Body>
              </Card>
            </Col>

            {(summary.orders.length === 0 ) ? (
            <Col md={3}>
              <Card>
              <Card.Body>
                <Card.Title>
                  <MessageBox>Sin Facturas</MessageBox>
                  </Card.Title>
                </Card.Body>
              </Card>
              </Col>
            ) : (
            <Col md={3}>
              <Card>
                <Card.Body>
                  <Card.Title>
                    {summary.orders[0].numOrders}
                  </Card.Title>
                  <Card.Text> Facturas</Card.Text>
                </Card.Body>
              </Card>
            </Col>
            )}

            {(summary.orders.length === 0 ) ? (
            <Col md={3}>
              <Card>
              <Card.Body>
                <Card.Title>
                  <MessageBox>Sin Facturas</MessageBox>
                  </Card.Title>
                </Card.Body>
              </Card>
              </Col>
            ) : (
            <Col md={3}>
              <Card>
                <Card.Body>
                  <Card.Title>
                    $
                    {summary.orders[0].totalSales.toFixed(2)}
                  </Card.Title>
                  <Card.Text> Importe</Card.Text>
                </Card.Body>
              </Card>
            </Col>
            )}
        {userInfo.isAdmin && (
          
          <Col md={2} className="col text-end">
          <div>
            <Button type="button"
                    variant="primary"
                    onClick={parametros}
                    >
              Ver Filtros
            </Button>
            </div>
        </Col>
                  )}

          </Row>
          <Row>
            {summary.dailyOrders.length === 0 ? (
              <MessageBox>No Sale</MessageBox>
            ) : (
              <Col md={12}>
                <Card>
                  <Card.Body>
                    <Chart
                      width="100%"
                      height="300px"
                      chartType="LineChart"
                      loader={<div>Loading Chart...</div>}
                      data={[
                        ['Dia', 'Ventas', 'Compras'],
                        ...summary.dailyOrders.map((x) => [
                          x._id,
                          x.sales,
                          x.buys,
                        ]),
                      ]}
                      options={optionsSal}
                    ></Chart>
                  </Card.Body>
                </Card>
              </Col>
            )}
            {summary.dailyMoney.length === 0 ? (
              <MessageBox>No Money</MessageBox>
            ) : (
              <Col md={12}>
                <Card>
                  <Card.Body>
                    <Chart
                      width="100%"
                      height="300px"
                      chartType="LineChart"
                      loader={<div>Loading Chart...</div>}
                      data={[
                        ['Dia', '$ Cobros', '$ Pagos'],
                        ...summary.dailyMoney.map((x) => [
                          x._id,
                          x.inputs,
                          x.outputs,
                        ]),
                      ]}
                      options={optionsMon}
                    ></Chart>
                  </Card.Body>
                </Card>
              </Col>
            )}

            {summary.ctacte.length === 0 ? (
              <MessageBox>No Data</MessageBox>
            ) : (
              <Col md={12}>
                <Card>
                  <Card.Body>
                    <Chart
                      width="100%"
                      height="300px"
                      chartType="LineChart"
                      loader={<div>Loading Chart...</div>}
                      data={[
                        ['Dia', '$ Ventas', '$ Cobros'],
                        ...summary.ctacte.map((x) => [
                          x._id,
                          x.salesS,
                          x.inputsS,
                        ]),
                      ]}
                      options={optionsSaIn}
                    ></Chart>
                  </Card.Body>
                </Card>
              </Col>
            )}

            {summary.ctacte.length === 0 ? (
              <MessageBox>No Data</MessageBox>
            ) : (
              <Col md={12}>
                <Card>
                  <Card.Body>
                    <Chart
                      width="100%"
                      height="300px"
                      chartType="LineChart"
                      loader={<div>Loading Chart...</div>}
                      data={[
                        ['Dia', '$ Compras', '$ Pagos'],
                        ...summary.ctacte.map((x) => [
                          x._id,
                          x.salesB,
                          x.inputsB,
                        ]),
                      ]}
                      options={optionsBuOu}
                    ></Chart>
                  </Card.Body>
                </Card>
              </Col>
            )}

            {summary.producIO.length === 0 ? (
              <MessageBox>No Data</MessageBox>
            ) : (
              <Col md={12}>
                <Card>
                  {/* {console.log(summary.producIO)} */}
                  <Card.Body>
                    <Chart
                      width="100%"
                      height="300px"
                      chartType="LineChart"
                      loader={<div>Loading Chart...</div>}
                      data={[
                        ['Dia', 'Recepciones', '$ Entregas'],
                        ...summary.producIO.map((x) => [
                          x._id,
                          x.entro,
                          x.salio,
                        ]),
                      ]}
                      options={optionsPrIO}
                    ></Chart>
                  </Card.Body>
                </Card>
              </Col>
            )}

            {summary.productCategories.length === 0 ? (
              <MessageBox>No Category</MessageBox>
            ) : (
              <Col md={4}>
                <Card>
                  <Card.Body>
                    <Chart
                      width="100%"
                      height="400px"
                      chartType="PieChart"
                      loader={<div>Loading Chart...</div>}
                      data={[
                        ['Category', 'Products'],
                        ...summary.productCategories.map((x) => [
                          x._id,
                          x.count,
                        ]),
                      ]}
                      options={optionsCat}
                    ></Chart>
                  </Card.Body>
                </Card>
              </Col>
            )}
          </Row>
        </>
      )}
    </div>
  );
}
