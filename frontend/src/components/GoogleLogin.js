import React, { useEffect } from "react";

const GoogleLogin = ( { callback } ) => {
    useEffect(() => {
        // eslint-disable-next-line no-undef
        google.accounts.id.initialize({
            client_id: '478018403135-baf8v8114d9rbsm59mg34ihgpq6lv169.apps.googleusercontent.com',
            callback: callback,
        });

        // eslint-disable-next-line no-undef
        google.accounts.id.renderButton(
            document.getElementById("google-signin-button"),
            {
                theme: "outline",
                size: "large",
            }
        );
    }, []);

    return <div id="google-signin-button"></div>;
};

export default GoogleLogin;