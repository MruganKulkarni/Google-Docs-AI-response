import './App.css';
import React, { useEffect, useState } from 'react';
import LoginButton from "./components/login";
import LogoutButton from "./components/logout";
import { gapi } from 'gapi-script';
import axios from 'axios';

const CLIENT_ID = "[client id]";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [generatedText, setGeneratedText] = useState('');
  const [documentId, setDocumentId] = useState('[document id]'); // Default to the adult document

  useEffect(() => {
    function start() {
      gapi.load('auth2', () => {
        gapi.auth2.init({
          client_id: CLIENT_ID,
        }).then(() => {
          const authInstance = gapi.auth2.getAuthInstance();
          setIsLoggedIn(authInstance.isSignedIn.get());
          authInstance.isSignedIn.listen(setIsLoggedIn);
        });
      });
    }

    gapi.load('client:auth2', start);

    if (!isLoggedIn) {
      setGeneratedText('');
    }
  }, [isLoggedIn]);

  async function Chatbot() {
    if (!isLoggedIn) {
      alert('Please log in first!');
      return;
    }
    try {
      const response = await axios.get(`http://127.0.0.1:5000/api/home?document_id=${documentId}`);
      setGeneratedText(response.data.generated_text);
    } catch (error) {
      console.error('Error talking to Gemini:', error);
    }
  }

  return (
    <div className="App">
      <LoginButton setIsLoggedIn={setIsLoggedIn} setDocumentId={setDocumentId} />
      <LogoutButton />
      <button onClick={Chatbot} disabled={!isLoggedIn}>Talk to Gemini</button>
      {generatedText && (
        <div>
          <h2>Generated Text:</h2>
          <p>{generatedText}</p>
        </div>
      )}
    </div>
  );
}

export default App;
