import React, { useEffect, useState } from "react";
import api from "../lib/api";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  CircularProgress,
  Typography,
  TableSortLabel,
} from "@material-ui/core";

const DataTable = (props) => {
  const [fetchingData, setFetchingData] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);
  const [direction, setDirection] = useState("desc");

  const sortData = (direction, data) => {
    direction === "desc"
      ? data.sort((a, b) => b.timestamp - a.timestamp)
      : data.sort((a, b) => a.timestamp - b.timestamp);
  };

  const fetchData = async () => {
    setError(null);
    try {
      let result;
      props.table === "users"
        ? (result = await api.getUsersDiff())
        : (result = await api.getProjectsDiff());
      setFetchingData(false);
      if (result.code === 200) {
        sortData(direction, result.data);
        setData(result.data);
      } else {
        setError(result.error);
      }
    } catch (e) {
      setFetchingData(false);
      setError(e.error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []); // eslint-disable-line

  const rows = data.map((datum) => {
    const createData = (date, userId, oldValue, newValue) => ({
      date,
      userId,
      oldValue,
      newValue,
    });
    const date = new Date(datum.timestamp);
    const dateString = date.toISOString().split("T")[0];
    const diff = datum.diff[0];

    return createData(dateString, datum.id, diff.oldValue, diff.newValue);
  });

  return (
    <TableContainer component={Paper} className="table">
      {data.length && (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sortDirection={direction}>
                <TableSortLabel
                  direction={direction}
                  onClick={() => {
                    setDirection(direction === "asc" ? "desc" : "asc");
                    sortData(direction, data);
                  }}
                >
                  Date
                </TableSortLabel>
              </TableCell>
              <TableCell>User ID</TableCell>
              <TableCell>Old value</TableCell>
              <TableCell>New value</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, i) => (
              <TableRow key={i}>
                <TableCell>{row.date}</TableCell>
                <TableCell>{row.userId}</TableCell>
                <TableCell>{row.oldValue}</TableCell>
                <TableCell>{row.newValue}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
      <div className="buttonDiv">
        {error && (
          <Typography
            color="error"
            className="error"
            gutterBottom
            variant="subtitle2"
          >
            We had problems fetching your data. Please try again.
          </Typography>
        )}

        {fetchingData ? (
          <CircularProgress className="button" />
        ) : (
          <Button
            className="button"
            variant="contained"
            color="primary"
            onClick={() => {
              setFetchingData(true);
              fetchData();
            }}
          >
            {error ? "Retry" : "Load more"}
          </Button>
        )}
      </div>
    </TableContainer>
  );
};

export default DataTable;
