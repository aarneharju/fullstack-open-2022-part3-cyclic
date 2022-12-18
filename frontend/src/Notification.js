import React from "react";
import styles from './Notification.module.css';

const Notification = ({ messageObject }) => {
    const type = messageObject ? messageObject.type : null;

    if (messageObject === null) {
        return null;
    }

    return (
        <div className={styles[type]}>
            <p>{messageObject.message}</p>
        </div >
    )

}

export default Notification;