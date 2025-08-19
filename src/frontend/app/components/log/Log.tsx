'use client'

import { Table, Button, Container, Row, Col } from 'react-bootstrap';
import LogEntry from './LogEntry';
import { useState, type ChangeEvent, type JSX } from 'react';

// Define an interface for each log row. Adjust the types as needed.
interface LogRow {
  id: string | number;
  [key: string]: any;
}

// Importing the JSON; we expect log.log to be an array of LogRow items.
import log from '../../test/test_log.json';

// Generate the table header from the keys of the first log entry.
function generateHeader(logData: LogRow[]): JSX.Element {
  const keys: string[] = Object.keys(logData[0]);

  return (
    <thead>
      <tr>
        {keys.map((key) => (
          <th key={key}>{key}</th>
        ))}
      </tr>
    </thead>
  );
}

const Log = (): JSX.Element => {
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [linesPerPage, setLinesPerPage] = useState<number>(10);

  // Cast the imported log data to LogRow[]
  const allLogs = (log.log as LogRow[]);
  const logData: LogRow[] = allLogs.slice(
    currentPage * linesPerPage,
    currentPage * linesPerPage + linesPerPage
  );

  function nextPage(): void {
    setCurrentPage(prev => Math.min(prev + 1, Math.floor((allLogs.length - 1) / linesPerPage)));
  }

  function prevPage(): void {
    setCurrentPage(prev => Math.max(0, prev - 1));
  }

  function updateLinesPerPage(e: ChangeEvent<HTMLInputElement>): void {
    const fallback = 10;
    const intified = parseInt(e.target.value, 10);

    if (isNaN(intified) || intified <= 0) {
      setLinesPerPage(fallback);
    } else {
      setLinesPerPage(intified);
    }
  }

  return (
    <Container>
      <Row>
        <Col>
          <Button variant="primary" onClick={prevPage}>
            previous page
          </Button>
        </Col>
        <Col>
          <label>
            Items per page
            <input
              name="Lines per page"
              type="number"
              min="1"
              max="20"
              defaultValue="10"
              onChange={updateLinesPerPage}
            />
          </label>
        </Col>
        <Col>
          <Button variant="primary" onClick={nextPage}>
            next page
          </Button>
        </Col>
      </Row>
      <Row>
        <Col>
          <Table striped bordered hover>
            {generateHeader(logData)}
            <tbody>
              {logData.map((logDataRow) => (
                <LogEntry key={logDataRow.id} data={logDataRow} />
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>
      <Row>
        <Col>
          <p>Page: {currentPage + 1}</p>
        </Col>
      </Row>
    </Container>
  );
};

export default Log;