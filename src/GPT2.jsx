import React, { useState, useEffect } from "react";
import {
  Container,
  Form,
  FormControl,
  Button,
  Card,
  Row,
  Col,
} from "react-bootstrap";

const GPT2 = () => {
  const [inputText, setInputText] = useState("");

  const [maxLength, setMaxLength] = useState(100);
  const [seed, setSeed] = useState(42);
  const [device, setDevice] = useState("cuda:0");

  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);

  const [showHeaders, setShowHeaders] = useState(false);

  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };

  const [results, setResults] = useState("");

  const [headers, setHeaders] = useState("");

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
    const headersObj = {};
    response.headers.forEach((value, key) => {
      headersObj[key] = value;
    });
    setHeaders(JSON.stringify(headersObj, null, 2));
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
    <>
      <Container className="gpt2-container mt-3">
        <Row className="mb-3">
          <Col>
            <FormControl
              type="text"
              placeholder="Enter text"
              value={inputText}
              onChange={handleInputChange}
            />
          </Col>
          <Col xs="auto">
            <Button
              variant="primary"
              onClick={handleSubmit}
              disabled={!inputText.trim()}
            >
              Submit
            </Button>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col>
            <Form.Check
              type="switch"
              id="advanced-options-toggle"
              label="Show Advanced Options"
              checked={showAdvancedOptions}
              onChange={() => setShowAdvancedOptions(!showAdvancedOptions)}
            />
          </Col>
          <Col>
            <Form.Check
              type="switch"
              id="show-headers-toggle"
              label="Show Headers"
              checked={showHeaders}
              onChange={() => setShowHeaders(!showHeaders)}
            />
          </Col>
        </Row>
      </Container>
      <Container>
        {showAdvancedOptions && (
          <div className="p-3 border rounded">
            <Form className="d-flex mb-3">
              <Form.Group className="d-flex align-items-center me-2">
                <Form.Label className="me-2 mb-0">Max Length</Form.Label>
                <FormControl
                  type="number"
                  placeholder="Max Length"
                  value={maxLength}
                  onChange={handleMaxLengthChange}
                  min="10"
                  max="1024"
                />
              </Form.Group>
              <Form.Group className="d-flex align-items-center me-2">
                <Form.Label className="me-2 mb-0">Seed</Form.Label>
                <FormControl
                  type="number"
                  placeholder="Seed"
                  value={seed}
                  onChange={handleSeedChange}
                />
              </Form.Group>
              <Form.Group className="d-flex align-items-center me-2">
                <Form.Label className="me-2 mb-0">Device</Form.Label>
                <Form.Select value={device} onChange={handleDeviceChange}>
                  <option value="">Select a device</option>
                  <option value="cuda:0">cuda:0</option>
                  <option value="cuda:1">cuda:1</option>
                  <option value="cuda:2">cuda:2</option>
                  <option value="cuda:3">cuda:3</option>
                  <option value="cpu">cpu</option>
                </Form.Select>
              </Form.Group>
            </Form>
          </div>
        )}
        <Card className="mt-3">
          {showHeaders && (
            <Card.Body className="headers-area">
              <pre>{headers}</pre>
            </Card.Body>
          )}
          <Card.Body className="results-area">
            {results || "Results will be displayed here."}
          </Card.Body>
        </Card>
      </Container>
    </>
  );
};

export default GPT2;
