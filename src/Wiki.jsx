import React, { useState } from "react";
import { Container, Form, FormControl, ListGroup, Card } from "react-bootstrap";

const Wiki = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [selectedXml, setSelectedXml] = useState(null);

  // Handle input change and fetch search results
  const handleSearch = async (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value.trim() !== "") {
      try {
        const response = await fetch(`http://localhost:4444/offsets/${value}`, {
          mode: 'cors'
        });
        const data = await response.json();
        setResults(data);
      } catch (error) {
        console.error("Error fetching search results:", error);
        setResults([]);
      }
    } else {
      setResults([]);
    }
  };

  // Handle item click and fetch XML data
  const handleResultClick = async (startByte, endByte) => {
    try {
      const response = await fetch(`http://localhost:4444/xml`, {
        headers: {
          Range: `bytes=${startByte}-${endByte}`,
        },
      });
      const xmlData = await response.text();
      setSelectedXml(xmlData);
    } catch (error) {
      console.error("Error fetching XML data:", error);
      setSelectedXml(null);
    }
  };

  return (
    <Container className="wiki-search-container">
      <Form>
        <FormControl
          type="search"
          placeholder="Search"
          className="me-2"
          aria-label="Search"
          value={query}
          onChange={handleSearch}
        />
      </Form>

      {results.length > 0 && (
        <ListGroup className="mt-3">
          {results.map(([name, startByte, endByte]) => (
            <ListGroup.Item
              key={`${name}-${startByte}`}
              action
              onClick={() => handleResultClick(startByte, endByte)}
            >
              {name}
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}

      {selectedXml && (
        <Card className="mt-3">
          <Card.Body>
            <pre>{selectedXml}</pre>
          </Card.Body>
        </Card>
      )}
    </Container>
  );
};

export default Wiki;
