import React, { useContext, useEffect, useRef, useState } from 'react';
import axios from 'axios';
import ReactToPrint from 'react-to-print';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { Store } from '../Store';
import { getError, API } from '../utils';

const UsuarioListPrint = () => {
  const { state } = useContext(Store);
  const { userInfo } = state;

  const [usuarios, setUsuarios] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const componentRef = useRef();


  useEffect(() => {
    const fetchData = async () => {
        //   const { data } = await axios.get('/api/products/list');
    const { data } = await axios.get(`${API}/api/users/list`, {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      });
      setUsuarios(data);
    };
    fetchData();
  }, []);

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(usuarios);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'usuarios');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const dataBlob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(dataBlob, 'usuarios.xlsx');
  };

  return (
    <div>
      <h1>Listado Usuarios</h1>
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
              <th>Usuario</th>
              <th>Email</th>
              <th>Administrador</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((v) => (
              <tr key={v._id}>
                <td>{v.codUse}</td>
                <td>{v.name}</td>
                <td>{v.email}</td>
                <td className='text-center'>{v.role == "admin" ? 'YES' : 'NO'}</td>
                  <td>{v.isActive == true ? 'Activo' : 'No Activo'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UsuarioListPrint;
