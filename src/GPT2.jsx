import React, { useState } from "react";
import { Container, Form, FormControl, Button, Card } from "react-bootstrap";

const GPT2 = () => {
  const [inputText, setInputText] = useState("");

  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };

  const handleSubmit = () => {
    // Placeholder for future HTTP request
    console.log("Submitted:", inputText);
  };

  return (
    <Container className="gpt2-container">
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
        <Card.Body>
          {/* Placeholder for results */}
          Results will be displayed here.
        </Card.Body>
      </Card>
    </Container>
  );
};

export default GPT2;
