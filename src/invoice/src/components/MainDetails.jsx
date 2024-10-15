export default function MainDetails({ codUse, name, address }) {
  return (
    <>
      <section className="flex flex-col items-end justify-end">
        <h5 className="font-bold text-3xl uppercase mb-1">
          User code.: {codUse}
        </h5>
        <h2 className="font-bold text-3xl uppercase mb-1">{name}</h2>
        <p>{address}</p>
      </section>
    </>
  );
}
