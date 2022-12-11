import React, { useEffect, useState } from "react";
import Nweet from "components/Nweet";
import { dbService } from "fbase";
import { collection, onSnapshot, query } from "firebase/firestore";
import NweetFactory from "components/NweetFactory";

export default function Home({ userObj }) {
    const [nweets, setNweets] = useState([]);
    // const getNweets = async () => {
    //     const dbNweet = await getDocs(collection(dbService, "nweets"));
    //     dbNweet.forEach((doc) => {
    //         const nweetObject = {
    //             ...doc.data(),
    //             id: doc.id,
    //         };
    //         setNweets((prev) => [nweetObject, ...prev]);
    //     });
    // };

    useEffect(() => {
        const q = query(collection(dbService, "nweets"));
        onSnapshot(q, (snapshot) => {
            const nweetArr = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            console.log(nweetArr);
            setNweets(nweetArr);
        });
    }, []);

    return (
        <div className="container">
            <NweetFactory userObj={userObj} />
            <div style={{ marginTop: 30 }}>
                {nweets.map((nweet) => (
                    <Nweet
                        key={nweet.id}
                        nweetObj={nweet}
                        isOwner={nweet.creatorId === userObj.uid}
                    />
                ))}
            </div>
        </div>
    );
}
