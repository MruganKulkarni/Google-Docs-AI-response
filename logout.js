import React from 'react';
import { GoogleLogout } from 'react-google-login';

const clientid = "808675625599-71pa7g983jeo2jshn7ijqme0n5tisn65.apps.googleusercontent.com";

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
