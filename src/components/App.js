import React, { useEffect, useState, useTransition } from "react";
import AppRouter from "components/Router";
import { authService } from "fbase";
import { updateCurrentUser, updateProfile } from "firebase/auth";

function App() {
    const [init, setInit] = useState(false);
    const [isLoggedIn, setIsLoggeedIn] = useState(false);
    const [userObj, setUserObj] = useState(null);

    useEffect(() => {
        authService.onAuthStateChanged((user) => {
            if (user) {
                setIsLoggeedIn(true);
                setUserObj({
                    displayName: user.displayName,
                    uid: user.uid,
                    updateProfile: (args) =>
                        updateProfile(user, { displayName: user.displayName }),
                });
            } else {
                setIsLoggeedIn(false);
            }
            setInit(true);
        });
    }, []);

    // const refreshUser = async () => {
    //     await updateCurrentUser(authService, authService.currentUser);
    //     setUserObj(authService.currentUser);
    // };

    const refreshUser = () => {
        const user = authService.currentUser;
        // await updateCurrentUser(authService, user);
        setUserObj({
            displayName: user.displayName,
            uid: user.uid,
            updateProfile: (args) =>
                updateProfile(user, { displayName: user.displayName }),
        });
        // setUserObj({
        //     displayName: user.displayName,
        //     uid: user.uid,
        //     updateProfile: (args) => user.updateProfile(args),
        // });
    };

    return (
        <>
            {init ? (
                <AppRouter
                    isLoggedIn={isLoggedIn}
                    userObj={userObj}
                    refreshUser={refreshUser}
                />
            ) : (
                "Initail...."
            )}
            {/* <footer>&copy; Nwitter {new Date().getFullYear()}</footer> */}
        </>
    );
}

export default App;
