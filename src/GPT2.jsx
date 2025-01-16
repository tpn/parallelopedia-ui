import React, { useState, useEffect } from "react";
import { Container, Form, FormControl, Button, Card } from "react-bootstrap";

const GPT2 = () => {
  const [inputText, setInputText] = useState("");

  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };

  const [results, setResults] = useState("");

  const handleSubmit = async () => {
    setResults(""); // Clear previous results
    const encodedText = encodeURIComponent(inputText);
    const response = await fetch(`http://dgx:4444/generate/${encodedText}`, {
      method: "GET",
    });

    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value, { stream: true });
      setResults((prevResults) => prevResults + chunk);
    }
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
