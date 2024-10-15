import React from 'react';

export default function Table({ invoiceItems, total }) {
  total = invoiceItems.reduce((a, c) => a + c.price * c.quantity, 0);

  return (
    <>
      {console.log(invoiceItems)}

      <table width="100%" className="mb-10">
        <thead>
          <tr className="bg-gray-100 p-1">
            <td className="font-bold">Product Code</td>
            <td className="font-bold">Product Description</td>
            <td className="font-bold">Quantity</td>
            <td className="font-bold">Price</td>
            <td className="font-bold">Amount</td>
          </tr>
        </thead>
        {invoiceItems?.map((itemInv) => (
          <React.Fragment key={itemInv._id}>
            <tbody>
              <tr className="h-10">
                <td>{itemInv._id}</td>
                <td>{itemInv.name}</td>
                <td>{itemInv.quantity}</td>
                <td>{itemInv.price}</td>
                <td>{itemInv.amount}</td>
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
