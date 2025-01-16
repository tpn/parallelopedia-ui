import React, { useState, useEffect } from "react";
import { Container, Form, FormControl, Button, Card } from "react-bootstrap";

const GPT2 = () => {
  const [inputText, setInputText] = useState("");

  const [maxLength, setMaxLength] = useState(100);
  const [seed, setSeed] = useState(42);
  const [device, setDevice] = useState("cuda:0");

  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };

  const [results, setResults] = useState("");

  const handleSubmit = async () => {
    setResults(""); // Clear previous results
    const encodedText = encodeURIComponent(inputText);
    const response = await fetch(
      `http://dgx:4444/generate/${encodedText}?max_length=${maxLength}&seed=${seed}&device=${device}`,
      {
        method: "GET",
      }
    );

    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value, { stream: true });
      setResults((prevResults) => prevResults + chunk);
    }
  };

  const handleMaxLengthChange = (e) => {
    setMaxLength(e.target.value);
  };

  const handleSeedChange = (e) => {
    setSeed(e.target.value);
  };

  const handleDeviceChange = (e) => {
    setDevice(e.target.value);
  };

  return (
    <Container className="gpt2-container mt-3">
      <Form className="d-flex mb-3">
        <FormControl
          type="text"
          placeholder="Enter text"
          value={inputText}
          onChange={handleInputChange}
        />
      </Form>
      <Form className="d-flex mb-3">
        <FormControl
          type="number"
          placeholder="Max Length"
          value={maxLength}
          onChange={handleMaxLengthChange}
          min="10"
          max="1024"
          className="me-2"
        />
        <FormControl
          type="number"
          placeholder="Seed"
          value={seed}
          onChange={handleSeedChange}
          className="me-2"
        />
        <Form.Select value={device} onChange={handleDeviceChange} className="me-2">
          <option value="cuda:0">cuda:0</option>
          <option value="cuda:1">cuda:1</option>
          <option value="cuda:2">cuda:2</option>
          <option value="cuda:3">cuda:3</option>
          <option value="cpu">cpu</option>
        </Form.Select>
        <Button
          variant="primary"
          onClick={handleSubmit}
          disabled={!inputText.trim()}
          className="ms-2"
        >
          Submit
        </Button>
      </Form>
      <Card className="mt-3">
        <Card.Body className="results-area">
          {results || "Results will be displayed here."}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default GPT2;