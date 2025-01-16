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

  const [maxLength, setMaxLength] = useState("");
  const [seed, setSeed] = useState("");
  const [device, setDevice] = useState("");

  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);

  const [showHeaders, setShowHeaders] = useState(false);

  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };

  const [results, setResults] = useState("");

  const [headers, setHeaders] = useState("");

  const [charsPerSecond, setCharsPerSecond] = useState(0);
  const [startCharsTime, setStartCharsTime] = useState(null);
  const [totalChars, setTotalChars] = useState(0);

  const handleSubmit = async () => {
    setTotalChars(0); // Reset total characters
    setCharsPerSecond(0); // Reset characters per second
    setStartCharsTime(null); // Reset start character time
    setTotalChars(0); // Reset total characters
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
    const headersObj = {};
    response.headers.forEach((value, key) => {
      headersObj[key] = value;
    });
    setHeaders(JSON.stringify(headersObj, null, 2));

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      if (startCharsTime === null) {
        setStartCharsTime(performance.now());
      }
      const chunk = decoder.decode(value, { stream: true });
      const chars = chunk.length; // Calculate character length of the chunk
      setTotalChars((prevTotalChars) => prevTotalChars + chars);

      const currentTime = performance.now();
      const timeElapsed = (currentTime - startCharsTime) / 1000; // Convert to seconds
      const newCharsPerSecond = (totalChars + chars) / timeElapsed;
      setCharsPerSecond(newCharsPerSecond);

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
          <Card.Footer className="text-muted">
            {charsPerSecond.toFixed(2)} chars/s
          </Card.Footer>
        </Card>
      </Container>
    </>
  );
};

export default GPT2;
