import React from "react";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import Auth from "routes/Auth";
import Home from "routes/Home";
import Profile from "routes/Profile";
import Navigation from "components/Navigation";

const AppRouter = ({ isLoggedIn, userObj, refreshUser }) => {
    return (
        <Router>
            {isLoggedIn && <Navigation userObj={userObj} />}
            <Routes>
                {isLoggedIn ? (
                    <
                        // style={{
                        //     maxWidth: 890,
                        //     width: "100%",
                        //     margin: "0 auto",
                        //     marginTop: 80,
                        //     display: "flex",
                        //     justifyContent: "center",
                        // }}
                    >
                        <Route path="/" element={<Home userObj={userObj} />} />
                        <Route
                            path="/Profile"
                            element={
                                <Profile
                                    userObj={userObj}
                                    refreshUser={refreshUser}
                                />
                            }
                        />
                    </>
                ) : (
                    <Route path="/" element={<Auth />} />
                )}
            </Routes>
        </Router>
    );
};

export default AppRouter;
