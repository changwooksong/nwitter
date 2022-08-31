import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import Nweet from "components/Nweet";
import { dbService, storageService } from "fbase";
import {
    collection,
    addDoc,
    getDocs,
    onSnapshot,
    query,
} from "firebase/firestore";
import { ref, uploadString, getDownloadURL } from "firebase/storage";

export default function Home({ userObj }) {
    const [nweet, setNweet] = useState("");
    const [nweets, setNweets] = useState([]);
    const [attachment, setAttachment] = useState("");
    const getNweets = async () => {
        const dbNweet = await getDocs(collection(dbService, "nweets"));
        dbNweet.forEach((doc) => {
            const nweetObject = {
                ...doc.data(),
                id: doc.id,
            };
            setNweets((prev) => [nweetObject, ...prev]);
        });
    };

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
        // getNweets();
    }, []);

    const onSubmit = async (event) => {
        event.preventDefault();
        let attachmentUrl = "";
        // const storageRef = ref(storageService, `${userObj.uid}/${uuidv4()}`);
        // // 'file' comes from the Blob or File API
        // const response = await uploadString(storageRef, attachment, "data_url");
        // const attachmentUrl = await getDownloadURL(response.ref);

        if (attachment !== "") {
            //파일 경로 참조 만들기
            const storageRef = ref(
                storageService,
                `${userObj.uid}/${uuidv4()}`
            );
            //storage 참조 경로로 파일 업로드 하기
            const response = await uploadString(
                storageRef,
                attachment,
                "data_url"
            );
            //storage 참조 경로에 있는 파일의 URL을 다운로드해서 attachmentUrl 변수에 넣어서 업데이트
            attachmentUrl = await getDownloadURL(response.ref);
        }

        const nweetObj = {
            text: nweet,
            createdAt: Date.now(),
            creatorId: userObj.uid,
            attachmentUrl,
        };

        try {
            const docRef = await addDoc(
                collection(dbService, "nweets"),
                nweetObj
            );
            console.log("Document written with ID: ", docRef.id);
        } catch (error) {
            console.error("Error adding document: ", error);
        }
        setNweet("");
        setAttachment(null);
    };

    const onChange = (event) => {
        const {
            target: { value },
        } = event;
        setNweet(value);
    };

    const onFileChange = (event) => {
        const {
            target: { files },
        } = event;
        const theFile = files[0];
        const reader = new FileReader();
        reader.onloadend = (finishedEvent) => {
            const {
                currentTarget: { result },
            } = finishedEvent;
            setAttachment(result);
        };
        reader.readAsDataURL(theFile);
    };
    const onClearAttachment = () => {
        setAttachment(null);
    };

    return (
        <div>
            <form onSubmit={onSubmit}>
                <input
                    type="text"
                    placeholder="What`s on your mind?"
                    maxLength={120}
                    onChange={onChange}
                    value={nweet}
                />
                <input type="file" accept="image/*" onChange={onFileChange} />
                <input type="submit" value="Nweet" />
                {attachment && (
                    <>
                        <img src={attachment} width="50px" height="50px" />
                        <button onClick={onClearAttachment}>Clear</button>
                    </>
                )}
            </form>
            <div>
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
