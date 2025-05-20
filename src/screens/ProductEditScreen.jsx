import React, { useContext, useEffect, useReducer, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { Store } from '../Store';
import { getError, API } from '../utils';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { BiFileFind } from "react-icons/bi";
import ListGroup from 'react-bootstrap/ListGroup';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import { Helmet } from 'react-helmet-async';
import Modal from 'react-bootstrap/Modal';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import Button from 'react-bootstrap/Button';
import SupplierSelector from './SupplierSelector';

const reducer = (state, action) => {
  switch (action.type) {

    case 'SUPPLIER_FETCH_REQUEST':
      return { ...state, loading: true };
    case 'SUPPLIER_FETCH_SUCCESS':
      return {
        ...state,
        products: action.payload.products,
        page: action.payload.page,
        pages: action.payload.pages,
        loading: false,
      };
    case 'SUPPLIER_FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };


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
export default function ProductEditScreen() {
  const navigate = useNavigate();
  const params = useParams(); // /product/:id
  const { id: productId } = params;

  const { state } = useContext(Store);
  const { userInfo } = state;
  const [id_config, setId_config] = useState(userInfo.codCon);
  const [{ loading, error, loadingUpdate, loadingUpload }, dispatch] =
    useReducer(reducer, {
      loading: true,
      error: '',
    });
    const [showSup, setShowSup] = useState(false);
    const [suppObj, setSuppObj] = useState({});
    const [codSup, setCodSup] = useState('');
    const [codSupp, setCodSupp] = useState('');
    const [nameSup, setNameSup] = useState('');
    const [suppliers, setSuppliers] = useState([]);
  
  const [codPro, setCodPro] = useState('');
  const [codigoPro, setCodigoPro] = useState('');
  const [title, setTitle] = useState('');
  const [medPro, setMedPro] = useState('');
  const [slug, setSlug] = useState('');
  const [price, setPrice] = useState('');
  const [priceBuy, setPriceBuy] = useState('');
  const [image, setImage] = useState('');
  const [images, setImages] = useState([]);
  const [category, setCategory] = useState('');
  const [inStock, setInStock] = useState('');
  const [minStock, setMinStock] = useState('');
  const [porIva, setPorIva] = useState(0);
  const [brand, setBrand] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    const fetchDataVal = async () => {
      try {
        const { data } = await axios.get(`${API}/api/suppliers/`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        setSuppliers(data);
        dispatch({ type: 'SUPPLIER_FETCH_SUCCESS', payload: data });
      } catch (err) {}
    };
    fetchDataVal();
  }, []);

//////modal
const [modalOpen, setModalOpen] = useState(false);
const [selectedProduct, setSelectedProduct] = useState(null);
const modalRef = useRef(null);

const handleSelect = (supplier) => {
setSelectedProduct(supplier);

setCodSup(supplier._id);
setCodSupp(supplier.codSup);
setNameSup(supplier.name);

setModalOpen(false);
};

// Cerrar con Escape
useEffect(() => {
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setModalOpen(false);
    }
  };

  if (modalOpen) {
    document.addEventListener('keydown', handleKeyDown);
  }

  return () => {
    document.removeEventListener('keydown', handleKeyDown);
  };
}, [modalOpen]);

// Cerrar al hacer clic fuera del modal
const handleClickOutside = (e) => {
  if (modalRef.current && !modalRef.current.contains(e.target)) {
    setModalOpen(false);
  }
};

useEffect(() => {
  if (modalOpen) {
    document.addEventListener('mousedown', handleClickOutside);
  } else {
    document.removeEventListener('mousedown', handleClickOutside);
  }
  return () => {
    document.removeEventListener('mousedown', handleClickOutside);
  };
}, [modalOpen]);
//////modal



  useEffect(() => {
    if (productId === "0") {
    }
    else {
      const fetchData = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`${API}/api/products/${productId}`);
        setCodPro(data.codPro);
        setCodigoPro(data.codigoPro);
        setTitle(data.title);
        setMedPro(data.medPro);
        setSlug(data.slug);
        setPrice(data.price);
        setPriceBuy(data.priceBuy);
        setImage(data.image);
        setImages(data.images);
        setCategory(data.category);
        setInStock(data.inStock);
        setMinStock(data.minStock);
        setPorIva(data.porIva);
        setBrand(data.brand);
        setDescription(data.description);
        setCodSup(data?.supplier._id || "");
        setCodSupp(data?.supplier.codSup || "");
        setNameSup(data?.supplier.name || "");
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
  }, [productId]);

  const handleShowSup = () => {
    // setShowSup(true);
    setModalOpen(true)
  };

  const submitHandlerSup = async (e) => {
    e.preventDefault();
    setShowSup(false)
  };

  const handleChangeSup = (e) => {
    searchSup(e.target.value);
  };


  const searchSup = (codSup) => {
    const supplierRow = suppliers.find((row) => row._id === codSup);
    setSuppObj(supplierRow);
    setCodSup(supplierRow._id);
    setCodSupp(supplierRow.codSup);
    setNameSup(supplierRow.name);
  };


  const ayudaSup = (e) => {
    e.key === "Enter" && buscarPorCodSup(codSupp);
    e.key === "F2" && handleShowSup(codSup);
    e.key === "Tab" && buscarPorCodSup(codSupp);
  };
  

  const buscarPorCodSup = (codSupp) => {
    const supplierRow = suppliers.find((row) => row.codSup === codSupp);
    if (!supplierRow) {
        setCodSup('');
        setCodSupp('');
        setNameSup('Elija un Proovedor');
    }else{
      setCodSup(supplierRow._id);
      setCodSupp(supplierRow.codSup);
      setNameSup(supplierRow.name);
      };
  };




  const submitHandler = async (e) => {
    e.preventDefault();
    if (productId === "0") {
      try {
        dispatch({ type: 'UPDATE_REQUEST' });
        await axios.post(
          `${API}/api/products`,
          {
            codigoPro,
            codPro,
            title,
            medPro,
            slug,
            price,
            priceBuy,
            image,
            images,
            id_config,
            category,
            brand,
            inStock,
            minStock,
            porIva,
            description,
            codSup,
          },
          {
            headers: { Authorization: `Bearer ${userInfo.token}` },
          }
        );
        dispatch({
          type: 'UPDATE_SUCCESS',
        });
        toast.success('Product updated successfully');
        navigate('/admin/products');
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
          `${API}/api/products/${productId}`,
          {
            _id: productId,
            codigoPro,
            codPro,
            title,
            medPro,
            slug,
            price,
            priceBuy,
            image,
            images,
            id_config,
            category,
            brand,
            inStock,
            minStock,
            porIva,
            description,
            codSup,
          },
          {
            headers: { Authorization: `Bearer ${userInfo.token}` },
          }
        );
        dispatch({
          type: 'UPDATE_SUCCESS',
        });
        toast.success('Product updated successfully');
        navigate('/admin/products');
      } catch (err) {
        toast.error(getError(err));
        dispatch({ type: 'UPDATE_FAIL' });
      }
    };
    }

  const uploadFileHandler = async (e, forImages) => {
    const file = e.target.files[0];
    const bodyFormData = new FormData();
    bodyFormData.append('file', file);
    try {
      dispatch({ type: 'UPLOAD_REQUEST' });
      const { data } = await axios.post(`${API}/api/upload`, bodyFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          authorization: `Bearer ${userInfo.token}`,
        },
      });
      dispatch({ type: 'UPLOAD_SUCCESS' });

      if (forImages) {
        setImages([...images, data.secure_url]);
      } else {
        setImages([data.secure_url]);
      }
      toast.success('Image uploaded successfully. click Update to apply it');
    } catch (err) {
      toast.error(getError(err));
      dispatch({ type: 'UPLOAD_FAIL', payload: getError(err) });
    }
  };
  const deleteFileHandler = async (fileName, f) => {
    console.log(fileName, f);
    console.log(images);
    console.log(images.filter((x) => x !== fileName));
    setImages(images.filter((x) => x !== fileName));
    toast.success('Image removed successfully. click Update to apply it');
  };


  return (
    <Container>
      <Helmet>
        <title>Edit Producto</title>
      </Helmet>
      <h1>Edit Producto</h1>

      {false ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <>

<div>
      <Row>

          <Col md={2}>

              <Form.Group className="mb-3" controlId="inStock">
                <Form.Label>Codigo Proovedor</Form.Label>
                <Form.Control
                  value={codSupp}
                  onChange={(e) => setCodSupp(e.target.value)}
                  // onKeyDown={(e) => e.key === "Enter" && buscarPorCodSup(codSupp)}
                  onKeyDown={(e) => ayudaSup(e)}
                  // buscarPorCodSup
                />
              </Form.Group>
              </Col>
          <Col >
              <Button
            className="mt-4 mb-1 bg-yellow-300 text-black py-1 px-1 rounded shadow border-2 border-yellow-300 hover:bg-transparent hover:text-blue-500 transition-all duration-300"
            type="button"
            title="Buscador"
            // onClick={() => handleShowSup()}
            onClick={() => handleShowSup()}
            >
            <BiFileFind className="text-blue-500 font-bold text-xl" />
          </Button>
              </Col>
          <Col md={9}>
            <Card.Body className="mt-4 mb-1">
              <Card.Title>
                <ListGroup.Item>
                  <h3>
                    {nameSup}
                  </h3>
                </ListGroup.Item>
              </Card.Title>
            </Card.Body>
          </Col>

        </Row>
        </div>

        {/* name, address, email, phone, bank name, bank account number, website client name, client address, invoice number, Fecha Factura, Fecha Vencimiento, notes */}
        <div>

       <Row>


        <Col md={6}>


          <Form.Group className="mb-3" controlId="name">
            <Form.Label>Codigo</Form.Label>
            <Form.Control
              value={codigoPro}
              onChange={(e) => setCodigoPro(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="name">
            <Form.Label>Codigo Barra</Form.Label>
            <Form.Control
              value={codPro}
              onChange={(e) => setCodPro(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="name">
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              />
          </Form.Group>
          <Form.Group className="mb-3" controlId="name">
            <Form.Label>Unidad</Form.Label>
            <Form.Control
              value={medPro}
              onChange={(e) => setMedPro(e.target.value)}
              required
              />
          </Form.Group>
          <Form.Group className="mb-3" controlId="description">
            <Form.Label>Description</Form.Label>
            <Form.Control
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              />
          </Form.Group>
          {/* <Form.Group className="mb-3" controlId="slug">
            <Form.Label>Slug</Form.Label>
            <Form.Control
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            required
            />
            </Form.Group> */}
          <Form.Group className="mb-3" controlId="name">
            <Form.Label>Precio</Form.Label>
            <Form.Control
              value={price}
              type='number'
              inputMode="decimal"
              min="0"
              defaultValue="0"
              onChange={(e) => setPrice(e.target.value)}
              required
              />
          </Form.Group>
          <Form.Group className="mb-3" controlId="name">
            <Form.Label>Precio Costo</Form.Label>
            <Form.Control
              value={priceBuy}
              type='number'
              onChange={(e) => setPriceBuy(e.target.value)}
              required
              />
          </Form.Group>
        </Col>
        <Col md={6}>

          {/* <Form.Group className="mb-3" controlId="image">
            <Form.Label>Image File</Form.Label>
            <Form.Control
            value={image}
            onChange={(e) => setImage(e.target.value)}
            required
            />
            </Form.Group>
            <Form.Group className="mb-3" controlId="imageFile">
            <Form.Label>Upload Image</Form.Label>
            <Form.Control type="file" onChange={uploadFileHandler} />
            {loadingUpload && <LoadingBox></LoadingBox>}
            </Form.Group>
            */}

          {/* /////imagenes//////
          <Form.Group className="mb-3" controlId="additionalImageFile">
          <Form.Label>Upload Image</Form.Label>
          <Form.Control
          type="file"
          onChange={(e) => uploadFileHandler(e, true)}
          />
          {loadingUpload && <LoadingBox></LoadingBox>}
          </Form.Group>
          <Form.Group className="mb-3" controlId="additionalImage">
          <Form.Label>Images</Form.Label>
          {images.length === 0 && <MessageBox>No image</MessageBox>}
          <ListGroup variant="flush">
          {images.map((x) => (
            <ListGroup.Item key={x}>
            {x}
            <Button variant="light" onClick={() => deleteFileHandler(x)}>
            <i className="fa fa-times-circle"></i>
            </Button>
            </ListGroup.Item>
            ))}
            </ListGroup>
            </Form.Group>
            /////imagenes////// */}

          <Form.Group className="mb-3" controlId="category">
            <Form.Label>Categoria</Form.Label>
            <Form.Control
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
              />
          </Form.Group>
          <Form.Group className="mb-3" controlId="brand">
            <Form.Label>Marca</Form.Label>
            <Form.Control
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              required
              />
          </Form.Group>
          <Form.Group className="mb-3" controlId="inStock">
            <Form.Label>Stock</Form.Label>
            <Form.Control
              value={inStock}
              type='number'
              onChange={(e) => setInStock(e.target.value)}
              required
              />
          </Form.Group>
          <Form.Group className="mb-3" controlId="inStock">
            <Form.Label>Stock Minimo</Form.Label>
            <Form.Control
              type='number'
              value={minStock}
              onChange={(e) => setMinStock(e.target.value)}
              required
              />
          </Form.Group>
          <Form.Group className="mb-3" controlId="inStock">
            <Form.Label>% IVA</Form.Label>
            <Form.Control
              type='number'
              value={porIva}
              onChange={(e) => setPorIva(e.target.value)}
              required
              />
          </Form.Group>

          <div className="mb-3 text-end">
          {/* <Button disabled={loadingUpdate} type="submit"> */}
            <Button type="button"
                    variant="primary"
                    onClick={submitHandler}
                  >
              Graba
            </Button>
            {loadingUpdate && <LoadingBox></LoadingBox>}
            </div>
      </Col>
      </Row>


      {modalOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            zIndex: 1000
          }}
        >
          <div
            ref={modalRef}
            style={{
              backgroundColor: '#fff',
              width: '400px',
              borderRadius: '8px',
              boxShadow: '0 0 10px rgba(0,0,0,0.3)'
            }}
          >
            <div style={{ padding: '10px', borderBottom: '1px solid #ccc', textAlign: 'right' }}>
              <button onClick={() => setModalOpen(false)} style={{ fontWeight: 'bold' }}>X</button>
            </div>
            <SupplierSelector  onSelect={handleSelect} suppliers={suppliers}  />
          </div>
        </div>
      )}
      <Modal
                  size="md"
                  show={showSup}
                  onHide={() => setShowSup(false)}
                  aria-labelledby="example-modal-sizes-title-lg"
                >
                  <Modal.Header closeButton>
                    <Modal.Title id="example-modal-sizes-title-lg">
                    Elija un Proovedor
                    </Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                  <Col md={12}>
                    <Card.Body>
                      <Card.Title>
                      <Form onSubmit={submitHandlerSup}>
                          <Form.Group className="mb-3" controlId="name">
                          {/* <Form.Group className="input" controlId="name"> */}
                          <Form.Label>Proveedor</Form.Label>
                          <Form.Select
                            className="input"
                            onClick={(e) => handleChangeSup(e)}
                          >
                            {suppliers.map((elemento) => (
                              <option key={elemento._id} value={elemento._id}>
                                {elemento.name}
                              </option>
                            ))}
                          </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="name">
                              <Form.Control
                                placeholder="Proveedor"
                                value={nameSup}
                                disabled={true}
                                required
                                />
                            </Form.Group>
                              <div className="mb-3">
                                <Button type="submit"
                                  disabled={nameSup ? false : true}
                                  >Continuar</Button>
                              </div>
                              </Form>
                      </Card.Title>
                    </Card.Body>
                  </Col>
                  </Modal.Body>
                </Modal>
            </div>
          </>


)}
    </Container>


);
}
