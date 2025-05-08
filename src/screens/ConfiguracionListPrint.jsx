import React, { useContext, useEffect, useRef, useState } from 'react';
import axios from 'axios';
import ReactToPrint from 'react-to-print';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { Store } from '../Store';
import { getError, API } from '../utils';

const ConfiguracionListPrint = () => {
  const { state } = useContext(Store);
  const { userInfo } = state;

  const [configuracions, setConfiguracions] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const componentRef = useRef();


  useEffect(() => {
    const fetchData = async () => {
        //   const { data } = await axios.get('/api/products/list');
    const { data } = await axios.get(`${API}/api/configurations/list`, {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      });
      setConfiguracions(data);
    };
    fetchData();
  }, []);

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(configuracions);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'configuracions');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const dataBlob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(dataBlob, 'PuntosdeVenta.xlsx');
  };

  return (
    <div>
      <h1>Listado Puntos de Venta</h1>
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
              <th></th>
              <th>Punto</th>
              <th></th>
              <th></th>
              <th>COND</th>
              <th>Ingresos</th>
              <th>Inicio</th>
              <th>Ultimo </th>
              <th>Ultimo </th>
              <th>Ultimo </th>
              <th>Ultimo </th>
              <th>Ultimo </th>
            </tr>
          </thead>
          <thead>
            <tr>
              <th>Codigo</th>
              <th>Venta</th>
              <th>Domicilio</th>
              <th>CUIT</th>
              <th>ANTE IVA</th>
              <th>Brutos</th>
              <th>Actividades</th>
              <th>Remito</th>
              <th>Recibo/Orden</th>
              <th>Orden</th>
              <th>Mov.Caja</th>
              <th>Mov.PVta</th>
            </tr>
          </thead>
          <tbody>
            {configuracions.map((c) => (
              <tr key={c._id}>
                <td>{c.codCon}</td>
                <td>{c.name}</td>
                <td>{c.domcomer}</td>
                <td>{c.cuit}</td>
                <td>{c.coniva}</td>
                <td>{c.ib}</td>
                <td>{c.feciniact}</td>
                <td>{c.numIntRem}</td>
                <td>{c.numIntRec}</td>
                <td>{c.numIntOdp}</td>
                <td>{c.numIntCaj}</td>
                <td>{c.numIntMov}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ConfiguracionListPrint;
