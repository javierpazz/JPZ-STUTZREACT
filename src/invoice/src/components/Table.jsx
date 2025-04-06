import React from 'react';

export default function Table({ orderItems, total }) {
  total = orderItems.reduce((a, c) => a + c.price * c.quantity, 0);

  return (
    <>
      {console.log(orderItems)}

      <table width="100%" className="mb-10">
        <thead>
          <tr className="bg-gray-100 p-1">
            <td className="font-bold text-end">Codigo Producto</td>
            <td className="font-bold text-end">Product Description</td>
            <td className="font-bold text-end">Cantidad</td>
            <td className="font-bold text-end">Precio</td>
            <td className="font-bold text-end">Total</td>
          </tr>
        </thead>
        {orderItems?.map((itemInv) => (
          <React.Fragment key={itemInv._id}>
            <tbody>
              <tr className="h-10">
              <td className="px-4 py-2 text-left">{itemInv._id}</td>
              <td className="px-4 py-2 text-left">{itemInv.title}</td>
              <td className="px-4 py-2 text-end">{itemInv.quantity.toFixed(2)}</td>
              <td className="px-4 py-2 text-end">${itemInv.price.toFixed(2)}</td>
              <td className="px-4 py-2 text-end">${itemInv.amount.toFixed(2)}</td>


                {/* <td>{itemInv._id}</td>
                <td>{itemInv.title}</td>
                <td>{itemInv.quantity}</td>
                <td>{itemInv.price}</td>
                <td>{itemInv.amount}</td> */}
              </tr>
            </tbody>
          </React.Fragment>
        ))}
      </table>

      <div>
        <h2 className="flex items-end justify-end text-gray-800 text-4xl font-bold">
          Total..: $ {total.toLocaleString()}
        </h2>
      </div>
    </>
  );
}
