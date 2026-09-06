export default function Modal({ title, onClose, children }) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="page-header">
          <h3 style={{ margin: 0 }}>{title}</h3>
          <button className="btn secondary" onClick={onClose}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}
