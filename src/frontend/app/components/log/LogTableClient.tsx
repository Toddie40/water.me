'use client'

import { useState, useEffect, type ChangeEvent, type JSX } from 'react';
import LogEntry from './LogEntry';
import { Table, Button, Container, Row, Col } from 'react-bootstrap';
import { LogResponse, LogRow } from '@/app/interfaces/log';


interface LogTableClientProps {
  initialLogs: LogResponse;
  initialPage: number;
  initialLinesPerPage: number;
  fetchLogsCallback: Function;
}

function generateHeader(logData: LogRow[]): JSX.Element | null {
  if (!logData.length) return null;
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

export default function LogTableClient({
  initialLogs,
  initialPage,
  initialLinesPerPage,
  fetchLogsCallback
}: LogTableClientProps): JSX.Element {
  const [logData, setLogData] = useState<LogResponse>(initialLogs);
  const [currentPage, setCurrentPage] = useState<number>(initialPage);
  const [linesPerPage, setLinesPerPage] = useState<number>(initialLinesPerPage);
  const [maxPage, setMaxPage] = useState<number>(Math.ceil(initialLogs.total/initialLinesPerPage))

  useEffect(() => {
    // Fetch new logs on page or linesPerPage change
    async function loadLogs() {
      try {
        const data = await fetchLogsCallback(currentPage, linesPerPage);
        setLogData(data);
      } catch (error) {
        console.error("Failed to fetch logs:", error);
        setLogData({items:[], total:0});
      }
    }

    setMaxPage(Math.ceil(logData.total / linesPerPage))

    // Don't fetch again on initial render (data already present)
    if (currentPage !== initialPage || linesPerPage !== initialLinesPerPage) {
        loadLogs();
    }
  }, [currentPage, linesPerPage]);


  function nextPage(): void {
    setCurrentPage(prev => Math.min(maxPage, prev + 1));
  }

  function prevPage(): void {
    setCurrentPage(prev => Math.max(1, prev - 1));
  }

  function updateLinesPerPage(e: ChangeEvent<HTMLInputElement>): void {
    const fallback = 10;
    const intified = parseInt(e.target.value, 10);
    setCurrentPage(1); // reset page on linesPerPage change
    if (isNaN(intified) || intified <= 0) {
      setLinesPerPage(fallback);
    } else {
      setLinesPerPage(intified);
    }
  }

  return (
    <Container>
      <Row className="my-3">
        <Col>
          <Button variant="primary" onClick={prevPage} disabled={currentPage === 1}>
            Previous Page
          </Button>
        </Col>
        <Col>
          <label>
            Items per page
            <input
              name="linesPerPage"
              type="number"
              min="1"
              max="100"
              value={linesPerPage}
              onChange={updateLinesPerPage}
              style={{ marginLeft: '0.5rem', width: '4rem' }}
            />
          </label>
        </Col>
        <Col>
          <Button variant="primary" onClick={nextPage} disabled={currentPage >= maxPage}>
            Next Page
          </Button>
        </Col>
      </Row>
      <Row>
        <Col>
          {logData.items.length === 0 ? (
            <p>No logs found.</p>
          ) : (
            <Table striped bordered hover>
              {generateHeader(logData.items)}
              <tbody>
                {logData.items.map(logDataRow => (
                  <LogEntry key={logDataRow.id} data={logDataRow} />
                ))}
              </tbody>
            </Table>
          )}
        </Col>
      </Row>
      <Row>
        <Col>
          <p>Page: {currentPage} / {maxPage}</p>
        </Col>
      </Row>
    </Container>
  );
}
