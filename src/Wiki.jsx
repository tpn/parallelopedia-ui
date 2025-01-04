import React from 'react';
import { Container, Form, FormControl } from 'react-bootstrap';

const Wiki = () => {
    return (
        <Container className="wiki-search-container">
            <Form>
                <FormControl
                    type="search"
                    placeholder="Search"
                    className="me-2"
                    aria-label="Search"
                />
            </Form>
        </Container>
    );
};

export default Wiki;
