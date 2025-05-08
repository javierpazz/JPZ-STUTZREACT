import React, { useContext, useEffect, useRef, useState } from 'react';
import axios from 'axios';
import ReactToPrint from 'react-to-print';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { Store } from '../Store';
import { getError, API } from '../utils';

const EncargadoListPrint = () => {
  const { state } = useContext(Store);
  const { userInfo } = state;

  const [encargados, setEncargados] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const componentRef = useRef();


  useEffect(() => {
    const fetchData = async () => {
        //   const { data } = await axios.get('/api/products/list');
    const { data } = await axios.get(`${API}/api/encargados/list`, {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      });
      setEncargados(data);
    };
    fetchData();
  }, []);

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(encargados);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'encargados');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const dataBlob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(dataBlob, 'encargados.xlsx');
  };

  return (
    <div>
      <h1>Listado Encargados</h1>
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
              <th>Encargado</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {encargados.map((v) => (
              <tr key={v._id}>
                <td>{v.codEnc}</td>
                <td>{v.name}</td>
                <td>{v.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EncargadoListPrint;
