import React from 'react';
import { GoogleLogin } from 'react-google-login';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const clientid = "[client id]";

function Login({ setIsLoggedIn, setDocumentId }) {
  const onSuccess = async (res) => {
    console.log("LOGIN SUCCESS! Current user: ", res.profileObj);

    // Decode the OAuth token to get user profile
    const decodedToken = jwtDecode(res.tokenId);
    console.log("Decoded Token: ", decodedToken);

    // Get the access token
    const accessToken = res.tokenObj.access_token;

    try {
      const response = await axios.get(`http://127.0.0.1:5000/api/get_document?access_token=${accessToken}`);
      const documentId = response.data.document_id;
      const birthdate = response.data.birthdate;
      console.log("Document ID: ", documentId);
      console.log("Birthdate: ", birthdate);

      // Update state with the document ID
      setDocumentId(documentId);
      setIsLoggedIn(true);
    } catch (error) {
      console.error('Error fetching document ID:', error);
    }
  };

  const onFailure = (res) => {
    console.log("LOGIN FAILED! res: ", res);
  };

  return (
    <div id="signInButton">
      <GoogleLogin
        clientId={clientid}
        buttonText="Login"
        onSuccess={onSuccess}
        onFailure={onFailure}
        cookiePolicy={'single_host_origin'}
        isSignedIn={true}
        scope="profile https://www.googleapis.com/auth/user.birthday.read"
      />
    </div>
  );
}

export default Login;
