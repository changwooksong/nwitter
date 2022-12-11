import React, { useState } from "react";
import { doc, deleteDoc, updateDoc } from "firebase/firestore";
import { deleteObject, ref } from "@firebase/storage";
import { dbService, storageService } from "fbase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPencilAlt } from "@fortawesome/free-solid-svg-icons";

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
        <div className="nweet">
            {editing ? (
                <>
                    {isOwner && (
                        <>
                            <form
                                onSubmit={onSubmit}
                                className="container nweetEdit">
                                <input
                                    type="text"
                                    placeholder="Edit your Nweet"
                                    value={newNweet}
                                    onChange={onChange}
                                    required
                                    autoFocus
                                    className="formInput"
                                />
                                <input
                                    type="submit"
                                    value="Update Nweet"
                                    className="formBtn"
                                />
                            </form>
                            <span
                                onClick={toggleEditing}
                                className="formBtn cancelBtn">
                                Cancel
                            </span>
                        </>
                    )}
                </>
            ) : (
                <>
                    <h4>{nweetObj.text}</h4>
                    {nweetObj.attachmentUrl && (
                        <img src={nweetObj.attachmentUrl} />
                    )}
                    {isOwner && (
                        <div className="nweet__actions">
                            <span onClick={onDeleteClick}>
                                <FontAwesomeIcon icon={faTrash} />
                            </span>
                            <span onClick={toggleEditing}>
                                <FontAwesomeIcon icon={faPencilAlt} />
                            </span>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default Nweet;
