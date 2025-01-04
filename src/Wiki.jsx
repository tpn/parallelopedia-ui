import React, { useState, useRef } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { solarizedlight } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Container, Form, FormControl, ListGroup, Card } from "react-bootstrap";

const Wiki = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [selectedXml, setSelectedXml] = useState(null);
  const [searchStatus, setSearchStatus] = useState("");

  // Debounce search function and abort controller for cancelling requests
  const abortControllerRef = useRef(null);
  let searchTimeout = null;

  const handleSearch = (e) => {
    const value = e.target.value;
    setQuery(value);

    setSearchStatus(`Searching for '${value}'...`);
    
    if (abortControllerRef.current) {
      abortControllerRef.current.abort(); // Cancel any ongoing fetch requests
    }

    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    if (value.trim().length >= 3) {
      searchTimeout = setTimeout(() => {
        abortControllerRef.current = new AbortController();
        const { signal } = abortControllerRef.current;
        try {
          fetch(`http://dgx:4444/offsets/${value}`, {
            mode: "cors",
            signal,
          })
            .then((response) => response.json())
            .then((data) => {
              setResults(data);
              setSearchStatus(`Received ${data.length} results for '${value}'...`);
            })
            .catch((error) => {
              if (error.name !== "AbortError") {
                console.error("Error fetching search results:", error);
                setResults([]);
              }
            });
        } catch (error) {
          console.error("Error fetching search results:", error);
          setResults([]);
        }
      }, 1000);
      setSelectedXml(null); // Clear selected XML when the search box is cleared
    } else {
      setResults([]);
    }
  };

  // Handle item click and fetch XML data
  const handleResultClick = async (name, startByte, endByte) => {
    try {
      const response = await fetch(`http://dgx:4444/xml`, {
        headers: {
          Range: `bytes=${startByte}-${endByte}`,
        },
      });
      const xmlData = await response.text();
      setQuery(name); // Place the result's name into the search bar
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

      <div className="search-status mt-2 text-muted">
        {searchStatus}
      </div>
        <ListGroup className="mt-3">
          {results.map(([name, startByte, endByte]) => (
            <ListGroup.Item
              key={`${name}-${startByte}`}
              action
              onClick={() => handleResultClick(name, startByte, endByte)}
            >
              {name}
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}

      {selectedXml && (
        <Card className="mt-3">
          <Card.Body>
            <SyntaxHighlighter language="xml" style={solarizedlight}>
              {selectedXml}
            </SyntaxHighlighter>
          </Card.Body>
        </Card>
      )}
    </Container>
  );
};

export default Wiki;
