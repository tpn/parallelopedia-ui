import React from "react";
import Stats from "./Stats";
import Container from "react-bootstrap/Container";
import Wiki from "./Wiki";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.scss";
import { Tabs } from "react-bootstrap";
import Tab from "react-bootstrap/Tab";

const App = () => {
  return (
    <Container>
      <header className="py-3">
        <h1>Parallelopedia UI</h1>
      </header>
      <main>
        <Tabs defaultActiveKey="stats" id="main-tabs">
          <Tab title="Wiki" eventKey="wiki">
            <Wiki />
          </Tab>
          <Tab title="Stats" eventKey="stats">
            <Stats />
          </Tab>
        </Tabs>
      </main>
    </Container>
  );
};

export default App;
