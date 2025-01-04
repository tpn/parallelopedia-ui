import React, { useState } from "react";
import { Container, Form, FormControl, ListGroup, Card } from "react-bootstrap";

const Wiki = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [selectedXml, setSelectedXml] = useState(null);

  // Debounce search function
  let searchTimeout = null;

  const handleSearch = (e) => {
    const value = e.target.value;
    setQuery(value);

    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    if (value.trim().length >= 3) {
      searchTimeout = setTimeout(async () => {
        try {
          const response = await fetch(`http://dgx:4444/offsets/${value}`, {
            mode: "cors",
          });
          const data = await response.json();
          setResults(data);
        } catch (error) {
          console.error("Error fetching search results:", error);
          setResults([]);
        }
      }, 1000);
    } else {
      setResults([]);
    }
  };

  // Handle item click and fetch XML data
  const handleResultClick = async (startByte, endByte) => {
    try {
      const response = await fetch(`http://dgx:4444/xml`, {
        headers: {
          Range: `bytes=${startByte}-${endByte}`,
        },
      });
      const xmlData = await response.text();
      setQuery(xmlData); // Place the string content into the search bar
      setSelectedXml(xmlData);
      setResults([]); // Clear results when an item is clicked
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
