const Popup = ({ children, onClose }) => {
    return (
      <div className="popup-overlay">
        <div className="popup-content">
          {children}
          <button onClick={onClose} className="popup-close-btn">Close</button>
        </div>
      </div>
    );
  };
  
  export default Popup;
  