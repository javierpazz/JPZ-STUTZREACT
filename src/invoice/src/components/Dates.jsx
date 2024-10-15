export default function Dates({ invNum, invDat, dueDat }) {
  return (
    <>
      <article className="mt-10 mb-14 flex items-end justify-end">
        <ul>
          <li className="p-1 ">
            <span className="font-bold">Invoicer number:</span> {invNum}
          </li>
          <li className="p-1 bg-gray-100">
            <span className="font-bold">Invoice date:</span> {invDat}
          </li>
          <li className="p-1 ">
            <span className="font-bold">Due date:</span> {dueDat}
          </li>
        </ul>
      </article>
    </>
  );
}
