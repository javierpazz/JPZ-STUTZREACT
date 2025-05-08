import React, { useContext, useEffect, useRef, useState } from 'react';
import axios from 'axios';
import ReactToPrint from 'react-to-print';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { Store } from '../Store';
import { getError, API } from '../utils';

const ComprobanteListPrint = () => {
  const { state } = useContext(Store);
  const { userInfo } = state;
  const [id_config, setId_config] = useState(userInfo.codCon);

  const [comprobantes, setComprobantes] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const componentRef = useRef();


  useEffect(() => {
    const fetchData = async () => {
        //   const { data } = await axios.get('/api/products/list');
    const { data } = await axios.get(`${API}/api/comprobantes/list/?id_config=${id_config}`, {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      });
      setComprobantes(data);
    };
    fetchData();
  }, []);

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(comprobantes);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'comprobantes');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const dataBlob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(dataBlob, 'comprobantes.xlsx');
  };

  return (
    <div>
      <h1>Listado Comprobantes</h1>
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
              <th>Comprobante</th>
              <th>Inputa</th>
              <th>Discrima IVA</th>
              <th>Comprobante Interno</th>
              <th>Ultimo Numero</th>
            </tr>
          </thead>
          <tbody>
            {comprobantes.map((c) => (
              <tr key={c._id}>
                <td>{c.codCom}</td>
                <td>{c.nameCom}</td>
                <td>{c.isHaber == true ? 'HABER' : 'DEBE'}</td>




                { (c.noDisc) ? <td className="text-center">{'NO DISCRIMINA'}</td> : ""}
                { (c.itDisc) ? <td className="text-center">{'DISCRIMINA EN ITEM'}</td> : ""}
                { (c.toDisc) ? <td className="text-center">{'DISCRIMINA EN TOTAL'}</td> : ""}
                <td>{c.interno == false ? 'REMOTO' : 'INTERNO'}</td>
                <td>{c.numInt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ComprobanteListPrint;
