import React from "react";
import "./InsertJson.scss";

const InsertJson = ({ onSubmit }) => {
  const jsonRef = React.useRef(null);

  const submitForm = (event) => {
    event.preventDefault();
    event.stopPropagation();

    try {
      const jsonValueText = jsonRef.current.value;
      const jsonValueParse = JSON.parse(jsonValueText);
      onSubmit(jsonValueParse);
    } catch (error) {
      alert("Ha ocurrido un error durante el parseo. Revisa la consola para más detalles.");
      console.error(error);
    }
  };

  return (
    <div className="insert-json">
      <form className="insert-json__form" onSubmit={submitForm}>
        <p className="insert-json__title">Introduce aquí el contenido del JSON:</p>
        <textarea className="insert-json__field" id="json" ref={jsonRef}></textarea>
        <input type="submit" value="ACEPTAR" />
      </form>
    </div>
  );
};

export default InsertJson;
