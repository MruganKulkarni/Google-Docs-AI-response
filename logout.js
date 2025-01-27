import React from 'react';
import { GoogleLogout } from 'react-google-login';

const clientid = "[client id]";

function Logout() {

    const onSuccess = () => {
        console.log("Log out Successfull");
    }

    return ( 
        <div id="signedOutButton">
            <GoogleLogout
                clientId={clientid}
                buttonText={"Logout"}
                onLogoutSuccess={onSuccess}
            />    
        </div>
    )
} 

export default Logout;
