import { useState } from "react";
export default function ArrayStateVariable() {
  const [array, setArray] = useState([1, 2, 3, 4, 5]);
  const addElement = () => {
    setArray([...array, Math.floor(Math.random() * 100)]);
  };
  const deleteElement = (index: number) => {
    setArray(array.filter((_item, i) => i !== index));
  };
  return (
    <div id="wd-array-state-variables">
      <h2>Array State Variable</h2>
      <button onClick={addElement} className="btn btn-success">Add Element</button>
      <ul style={{ listStyleType: "none", padding: 0 }}>
        {array.map((item, index) => (
          <li key={index}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              border: "1px solid #ccc",
              padding: "3px",
              borderRadius: "5px",
            }}
          >
            {item}
            <button
              onClick={() => deleteElement(index)}
              id="wd-delete-element-click"
              className="btn btn-danger"
            >
              Delete
            </button>
          </div>
        </li>
        ))}
      </ul>
      <hr/>
    </div>
  );
}
