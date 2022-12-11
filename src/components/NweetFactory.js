import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { dbService, storageService } from "fbase";
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";

const NweetFactory = ({ userObj }) => {
    const [nweet, setNweet] = useState("");
    const [attachment, setAttachment] = useState("");

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

    const onClearAttachment = () => setAttachment("");

    return (
        <form onSubmit={onSubmit} className="factoryForm">
            {/* <input
                type="text"
                placeholder="What`s on your mind?"
                maxLength={120}
                onChange={onChange}
                value={nweet}
            />
            <input type="file" accept="image/*" onChange={onFileChange} />
            <input type="submit" value="Nweet" /> */}
            <div className="factoryInput__container">
                <input
                    className="factoryInput__input"
                    value={nweet}
                    onChange={onChange}
                    type="text"
                    placeholder="What's on your mind?"
                    maxLength={120}
                />
                <input
                    type="submit"
                    value="&rarr;"
                    className="factoryInput__arrow"
                />
            </div>
            <label htmlFwor="attach-file" className="factoryInput__label">
                <span>Add photos</span>
                <FontAwesomeIcon icon={faPlus} />
            </label>
            <input
                id="attach-file"
                type="file"
                accept="image/*"
                onChange={onFileChange}
                style={{
                    opacity: 0,
                }}
            />
            {attachment && (
                <div className="factoryForm__attachment">
                    <img
                        src={attachment}
                        style={{
                            backgroundImage: attachment,
                        }}
                    />
                    <div
                        className="factoryForm__clear"
                        onClick={onClearAttachment}
                    >
                        <span>Remove</span>
                        <FontAwesomeIcon icon={faTimes} />
                    </div>
                </div>
            )}
        </form>
    );
};

export default NweetFactory;
