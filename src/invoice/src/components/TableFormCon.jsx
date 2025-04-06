import React from 'react';
import { AiOutlineDelete, AiOutlineEdit } from 'react-icons/ai';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

export default function TableFormOrd({
  codPro,
  setCodPro,
  desPro,
  setDesPro,
  quantity,
  setQuantity,
  price,
  setPrice,
  amount,
  setAmount,
  total,
  setTotal,
  isPaying,
  orderItems,
}) {
  return (
    <>
      <ToastContainer position="top-right" theme="colored" />

      {/* Table items */}

      <table width="100%" className="mb-10">
        <thead>
          <tr className="bg-gray-100 p-1">
            <td className="font-bold">Codigo Producto</td>
            <td className="font-bold">Product Description</td>
            <td className="font-bold">Cantidad</td>
            <td className="font-bold">Precio</td>
            <td className="font-bold">Total</td>
            <td className="font-bold">Options</td>
          </tr>
        </thead>
        {orderItems?.map((itemInv) => (
          <React.Fragment key={itemInv._id}>
            <tbody>
              <tr className="h-10">
                <td>{itemInv._id}</td>
                <td>{itemInv.title}</td>
                <td>{itemInv.quantity}</td>
                <td>{itemInv.price}</td>
                <td className="amount">{itemInv.quantity * itemInv.price}</td>
              </tr>
            </tbody>
          </React.Fragment>
        ))}
      </table>
    </>
  );
}
