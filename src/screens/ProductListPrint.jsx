import React, { useEffect, useRef, useState, useContext } from 'react';
import axios from 'axios';
import Form from 'react-bootstrap/Form';
import { useReactToPrint } from 'react-to-print';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { Store } from '../Store';
import { API } from '../utils';

const PRODUCTS_PER_PAGE = 30;

const ProductListPrint = () => {
  const { state } = useContext(Store);
  const { userInfo } = state;
  const [id_config, setId_config] = useState(userInfo.codCon);


  const [products, setProducts] = useState([]);
  const [grouped, setGrouped] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [supplierFilter, setSupplierFilter] = useState('');
  const [isMin, setIsMin] = useState(false);

  const componentRef = useRef();

  useEffect(() => {
    const fetchData = async () => {
        //   const { data } = await axios.get('/api/products/list');
    const { data } = await axios.get(`${API}/api/products/list/?configuracion=${id_config}`, {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      });
    setProducts(data);
      const groupedData = groupByCategory(data);
      setGrouped(groupedData);
    };
    fetchData();
  }, []);

  
  const groupByCategory = (products) => {
    return products.reduce((acc, product) => {
      if (!acc[product.category]) acc[product.category] = [];
      acc[product.category].push(product);
      return acc;
    }, {});
  };

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: 'Product List',
  });

  const exportToExcel = () => {
    const formattedForExcel = filteredProducts.map(p => ({
        codigoPro: p.codigoPro,
        codPro: p.codPro,
        title: p.title,
        supplier: p.supplier,
        price: p.price.toString().replace('.', ','),
        priceBuy: p.priceBuy.toString().replace('.', ','),
        inStock: p.inStock.toString().replace('.', ','),
        minStock: p.minStock.toString().replace('.', ','),
        porIva: p.porIva
      }));
    const worksheet = XLSX.utils.json_to_sheet(formattedForExcel);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Products');
    const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([buffer], { type: 'application/octet-stream' });
    saveAs(blob, 'Product_List.xlsx');
  };

  // 🔍 Filtrado dinámico
  const filteredProducts = products.filter(p =>
    (categoryFilter ? p.category === categoryFilter : true) &&
    (supplierFilter ? p.supplier === supplierFilter : true) &&
    ((isMin) ? +p.inStock <= +p.minStock : true)
);

  const allProducts = Object.values(groupByCategory(filteredProducts)).flat();
  const totalPages = Math.ceil(allProducts.length / PRODUCTS_PER_PAGE);
  const paginatedProducts = allProducts.slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE
  );

  const groupedPage = groupByCategory(paginatedProducts);

  const categories = [...new Set(products.map(p => p.category))];
  const suppliers = [...new Set(products.map(p => p.supplier))];

  return (
    <div>
      <h2>Lista Precios Productos </h2>

      <div style={{ marginBottom: '1rem' }}>
        <label>Categoria: </label>
        <select value={categoryFilter} onChange={e => { setCategoryFilter(e.target.value); setCurrentPage(1); }}>
          <option value="">All</option>
          {categories.map((c, i) => (
            <option key={i} value={c}>{c}</option>
          ))}
        </select>

        <label style={{ marginLeft: '1rem' }}>Proovedor: </label>
        <select value={supplierFilter} onChange={e => { setSupplierFilter(e.target.value); setCurrentPage(1); }}>
          <option value="">All</option>
          {suppliers.map((s, i) => (
            <option key={i} value={s}>{s}</option>
          ))}
        </select>

        <label style={{ marginLeft: '1rem' }}>
          <input
              type="checkbox"
              id="isMin"
              checked={isMin}
              onChange={(e) => setIsMin(e.target.checked)}
              />
            Ver solo con Stock Minimo
        </label>

      </div>

      <button onClick={handlePrint}>🖨️ Print</button>
      <button onClick={exportToExcel}>📤 Exporta a Excel</button>

      <div ref={componentRef}>
      {Object.entries(groupedPage).map(([category, items]) => {
  const sortedItems = items.sort((a, b) => a.title.localeCompare(b.title));
  return (
    <div key={category} style={{ marginTop: 20 }}>
      <h3 style={{ background: '#eee', padding: 5 }}>{category}</h3>
      <table border="1" cellPadding="5" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th  className="text-center">Codigo</th>
            <th>Producto</th>
            <th>Proovedor</th>
            <th className="text-end">Precio</th>
            <th className="text-end">Precio Compra</th>
            <th className="text-end">Stock</th>
            <th className="text-end">Stock Minimo</th>
            <th className="text-end">IVA (%)</th>
          </tr>
        </thead>
        <tbody>
          {sortedItems.map((p, idx) => (
            <tr key={idx}>
              <td  className="text-end">{p.codigoPro}</td>
              <td>{p.title}</td>
              <td>{p.supplier}</td>
              <td className="text-end">${p.price}</td>
              <td className="text-end">${p.priceBuy}</td>
              <td className="text-end">{p.inStock}</td>
              <td className="text-end">{p.minStock}</td>
              <td className="text-end">{p.porIva}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
})}

      </div>

      <div style={{ marginTop: 20 }}>
        <button disabled={currentPage === 1} onClick={() => setCurrentPage(prev => prev - 1)}>◀ Prev</button>
        <span style={{ margin: '0 10px' }}>Page {currentPage} / {totalPages}</span>
        <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(prev => prev + 1)}>Next ▶</button>
      </div>
    </div>
  );
};

export default ProductListPrint;
