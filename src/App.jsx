import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import HomeScreen from './screens/HomeScreen';
import ProductScreen from './screens/ProductScreen';
import Navbar from 'react-bootstrap/Navbar';
import Badge from 'react-bootstrap/Badge';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Container from 'react-bootstrap/Container';
import { LinkContainer } from 'react-router-bootstrap';
import { useContext, useEffect, useState } from 'react';
import { Store } from './Store';
import CartScreen from './screens/CartScreen';
import SigninScreen from './screens/SigninScreen';
import SalePointScreen from './screens/SalePointScreen';
import ShippingAddressScreen from './screens/ShippingAddressScreen';
import SignupScreen from './screens/SignupScreen';
import PaymentMethodScreen from './screens/PaymentMethodScreen';
import PlaceOrderScreen from './screens/PlaceOrderScreen';
import OrderScreen from './screens/OrderScreen';
import InvoiceHistoryScreen from './screens/InvoiceHistoryScreen';
import OrderHistoryScreen from './screens/OrderHistoryScreen';
import ProfileScreen from './screens/ProfileScreen';
import Button from 'react-bootstrap/Button';
import { getError } from './utils';
import axios from 'axios';
import SearchBox from './components/SearchBox';
import SearchScreen from './screens/SearchScreen';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardScreen from './screens/DashboardScreen';
import AdminRoute from './components/AdminRoute';
import ProductListScreen from './screens/ProductListScreen';
import ProductListPrint from './screens/ProductListPrint';
import ProductEditScreen from './screens/ProductEditScreen';

import AccountUserScreen from './screens/AccountUserScreen';
import AccountCustomerScreen from './screens/AccountCustomerScreen';
import AccountSuppliScreen from './screens/AccountSuppliScreen';
import InvoiceListScreen from './screens/InvoiceListScreen';
import RemitListScreen from './screens/RemitListScreen';
import RemitpvListScreen from './screens/RemitpvListScreen';
import InvoiceBuyListScreen from './screens/InvoiceBuyListScreen';
import RemitBuyListScreen from './screens/RemitBuyListScreen';
import RemitBuypvListScreen from './screens/RemitBuypvListScreen';
import ReceiptListScreen from './screens/ReceiptListScreen';
import CajaIngListScreen from './screens/CajaIngListScreen';
import CajaIngEgrListScreen from './screens/CajaIngEgrListScreen';
import IngEgrListScreen from './screens/IngEgrListScreen';
import CtaCusListScreen from './screens/CtaCusListScreen';
import CtaSupListScreen from './screens/CtaSupListScreen';
import CusProListScreen from './screens/CusProListScreen';
import ProiyeListScreen from './screens/ProiyeListScreen';
import SupProListScreen from './screens/SupProListScreen';
import ProCusListScreen from './screens/ProCusListScreen';
import ProSupListScreen from './screens/ProSupListScreen';
import CajaEgrListScreen from './screens/CajaEgrListScreen';
import ReceiptBuyListScreen from './screens/ReceiptBuyListScreen';
import OrderListScreen from './screens/OrderListScreen';
import SupplierListScreen from './screens/SupplierListScreen';
import SupplierEditScreen from './screens/SupplierEditScreen';
import CustomerListScreen from './screens/CustomerListScreen';
import CustomerEditScreen from './screens/CustomerEditScreen';
import StateOrdListScreen from './screens/StateOrdListScreen';
import StateOrdEditScreen from './screens/StateOrdEditScreen';
import UserListScreen from './screens/UserListScreen';
import UserEditScreen from './screens/UserEditScreen';
import EncargadoListScreen from './screens/EncargadoListScreen';
import EncargadoEditScreen from './screens/EncargadoEditScreen';
import ValueeListScreen from './screens/ValueeListScreen';
import ValueeEditScreen from './screens/ValueeEditScreen';
import ConfigurationListScreen from './screens/ConfigurationListScreen';
import ConfigurationEditScreen from './screens/ConfigurationEditScreen';
import ComprobanteListScreen from './screens/ComprobanteListScreen';
import ComprobanteEditScreen from './screens/ComprobanteEditScreen';
import InvoicesOrd from './invoice/src/InvoicesOrd';
import InvoicesCon from './invoice/src/InvoicesCon';
import InvoicesBuyCon from './invoice/src/InvoicesBuyCon';
import InvoicesRemCon from './invoice/src/InvoicesRemCon';
import InvoicesRempvCon from './invoice/src/InvoicesRempvCon';
import InvoicesRecCon from './invoice/src/InvoicesRecCon';
import InvoicesCajIngCon from './invoice/src/InvoicesCajIngCon';
import InvoicesCajEgrCon from './invoice/src/InvoicesCajEgrCon';
import InvoicesBuyRecCon from './invoice/src/InvoicesBuyRecCon';
import InvoicesBuyRemCon from './invoice/src/InvoicesBuyRemCon';
import InvoicesBuyRempvCon from './invoice/src/InvoicesBuyRempvCon';
import Invoices from './invoice/src/Invoices';
import Filtros from './invoice/src/Filtros';
import Precios from './invoice/src/Precios';
import Remits from './invoice/src/Remits';
import Remitspv from './invoice/src/Remitspv';
import InvoicesRec from './invoice/src/InvoicesRec';
import InvoicesBuy from './invoice/src/InvoicesBuy';
import InvoicesCajIng from './invoice/src/InvoicesCajIng';
import InvoicesCajEgr from './invoice/src/InvoicesCajEgr';
import RemitsBuy from './invoice/src/RemitsBuy';
import RemitsBuypv from './invoice/src/RemitsBuypv';
import InvoicesBuyRec from './invoice/src/InvoicesBuyRec';
import MapScreen from './screens/MapScreen';
import ForgetPasswordScreen from './screens/ForgetPasswordScreen';
import ResetPasswordScreen from './screens/ResetPasswordScreen';
import SupportScreen from './screens/SupportScreen';
import ChatBox from './components/ChatBox';
import {API} from './utils';


function App() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { fullBox, cart, invoice, userInfo } = state;

  const signoutHandler = () => {
    ctxDispatch({ type: 'USER_SIGNOUT' });
    localStorage.removeItem('userInfo');
    localStorage.removeItem('shippingAddress');
    localStorage.removeItem('paymentMethod');
    window.location.href = '/signin';
  };
  const [sidebarIsOpen, setSidebarIsOpen] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(`${API}/api/products/categories`);
        setCategories(data);
        // console.log(userInfo);
      } catch (err) {
        toast.error(getError(err));
      }
    };
    fetchCategories();
  }, []);
  return (
    <BrowserRouter>
      <div
        className={
          sidebarIsOpen
            ? fullBox
              ? 'site-container active-cont d-flex flex-column full-box'
              : 'site-container active-cont d-flex flex-column'
            : fullBox
            ? 'site-container d-flex flex-column full-box'
            : 'site-container d-flex flex-column'
        }
      >
        <ToastContainer position="bottom-center" limit={1} />
        <header>
          <Navbar bg="dark" variant="dark" expand="lg">
            <Container>
{/* /////////////////  borrar ecomerce  ////////////////////// */}
              {/* <Button
                variant="dark"
                onClick={() => setSidebarIsOpen(!sidebarIsOpen)}
              >
                <i className="fas fa-bars"></i>
              </Button> */}
{/* /////////////////  borrar ecomerce  ////////////////////// */}
              {(userInfo && userInfo.nameCon) && (
                <LinkContainer to="/salepoint">
                <Navbar.Brand>Punto.: {userInfo && userInfo.salePoint || ""}</Navbar.Brand>
              </LinkContainer>
              )}
              {(userInfo && userInfo.nameCon) && (
                <LinkContainer to="/salepoint">
                <Navbar.Brand>{userInfo && userInfo.nameCon || ""}</Navbar.Brand>
              </LinkContainer>
              )}
              {userInfo && (
                <LinkContainer  className="nav-link" to="/">
                <Navbar.Brand >User.:  {userInfo && userInfo.name || ""}</Navbar.Brand>
              </LinkContainer>
              )}
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse id="basic-navbar-nav">
{/* /////////////////  borrar ecomerce  ////////////////////// */}
                {/* <SearchBox /> */}
{/* /////////////////  borrar ecomerce  ////////////////////// */}
                <Nav className="me-auto  w-100  justify-content-end">
{/* /////////////////  borrar ecomerce  ////////////////////// */}
                  {/* <Link to="/cart" className="nav-link">
                    Cart
                    {cart.cartItems.length > 0 && (
                      <Badge pill bg="danger">
                        {cart.cartItems.reduce((a, c) => a + c.quantity, 0)}
                      </Badge>
                    )}
                  </Link>
                  {userInfo ? (
                    <NavDropdown title={userInfo.name} id="basic-nav-dropdown">
                      <LinkContainer to="/profile">
                        <NavDropdown.Item>User Profile</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/invoicehistory">
                        <NavDropdown.Item>Inoice History</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/orderhistory">
                        <NavDropdown.Item>Order History</NavDropdown.Item>
                      </LinkContainer>
                      <NavDropdown.Divider />
                      <Link
                        className="dropdown-item"
                        to="#signout"
                        onClick={signoutHandler}
                      >
                        Sign Out
                      </Link>
                    </NavDropdown>
                  ) : (
                    <Link className="nav-link" to="/signin">
                      Sign In
                    </Link>
                  )} */}
{/* /////////////////  borrar ecomerce  ////////////////////// */}
                  {/* {userInfo && userInfo.role=="admin" && ( */}
                  {userInfo && (
                    <NavDropdown title="Ventas" id="sales-nav-dropdown">
                      <LinkContainer to="/admin/invoicer">
                        <NavDropdown.Item>Comprobantes de Venta</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/admin/invoicerRec">
                        <NavDropdown.Item>Recibos</NavDropdown.Item>
                      </LinkContainer>
                      {/* <LinkContainer to="/admin/invoices"> */}
                      <LinkContainer to="/admin/remiter">
                        <NavDropdown.Item>Remitos de Ventas</NavDropdown.Item>
                      </LinkContainer>
                      {/* <LinkContainer to="/admin/orders">
                        <NavDropdown.Item>Ordenes de Comprars</NavDropdown.Item>
                      </LinkContainer> */}
                      {/* <LinkContainer to="/admin/stateOrds">
                        <NavDropdown.Item>States Order</NavDropdown.Item>
                      </LinkContainer> */}
                      {userInfo && userInfo.role=="admin" && (
                        <LinkContainer to="/admin/infocust">
                          <NavDropdown.Item>Informes</NavDropdown.Item>
                        </LinkContainer>
                        )}
                    </NavDropdown>
                  )}
                  {userInfo && (
                    <NavDropdown title="Compras" id="buys-nav-dropdown">
                      <LinkContainer to="/admin/invoicerBuy">
                        <NavDropdown.Item>Comprobantes de Compra</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/admin/invoicerBuyRec">
                        <NavDropdown.Item>Ordenes de Pago</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/admin/remiterBuy">
                        <NavDropdown.Item>Remitos de Compras</NavDropdown.Item>
                      </LinkContainer>
                      {userInfo && userInfo.role=="admin" && (
                        <LinkContainer to="/admin/infosupp">
                          <NavDropdown.Item>Informes</NavDropdown.Item>
                        </LinkContainer>
                        )}
                    </NavDropdown>
                  )}

                  {userInfo && (
                    <NavDropdown title="Caja" id="buys-nav-dropdown">
                      {/* <LinkContainer to="/admin/invoicesCajIng"> */}
                      <LinkContainer to="/admin/invoicerCajIng">
                        <NavDropdown.Item>Ingresos de Caja</NavDropdown.Item>
                      </LinkContainer>
                      {/* <LinkContainer to="/admin/invoicesCajEgr"> */}
                      <LinkContainer to="/admin/invoicerCajEgr">
                        <NavDropdown.Item>Retiros de Caja</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/admin/invoicesCajIngEgr">
                        <NavDropdown.Item>Consulta Caja</NavDropdown.Item>
                      </LinkContainer>
                      {userInfo && userInfo.role=="admin" && (
                        <LinkContainer to="/admin/infosupp">
                          <NavDropdown.Item>Informes</NavDropdown.Item>
                        </LinkContainer>
                        )}
                    </NavDropdown>
                  )}

                  {userInfo && (
                    <NavDropdown title="Stocks Ptos Venta" id="buys-nav-dropdown">
                      <LinkContainer to="/admin/remiterpv">
                        <NavDropdown.Item>Entregas a Punto Venta</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/admin/remiterBuypv">
                        <NavDropdown.Item>Recepcion desde Punto de Venta</NavDropdown.Item>
                      </LinkContainer>
                      {userInfo && userInfo.role=="admin" && (
                        <LinkContainer to="/admin/infosupp">
                          <NavDropdown.Item>Informes</NavDropdown.Item>
                        </LinkContainer>
                        )}
                    </NavDropdown>
                  )}

                  {/* {userInfo && userInfo.role=="admin" && ( */}
                  {userInfo && (
                    <NavDropdown title="Admin" id="admin-nav-dropdown">
                      <LinkContainer to="/admin/dashboard">
                        <NavDropdown.Item>Dashboard</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/admin/remits">
                        <NavDropdown.Item>Remitos de Venta</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/admin/invoices">
                        <NavDropdown.Item>Comprobantes de Ventas</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/admin/invoicesRec">
                        <NavDropdown.Item>Recibos </NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/admin/remitsBuy">
                        <NavDropdown.Item>Remitos de Compra</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/admin/invoicesBuy">
                        <NavDropdown.Item>Comprobantes de Compras</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/admin/invoicesBuyRec">
                        <NavDropdown.Item>Ordenes de Pago</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/admin/invoicesCajIng">
                        <NavDropdown.Item>Ingresos de Caja</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/admin/invoicesCajEgr">
                        <NavDropdown.Item>Retiros de Caja</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/admin/remitspv">
                        <NavDropdown.Item>Entregas a Pto Vta</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/admin/remitsBuypv">
                        <NavDropdown.Item>Recepcion desde Pto Vta</NavDropdown.Item>
                      </LinkContainer>
                      {/* <LinkContainer to="/admin/support">
                        <NavDropdown.Item>Chat Support</NavDropdown.Item>
                      </LinkContainer> */}


                    </NavDropdown>
                  )}
                  {userInfo && userInfo.role=="admin" && (
                    <NavDropdown title="Configuracion" id="admin-nav-dropdown">
                      <LinkContainer to="/admin/filtros">
                        <NavDropdown.Item>Informes y Filtros</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/admin/products">
                        <NavDropdown.Item>Productos</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/admin/customers">
                        <NavDropdown.Item>Clientes</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/admin/suppliers">
                        <NavDropdown.Item>Proveedores</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/admin/valuees">
                        <NavDropdown.Item>Valores</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/admin/comprobantes">
                        <NavDropdown.Item>Comprobantes</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/admin/configurations">
                        <NavDropdown.Item>Puntos de Venta</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/admin/encargados">
                        <NavDropdown.Item>Encargados</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/admin/users">
                        <NavDropdown.Item>Usuarios</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/profile">
                        <NavDropdown.Item>User Profile</NavDropdown.Item>
                      </LinkContainer>
                      {/* <LinkContainer to="/admin/support">
                        <NavDropdown.Item>Chat Support</NavDropdown.Item>
                      </LinkContainer> */}


                    </NavDropdown>
                  )}
                  {(userInfo && !userInfo.isAdmin) && (
                    <NavDropdown title="Configuracion" id="basic-nav-dropdown">
                      <LinkContainer to="/admin/customers">
                        <NavDropdown.Item>Clientes</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/admin/suppliers">
                        <NavDropdown.Item>Proveedores</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/admin/productsList">
                        <NavDropdown.Item>Productos</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/profile">
                        <NavDropdown.Item>PerFil de Usuario</NavDropdown.Item>
                      </LinkContainer>
                    </NavDropdown>
                  )}

                  {userInfo ? (
                      <Link
                        className="nav-link"
                        to="#signout"
                        onClick={signoutHandler}
                      >
                        Salir
                      </Link>
                  ) : (
                    <Link className="nav-link" to="/signin">
                      Entrar
                    </Link>
                  )}
                </Nav>
              </Navbar.Collapse>
            </Container>
          </Navbar>
        </header>
        <div
          className={
            sidebarIsOpen
              ? 'active-nav side-navbar d-flex justify-content-between flex-wrap flex-column'
              : 'side-navbar d-flex justify-content-between flex-wrap flex-column'
          }
        >
          <Nav className="flex-column text-white w-100 p-2">
            <Nav.Item>
              <strong>Categories</strong>
            </Nav.Item>
{/* /////////////////  borrar ecomerce  ////////////////////// */}
            {/* {categories.map((type) => (
              <Nav.Item key={type}>
                <LinkContainer
                  to={`/search?category=${type}`}
                  onClick={() => setSidebarIsOpen(false)}
                >
                  <Nav.Link>{type}</Nav.Link>
                </LinkContainer>
              </Nav.Item>
            ))} */}
{/* /////////////////  borrar ecomerce  ////////////////////// */}
</Nav>
        </div>
        <main>
          <Container className="mt-3">
            <Routes>
              <Route path="/product/:slug" element={<ProductScreen />} />
              <Route path="/cart" element={<CartScreen />} />
              <Route path="/search" element={<SearchScreen />} />
              <Route path="/signin" element={<SigninScreen />} />
              {/* <Route path="/signup" element={<SignupScreen />} /> */}
              <Route
                path="/forget-password"
                element={<ForgetPasswordScreen />}
              />
              <Route
                path="/reset-password/:token"
                element={<ResetPasswordScreen />}
              />
              <Route
                path="/salepoint"
                element={
                  <ProtectedRoute>
                    <SalePointScreen />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfileScreen />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/map"
                element={
                  <ProtectedRoute>
                    <MapScreen />
                  </ProtectedRoute>
                }
              />
              <Route path="/placeorder" element={<PlaceOrderScreen />} />
              <Route
                path="/order/:id"
                element={
                  <ProtectedRoute>
                    <OrderScreen />
                  </ProtectedRoute>
                }
              ></Route>
              <Route
                path="/invoicehistory"
                element={
                  <ProtectedRoute>
                    <InvoiceHistoryScreen />
                  </ProtectedRoute>
                }
              ></Route>
              <Route
                path="/orderhistory"
                element={
                  <ProtectedRoute>
                    <OrderHistoryScreen />
                  </ProtectedRoute>
                }
              ></Route>
              <Route
                path="/shipping"
                element={<ShippingAddressScreen />}
              ></Route>
              <Route path="/payment" element={<PaymentMethodScreen />}></Route>
              {/* Admin Routes */}
              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardScreen />
                  </ProtectedRoute>
                }
              ></Route>
              <Route
                path="/admin/invoices"
                element={
                  <ProtectedRoute>
                    <InvoiceListScreen />
                  </ProtectedRoute>
                }
              ></Route>
              <Route
                path="/admin/remits"
                element={
                  <ProtectedRoute>
                    <RemitListScreen />
                  </ProtectedRoute>
                }
              ></Route>
              <Route
                path="/admin/remitspv"
                element={
                  <ProtectedRoute>
                    <RemitpvListScreen />
                  </ProtectedRoute>
                }
              ></Route>
              <Route
                path="/admin/invoicesBuy"
                element={
                  <ProtectedRoute>
                    <InvoiceBuyListScreen />
                  </ProtectedRoute>
                }
              ></Route>
              <Route
                path="/admin/remitsBuy"
                element={
                  <ProtectedRoute>
                    <RemitBuyListScreen />
                  </ProtectedRoute>
                }
              ></Route>
              <Route
                path="/admin/remitsBuypv"
                element={
                  <ProtectedRoute>
                    <RemitBuypvListScreen />
                  </ProtectedRoute>
                }
              ></Route>
              <Route
                path="/admin/invoicesRec"
                element={
                  <ProtectedRoute>
                    <ReceiptListScreen />
                  </ProtectedRoute>
                }
              ></Route>
              <Route
                path="/admin/invoicesCajIng"
                element={
                  <ProtectedRoute>
                    <CajaIngListScreen />
                  </ProtectedRoute>
                }
              ></Route>
              <Route
                path="/admin/invoicesCajEgr"
                element={
                  <ProtectedRoute>
                    <CajaEgrListScreen />
                  </ProtectedRoute>
                }
              ></Route>
              <Route
                path="/admin/invoicesBuyRec"
                element={
                  <ProtectedRoute>
                    <ReceiptBuyListScreen />
                  </ProtectedRoute>
                }
              ></Route>
              <Route
                path="/admin/orders"
                element={
                  <AdminRoute>
                    <OrderListScreen />
                  </AdminRoute>
                }
              ></Route>
              <Route
                path="/admin/suppliers"
                element={
                  <ProtectedRoute>
                    <SupplierListScreen />
                  </ProtectedRoute>
                }
              ></Route>
              <Route
                path="/admin/supplier/:id"
                element={
                  <ProtectedRoute>
                    <SupplierEditScreen />
                  </ProtectedRoute>
                }
              ></Route>
                <Route
                  path="/admin/customers"
                  element={
                    <ProtectedRoute>
                      <CustomerListScreen />
                    </ProtectedRoute>
                  }
                ></Route>
              <Route
                path="/admin/customer/:id"
                element={
                  <ProtectedRoute>
                    <CustomerEditScreen />
                  </ProtectedRoute>
                }
              ></Route>
              <Route
                path="/admin/informe/proiye"
                element={
                  <ProtectedRoute>
                    <ProiyeListScreen />
                  </ProtectedRoute>
                }
              ></Route>
              <Route
                path="/admin/informe/prosup"
                element={
                  <ProtectedRoute>
                    <ProSupListScreen />
                  </ProtectedRoute>
                }
              ></Route>
              <Route
                path="/admin/informe/procus"
                element={
                  <ProtectedRoute>
                    <ProCusListScreen />
                  </ProtectedRoute>
                }
              ></Route>
              <Route
                path="/admin/informe/suppro"
                element={
                  <ProtectedRoute>
                    <SupProListScreen />
                  </ProtectedRoute>
                }
              ></Route>
              <Route
                path="/admin/informe/cuspro"
                element={
                  <ProtectedRoute>
                    <CusProListScreen />
                  </ProtectedRoute>
                }
              ></Route>
              <Route
                path="/admin/informe/ctasup"
                element={
                  <ProtectedRoute>
                    <CtaSupListScreen />
                  </ProtectedRoute>
                }
              ></Route>
              <Route
                path="/admin/informe/ctacus"
                element={
                  <ProtectedRoute>
                    <CtaCusListScreen />
                  </ProtectedRoute>
                }
              ></Route>
              <Route
                path="/admin/informe/IngEgr"
                element={
                  <ProtectedRoute>
                    <IngEgrListScreen />
                  </ProtectedRoute>
                }
              ></Route>
              <Route
                path="/admin/invoicesCajIngEgr"
                element={
                  <ProtectedRoute>
                    <CajaIngEgrListScreen />
                  </ProtectedRoute>
                }
              ></Route>
              <Route
                path="/admin/stateOrds"
                element={
                  <AdminRoute>
                    <StateOrdListScreen />
                  </AdminRoute>
                }
              ></Route>
              <Route
                path="/admin/stateOrd/:id"
                element={
                  <AdminRoute>
                    <StateOrdEditScreen />
                  </AdminRoute>
                }
              ></Route>
              <Route
                path="/admin/users"
                element={
                  <AdminRoute>
                    <UserListScreen />
                  </AdminRoute>
                }
              ></Route>
              <Route
                path="/admin/encargados"
                element={
                  <AdminRoute>
                    <EncargadoListScreen />
                  </AdminRoute>
                }
              ></Route>
              <Route
                path="/admin/products"
                element={
                  <AdminRoute>
                    <ProductListScreen />
                  </AdminRoute>
                }
              ></Route>
              <Route
                path="/admin/productsList"
                element={
                  <ProtectedRoute>
                    <ProductListPrint />
                  </ProtectedRoute>
                }
              ></Route>
              <Route
                path="/admin/filtros"
                element={
                  <AdminRoute>
                    <Filtros />
                  </AdminRoute>
                }
              ></Route>
              <Route
                path="/admin/precios"
                element={
                  <AdminRoute>
                    <Precios />
                  </AdminRoute>
                }
              ></Route>
              <Route
                path="/admin/valuees"
                element={
                  <AdminRoute>
                    <ValueeListScreen />
                  </AdminRoute>
                }
              ></Route>
              <Route
                path="/admin/configurations"
                element={
                  <AdminRoute>
                    <ConfigurationListScreen />
                  </AdminRoute>
                }
              ></Route>
              <Route
                path="/admin/comprobantes"
                element={
                  <AdminRoute>
                    <ComprobanteListScreen />
                  </AdminRoute>
                }
              ></Route>
              <Route
                path="/admin/support"
                element={
                  <AdminRoute>
                    <SupportScreen/>
                  </AdminRoute>
                }
              ></Route>
              <Route
                path="/admin/invoicer"
                element={
                  <ProtectedRoute>
                    <Invoices />
                  </ProtectedRoute>
                }
              ></Route>
              <Route
                path="/admin/remiter"
                element={
                  <ProtectedRoute>
                    <Remits />
                  </ProtectedRoute>
                }
              ></Route>
              <Route
                path="/admin/remiterpv"
                element={
                  <ProtectedRoute>
                    <Remitspv />
                  </ProtectedRoute>
                }
              ></Route>
              <Route
                path="/admin/invoicerOrd/:id"
                element={
                  <AdminRoute>
                    <InvoicesOrd />
                  </AdminRoute>
                }
              ></Route>
              <Route
                path="/admin/invoicerCon/:id"
                element={
                  <AdminRoute>
                    <InvoicesCon />
                  </AdminRoute>
                }
              ></Route>
              <Route
                path="/admin/invoicerBuyCon/:id"
                element={
                  <AdminRoute>
                    <InvoicesBuyCon />
                  </AdminRoute>
                }
              ></Route>
              <Route
                path="/admin/invoicerRemCon/:id"
                element={
                  <AdminRoute>
                    <InvoicesRemCon />
                  </AdminRoute>
                }
              ></Route>
              <Route
                path="/admin/invoicerRempvCon/:id"
                element={
                  <AdminRoute>
                    <InvoicesRempvCon />
                  </AdminRoute>
                }
              ></Route>
              <Route
                path="/admin/invoicerRecCon/:id"
                element={
                  <AdminRoute>
                    <InvoicesRecCon />
                  </AdminRoute>
                }
              ></Route>
              <Route
                path="/admin/invoicerCajEgrCon/:id"
                element={
                  <AdminRoute>
                    <InvoicesCajEgrCon />
                  </AdminRoute>
                }
              ></Route>
              <Route
                path="/admin/invoicerCajIngCon/:id"
                element={
                  <AdminRoute>
                    <InvoicesCajIngCon />
                  </AdminRoute>
                }
              ></Route>
              <Route
                path="/admin/invoicerBuyRecCon/:id"
                element={
                  <AdminRoute>
                    <InvoicesBuyRecCon />
                  </AdminRoute>
                }
              ></Route>
              <Route
                path="/admin/invoicerBuyRemCon/:id"
                element={
                  <AdminRoute>
                    <InvoicesBuyRemCon />
                  </AdminRoute>
                }
              ></Route>
              <Route
                path="/admin/invoicerBuyRempvCon/:id"
                element={
                  <AdminRoute>
                    <InvoicesBuyRempvCon />
                  </AdminRoute>
                }
              ></Route>
              <Route
                path="/admin/invoicerRec"
                element={
                  <ProtectedRoute>
                    <InvoicesRec />
                  </ProtectedRoute>
                }
              ></Route>
              <Route
                path="/admin/invoicerCajIng"
                element={
                  <ProtectedRoute>
                    <InvoicesCajIng />
                  </ProtectedRoute>
                }
              ></Route>
              <Route
                path="/admin/invoicerBuy"
                element={
                  <ProtectedRoute>
                    <InvoicesBuy />
                  </ProtectedRoute>
                }
              ></Route>
              <Route
                path="/admin/remiterBuy"
                element={
                  <ProtectedRoute>
                    <RemitsBuy />
                  </ProtectedRoute>
                }
              ></Route>
              <Route
                path="/admin/remiterBuypv"
                element={
                  <ProtectedRoute>
                    <RemitsBuypv />
                  </ProtectedRoute>
                }
              ></Route>
              <Route
                path="/admin/invoicerBuyRec"
                element={
                  <ProtectedRoute>
                    <InvoicesBuyRec />
                  </ProtectedRoute>
                }
              ></Route>
              <Route
                path="/admin/invoicerCajEgr"
                element={
                  <ProtectedRoute>
                    <InvoicesCajEgr />
                  </ProtectedRoute>
                }
              ></Route>
              <Route
                path="/admin/product/:id"
                element={
                  <AdminRoute>
                    <ProductEditScreen />
                  </AdminRoute>
                }
              ></Route>
              <Route
                path="/admin/user/:id"
                element={
                  <AdminRoute>
                    <UserEditScreen />
                  </AdminRoute>
                }
              ></Route>
              <Route
                path="/admin/encargado/:id"
                element={
                  <AdminRoute>
                    <EncargadoEditScreen />
                  </AdminRoute>
                }
              ></Route>
              <Route
                path="/admin/valuee/:id"
                element={
                  <AdminRoute>
                    <ValueeEditScreen />
                  </AdminRoute>
                }
              ></Route>
              <Route
                path="/admin/configuration/:id"
                element={
                  <AdminRoute>
                    <ConfigurationEditScreen />
                  </AdminRoute>
                }
              ></Route>
              <Route
                path="/admin/comprobante/:id"
                element={
                  <AdminRoute>
                    <ComprobanteEditScreen />
                  </AdminRoute>
                }
              ></Route>
              <Route
                path="/admin/customer/cta/:id"
                element={
                  <AdminRoute>
                    <AccountCustomerScreen />
                  </AdminRoute>
                }
              ></Route>
              <Route
                path="/admin/user/cta/:id"
                element={
                  <AdminRoute>
                    <AccountUserScreen />
                  </AdminRoute>
                }
              ></Route>
              <Route
                path="/admin/suppli/:id"
                element={
                  <AdminRoute>
                    <AccountSuppliScreen />
                  </AdminRoute>
                }
              ></Route>

              <Route path="/" element={<HomeScreen />} />
            </Routes>
          </Container>
        </main>
        <footer>
        {/* {userInfo && !(userInfo.role==='admin') && <ChatBox userInfo={userInfo} />} */}
          <div className="text-center">All rights reserved</div>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
