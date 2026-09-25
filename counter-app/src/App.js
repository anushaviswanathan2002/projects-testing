import { useState } from "react";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  const increment = () => setCount((c) => c + 1);
  const decrement = () => setCount((c) => c - 1);
  const reset = () => setCount(0);

  return (
    <div className="app">
      <div className="card">
        <h1 className="title">Counter</h1>
        <div className={`count ${count > 0 ? "positive" : count < 0 ? "negative" : ""}`}>
          {count}
        </div>
        <div className="controls">
          <button className="btn btn-decrement" onClick={decrement}>−</button>
          <button className="btn btn-reset" onClick={reset}>Reset</button>
          <button className="btn btn-increment" onClick={increment}>+</button>
        </div>
      </div>
    </div>
  );
}

export default App;
