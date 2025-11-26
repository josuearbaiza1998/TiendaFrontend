import React, { useEffect, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';

export default function App() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [openModal, setOpenModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('https://localhost:7082/getAll');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setItems(Array.isArray(data) ? data : [data]);
    } catch (err) {
      setError(err.message);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpen = (item) => {
    setSelectedItem(item);
    setOpenModal(true);
  };

  const handleClose = () => {
    setOpenModal(false);
    setSelectedItem(null);
  };

  return (
    <div className="container mt-4">
      <h2>Productos</h2>

      <div className="mb-2">
        <button className="btn btn-secondary" onClick={fetchData} disabled={loading}>
          {loading ? 'Cargando...' : 'Recargar'}
        </button>
      </div>

      {error && <div className="text-danger">Error: {error}</div>}

      {!error && items.length === 0 && !loading && <div>No hay datos</div>}

      {items.length > 0 && (
        <table className="table table-striped">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Precio</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {items.map((it) => (
              <tr key={it.id}>
                <td>{it.id}</td>
                <td>{it.nombre}</td>
                <td>{Number(it.precio).toFixed(2)}</td>
                <td>
                  <button className="btn btn-sm btn-primary" onClick={() => handleOpen(it)}>
                    Ver
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Modal para mostrar detalles */}
      <Modal show={openModal} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Detalle del producto</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedItem ? (
            <>
              <p><strong>ID:</strong> {selectedItem.id}</p>
              <p><strong>Nombre:</strong> {selectedItem.nombre}</p>
              <p><strong>Precio:</strong> {Number(selectedItem.precio).toFixed(2)}</p>
            </>
          ) : (
            <p>Cargando...</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}