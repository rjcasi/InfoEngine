import { useEffect, useState } from "react";
import { pingBackend } from "./api";

function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    pingBackend().then(data => setMessage(data.message));
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>InfoEngine Cockpit</h1>
      <p>Backend says: {message}</p>
    </div>
  );
}

export default App;