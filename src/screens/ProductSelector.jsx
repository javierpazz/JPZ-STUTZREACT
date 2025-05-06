import React, { useState, useRef, useEffect } from 'react';


  const ProductSelector = ( {onSelect,suppliers} ) => {
    const [search, setSearch] = useState('');
  const [filtered, setFiltered] = useState(suppliers);
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus(); // Focus automático
  }, []);

  const handleChange = (e) => {
    const value = e.target.value.toUpperCase();
    setSearch(value);
    const result = suppliers.filter(p =>
      p.codSup.includes(value) || p.name.toLowerCase().includes(value.toLowerCase())
    );
    setFiltered(result);
};

  return (
    <div style={{ padding: '10px' }}>
    <label htmlFor="codeInput">Código del Proovedor:</label>
    <input
      id="codeInput"
      ref={inputRef}
      type="text"
      value={search}
      onChange={handleChange}
      style={{ width: '100%', padding: '8px', marginBottom: '5px' }}
      autoComplete="off"
    />
    {filtered.length > 0 && (
      <ul
        style={{
          listStyle: 'none',
          padding: 0,
          border: '1px solid #ccc',
          maxHeight: '350px',
          overflowY: 'auto',
          margin: 0
        }}
      >
        {filtered.map(p => (
          <li
            key={p.codSup}
              onClick={() => onSelect(p)}
              style={{
              padding: '6px',
              cursor: 'pointer',
              borderBottom: '1px solid #eee',
              backgroundColor: '#fff'
            }}
          >
            <strong>{p.codSup}</strong> - {p.name}
          </li>
        ))}
      </ul>
    )}
  </div>


  );
}


export default ProductSelector;
