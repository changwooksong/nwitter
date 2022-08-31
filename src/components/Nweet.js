import React, { useState } from "react";
import { doc, deleteDoc, updateDoc } from "firebase/firestore";
import { deleteObject, ref } from "@firebase/storage";
import { dbService, storageService } from "fbase";

const Nweet = ({ nweetObj, isOwner }) => {
    const [editing, setEditing] = useState(false);
    const [newNweet, setNewNweet] = useState(nweetObj.text);

    const onDeleteClick = async () => {
        const ok = window.confirm(
            "Are you sure you want to delete this nweet?"
        );
        if (ok) {
            // delete nweet
            const NweetTextRef = doc(dbService, "nweets", nweetObj.id);
            await deleteDoc(NweetTextRef);

            const urlRef = ref(storageService, nweetObj.attachmentUrl);
            await deleteObject(urlRef);
        }
    };
    const toggleEditing = () => setEditing((prev) => !prev);
    const onChange = (event) => {
        const {
            target: { value },
        } = event;
        setNewNweet(value);
        // console.log(value);
    };
    const onSubmit = async (event) => {
        event.preventDefault();
        const NweetTextRef = doc(dbService, "nweets", nweetObj.id);
        await updateDoc(NweetTextRef, { text: newNweet });
        setEditing(false);
    };

    return (
        <div>
            {editing ? (
                <>
                    {isOwner && (
                        <>
                            <form onSubmit={onSubmit}>
                                <input
                                    type="text"
                                    placeholder="Edit your Nweet"
                                    value={newNweet}
                                    onChange={onChange}
                                    required
                                />
                                <input type="submit" value="Update Nweet" />
                            </form>
                            <button onClick={toggleEditing}>Cancle</button>
                        </>
                    )}
                </>
            ) : (
                <>
                    <h4>{nweetObj.text}</h4>
                    {nweetObj.attachmentUrl && (
                        <img
                            src={nweetObj.attachmentUrl}
                            width="50px"
                            height="50px"
                        />
                    )}
                    {isOwner && (
                        <>
                            <button onClick={onDeleteClick}>
                                Delete Nweet
                            </button>
                            <button onClick={toggleEditing}>Edit Nweet</button>
                        </>
                    )}
                </>
            )}
        </div>
    );
};

export default Nweet;
