import React, { useEffect, useState } from "react";

const BtopWebSocket = () => {
  const [output, setOutput] = useState("");

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080");

    ws.onmessage = (event) => {
      //console.log("WebSocket message received:", event.data);
      setOutput(event.data);
    };

    ws.onclose = () => {
      //console.log("WebSocket connection closed");
    };

    return () => ws.close();
  }, []);

  return (
    <pre
      style={{
        backgroundColor: "#000",
        color: "#0f0",
        padding: "10px",
        borderRadius: "5px",
      }}
    >
      {output}
    </pre>
  );
};

export default BtopWebSocket;
