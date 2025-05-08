import React, { useContext, useEffect, useRef, useState } from 'react';
import axios from 'axios';
import ReactToPrint from 'react-to-print';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { Store } from '../Store';
import { getError, API } from '../utils';

const CustomerListPrint = () => {
  const { state } = useContext(Store);
  const { userInfo } = state;

  const [customers, setCustomers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const componentRef = useRef();


  useEffect(() => {
    const fetchData = async () => {
        //   const { data } = await axios.get('/api/products/list');
    const { data } = await axios.get(`${API}/api/customers/list`, {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      });
      setCustomers(data);
    };
    fetchData();
  }, []);

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(customers);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Customers');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const dataBlob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(dataBlob, 'Clientes.xlsx');
  };

  return (
    <div>
      <h1>Listado Clientes</h1>
      <div style={{ marginBottom: '20px' }}>
        <ReactToPrint
          trigger={() => <button>🖨️ Print</button>}
          content={() => componentRef.current}
        />
        <button onClick={exportToExcel}>📄 Export to Excel</button>
      </div>
      <div ref={componentRef}>
        <table border="1" cellPadding="10">
          <thead>
            <tr>
              <th>Codigo</th>
              <th>Cliente</th>
              <th>Email</th>
              <th>Domicilio</th>
              <th>Cuit</th>
              <th>Cond.IVA</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c) => (
              <tr key={c._id}>
                <td>{c.codCus}</td>
                <td>{c.nameCus}</td>
                <td>{c.emailCus}</td>
                <td>{c.domcomer}</td>
                <td>{c.cuit}</td>
                <td>{c.coniva}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CustomerListPrint;
