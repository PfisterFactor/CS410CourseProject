import React, { useEffect, useState } from "react";
import styles from "../styles/pages/manager.module.css"


export default function ManModal() {
    const [modal, setModal] = useState(false);

    const toggleModal = () => {
    setModal(!modal);
    }

    return   (  
        <div>
            <button onClick={toggleModal} className={styles.btn_modal}>
                Scraping Settings Modal
            </button>

            {modal && (
                <div className={styles.modal}>
                <div onClick={toggleModal} className={styles.overlay}></div>
                <div className={styles.modal_content}>
                    <h2>Hello Modal</h2>
                    <p>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Provident
                    perferendis suscipit officia recusandae, eveniet quaerat assumenda
                    id fugit, dignissimos maxime non natus placeat illo iusto!
                    Sapiente dolorum id maiores dolores? Illum pariatur possimus
                    quaerat ipsum quos molestiae rem aspernatur dicta tenetur. Sunt
                    placeat tempora vitae enim incidunt porro fuga ea.
                    </p>
                    <button className={styles.close_modal} onClick={toggleModal}>
                    CLOSE
                    </button>
                </div>
                </div>
            )}
        </div>
    )
};