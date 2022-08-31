import React, { useEffect, useState } from "react";
import AppRouter from "components/Router";
import { authService } from "fbase";

function App() {
    const [init, setInit] = useState(false);
    const [isLoggedIn, setIsLoggeedIn] = useState(false);
    const [userObj, setusetObj] = useState(null);

    useEffect(() => {
        authService.onAuthStateChanged((user) => {
            if (user) {
                setIsLoggeedIn(true);
                setusetObj(user);
            } else {
                setIsLoggeedIn(false);
            }
            setInit(true);
        });
    }, []);

    return (
        <>
            {init ? (
                <AppRouter isLoggedIn={isLoggedIn} userObj={userObj} />
            ) : (
                "Initail...."
            )}
            {/* <footer>&copy; Nwitter {new Date().getFullYear()}</footer> */}
        </>
    );
}

export default App;
