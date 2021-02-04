import React from "react";
import Table from "./Table";
import Container from "@material-ui/core/Container";
import Box from "@material-ui/core/Box";

export const App = () => {
  return (
    <Container className="app" fixed>
      <Box data-testid="app-box" m={2}>
        <Table table="users" />
        <Table />
      </Box>
    </Container>
  );
};

export default App;
