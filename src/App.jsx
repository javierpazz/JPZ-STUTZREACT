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
import ProductEditScreen from './screens/ProductEditScreen';

import AccountUserScreen from './screens/AccountUserScreen';
import AccountSuppliScreen from './screens/AccountSuppliScreen';
import InvoiceListScreen from './screens/InvoiceListScreen';
import InvoiceBuyListScreen from './screens/InvoiceBuyListScreen';
import ReceiptListScreen from './screens/ReceiptListScreen';
import ReceiptBuyListScreen from './screens/ReceiptBuyListScreen';
import OrderListScreen from './screens/OrderListScreen';
import SupplierListScreen from './screens/SupplierListScreen';
import SupplierEditScreen from './screens/SupplierEditScreen';
import StateOrdListScreen from './screens/StateOrdListScreen';
import StateOrdEditScreen from './screens/StateOrdEditScreen';
import UserListScreen from './screens/UserListScreen';
import UserEditScreen from './screens/UserEditScreen';
import ValueeListScreen from './screens/ValueeListScreen';
import ValueeEditScreen from './screens/ValueeEditScreen';
import ConfigurationListScreen from './screens/ConfigurationListScreen';
import ConfigurationEditScreen from './screens/ConfigurationEditScreen';
import InvoicesOrd from './invoice/src/InvoicesOrd';
import Invoices from './invoice/src/Invoices';
import InvoicesRec from './invoice/src/InvoicesRec';
import InvoicesBuy from './invoice/src/InvoicesBuy';
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
              <Button
                variant="dark"
                onClick={() => setSidebarIsOpen(!sidebarIsOpen)}
              >
                <i className="fas fa-bars"></i>
              </Button>

              <LinkContainer to="/">
                <Navbar.Brand>S T U T Z - Wines</Navbar.Brand>
              </LinkContainer>
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse id="basic-navbar-nav">
                <SearchBox />
                <Nav className="me-auto  w-100  justify-content-end">
                  <Link to="/cart" className="nav-link">
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
                  )}
                  {userInfo && userInfo.role=="admin" && (
                    <NavDropdown title="Admin" id="admin-nav-dropdown">
                      <LinkContainer to="/admin/dashboard">
                        <NavDropdown.Item>Dashboard</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/admin/products">
                        <NavDropdown.Item>Products</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/admin/invoices">
                        <NavDropdown.Item>Sales Invoices</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/admin/invoicesBuy">
                        <NavDropdown.Item>Buy Invoices</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/admin/invoicesRec">
                        <NavDropdown.Item>Receipts Sales</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/admin/invoicesBuyRec">
                        <NavDropdown.Item>Receipt Buys</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/admin/orders">
                        <NavDropdown.Item>Orders</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/admin/suppliers">
                        <NavDropdown.Item>Suppliers</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/admin/stateOrds">
                        <NavDropdown.Item>States Order</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/admin/users">
                        <NavDropdown.Item>Users</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/admin/valuees">
                        <NavDropdown.Item>Values</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/admin/configurations">
                        <NavDropdown.Item>Configurations</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/admin/support">
                        <NavDropdown.Item>Support</NavDropdown.Item>
                      </LinkContainer>
                    </NavDropdown>
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
            {categories.map((type) => (
              <Nav.Item key={type}>
                <LinkContainer
                  to={`/search?category=${type}`}
                  onClick={() => setSidebarIsOpen(false)}
                >
                  <Nav.Link>{type}</Nav.Link>
                </LinkContainer>
              </Nav.Item>
            ))}
          </Nav>
        </div>
        <main>
          <Container className="mt-3">
            <Routes>
              <Route path="/product/:slug" element={<ProductScreen />} />
              <Route path="/cart" element={<CartScreen />} />
              <Route path="/search" element={<SearchScreen />} />
              <Route path="/signin" element={<SigninScreen />} />
              <Route path="/signup" element={<SignupScreen />} />
              <Route
                path="/forget-password"
                element={<ForgetPasswordScreen />}
              />
              <Route
                path="/reset-password/:token"
                element={<ResetPasswordScreen />}
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
                  <AdminRoute>
                    <DashboardScreen />
                  </AdminRoute>
                }
              ></Route>
              <Route
                path="/admin/invoices"
                element={
                  <AdminRoute>
                    <InvoiceListScreen />
                  </AdminRoute>
                }
              ></Route>
              <Route
                path="/admin/invoicesBuy"
                element={
                  <AdminRoute>
                    <InvoiceBuyListScreen />
                  </AdminRoute>
                }
              ></Route>
              <Route
                path="/admin/invoicesRec"
                element={
                  <AdminRoute>
                    <ReceiptListScreen />
                  </AdminRoute>
                }
              ></Route>
              <Route
                path="/admin/invoicesBuyRec"
                element={
                  <AdminRoute>
                    <ReceiptBuyListScreen />
                  </AdminRoute>
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
                  <AdminRoute>
                    <SupplierListScreen />
                  </AdminRoute>
                }
              ></Route>
              <Route
                path="/admin/supplier/:id"
                element={
                  <AdminRoute>
                    <SupplierEditScreen />
                  </AdminRoute>
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
                path="/admin/products"
                element={
                  <AdminRoute>
                    <ProductListScreen />
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
                  <AdminRoute>
                    <Invoices />
                  </AdminRoute>
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
                path="/admin/invoicerRec"
                element={
                  <AdminRoute>
                    <InvoicesRec />
                  </AdminRoute>
                }
              ></Route>
              <Route
                path="/admin/invoicerBuy"
                element={
                  <AdminRoute>
                    <InvoicesBuy />
                  </AdminRoute>
                }
              ></Route>
              <Route
                path="/admin/invoicerBuyRec"
                element={
                  <AdminRoute>
                    <InvoicesBuyRec />
                  </AdminRoute>
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
                path="/admin/client/:id"
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
        {userInfo && !(userInfo.role==='admin') && <ChatBox userInfo={userInfo} />}
          <div className="text-center">All rights reserved</div>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
