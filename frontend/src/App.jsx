import { useState } from 'react';
import axios from 'axios';

function App() {
  const [method, setMethod] = useState('GET');
  const [url, setUrl] = useState(
    'https://jsonplaceholder.typicode.com/posts/1'
  );
  const [body, setBody] = useState('{}');
  const [response, setResponse] = useState(null);
  const [tests, setTests] = useState('');
  const [loading, setLoading] = useState(false);

  const sendRequest = async () => {
    try {
      setLoading(true);

      const parsedBody = body ? JSON.parse(body) : {};

      const result = await axios.post(
        'http://localhost:3001/send-request',
        {
          method,
          url,
          body: parsedBody,
        }
      );

      setResponse(result.data);
      setTests('');
    } catch (error) {
      console.error(error);
      alert('Error al enviar request');
    } finally {
      setLoading(false);
    }
  };

  const generateTests = async () => {
    try {
      const result = await axios.post(
        'http://localhost:3001/generate-tests',
        {
          responseBody: response.data,
          status: response.status,
        }
      );

      setTests(result.data.tests);
    } catch (error) {
      console.error(error);
      alert('Error al generar tests');
    }
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      alert('Copiado al portapapeles');
    } catch (error) {
      console.error(error);
      alert('No se pudo copiar');
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>API Test Builder</h1>

      <select
        value={method}
        onChange={(e) => setMethod(e.target.value)}
      >
        <option>GET</option>
        <option>POST</option>
        <option>PUT</option>
        <option>DELETE</option>
      </select>

      <input
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        style={{ width: '600px', marginLeft: '10px' }}
      />

      <br />
      <br />

      <textarea
        rows="8"
        cols="100"
        value={body}
        onChange={(e) => setBody(e.target.value)}
      />

      <br />
      <br />

      <button onClick={sendRequest}>Send Request</button>

      {loading && <p>Loading...</p>}

      {response && (
        <>
          <h2>Status: {response.status}</h2>

          <pre
            style={{
              background: '#f4f4f4',
              padding: '10px',
              whiteSpace: 'pre-wrap',
            }}
          >
            {JSON.stringify(response.data, null, 2)}
          </pre>

          <button onClick={generateTests}>
            Generate Postman Tests
          </button>
        </>
      )}

      {tests && (
        <>
          <button
            onClick={() => copyToClipboard(tests)}
            style={{ marginTop: '20px' }}
          >
            Copy Tests
          </button>

          <pre
            style={{
              background: '#f4f4f4',
              padding: '10px',
              whiteSpace: 'pre-wrap',
              marginTop: '10px',
            }}
          >
            {tests}
          </pre>
        </>
      )}
    </div>
  );
}

export default App;