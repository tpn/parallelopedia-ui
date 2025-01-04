import React, { useState, useRef, useEffect } from "react";
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
  const handleSearch = (e) => {
    setQuery(e.target.value);
    setSelectedXml(null); // Clear selected XML when the search box is cleared
  };

  useEffect(() => {
    if (query.trim().length < 3) {
      setResults([]);
      setSearchStatus("");
      return;
    }

    setSearchStatus(`Searching for '${query}'...`);

    if (abortControllerRef.current) {
      abortControllerRef.current.abort(); // Cancel any ongoing fetch requests
    }

    const startTime = performance.now();
    abortControllerRef.current = new AbortController();
    const { signal } = abortControllerRef.current;

    const fetchData = async () => {
      try {
        const response = await fetch(`http://dgx:4444/offsets/${query}`, {
          mode: "cors",
          signal,
        });
        const data = await response.json();
        setResults(data);
        const endTime = performance.now();
        const duration = ((endTime - startTime) / 1000).toFixed(2);
        setSearchStatus(`Received ${data.length} results for '${query}' in ${duration} seconds.`);
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Error fetching search results:", error);
          setResults([]);
        }
      }
    };

    const timeoutId = setTimeout(fetchData, 1000);

    return () => clearTimeout(timeoutId);
  }, [query]);

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

      {query && (
        <div className="search-status mt-2 text-muted">
          {searchStatus}
        </div>
      )}
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
