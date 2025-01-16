import React from "react";
import Stats from "./Stats";
import Container from "react-bootstrap/Container";
import Wiki from "./Wiki";
import GPT2 from "./GPT2";
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
      <main className="mt-3">
        <Tabs defaultActiveKey="wiki" id="main-tabs">
          <Tab title="Wiki" eventKey="wiki">
            <Wiki />
          </Tab>
          {false && (
            <Tab title="Stats" eventKey="stats">
              <Stats />
            </Tab>
          )}
          <Tab title="GPT2" eventKey="gpt2">
            <GPT2 />
          </Tab>
        </Tabs>
      </main>
    </Container>
  );
};

export default App;
