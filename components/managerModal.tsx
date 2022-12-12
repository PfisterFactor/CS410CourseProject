import axios from "axios";
import { deleteModel } from "mongoose";
import React, { useEffect, useState } from "react";
import styles from "../styles/pages/manager.module.css"

export default function ManModal(props: any) {
    const [modal, setModal] = useState(false);

    const toggleModal = () => {
        setModal(!modal);
    }

    const deleteURLData = () => {
        console.log("Deleting: ", props._id)

        axios.delete("http://localhost:3000/api/manager", {data: {doc_id: props._id}})
            .then(res => res.data)
            .then((jsonData) =>{
                toggleModal;
                console.log("wtf");
            });
        // alert("Data deleted! Reload page to see changes.");
    };

    const SubmitScheduleData = (e:any) => {
        e.preventDefault();
        var new_schedule  = e.target.schedule.value;
        console.log("Rescheduling URL with ID: ", props._id);
        console.log("New Schedule: ", new_schedule);
        
        if (new_schedule == null || new_schedule == "") {
            alert("ERROR! Invalid schedule was attempted to be added.");
        } else {
            alert("new schedule Updated for this document");
            toggleModal;
        }
    };

    return   (  
        <div>
            <button onClick={toggleModal} className={styles.btn_modal}>
                Edit
            </button>

            {modal && 
                (<div className={styles.modal}>
                    <div onClick={toggleModal} className={styles.overlay}></div>
                    <div className={styles.modal_content}>
                        <div className = {styles.modal_text}>
                            <h2>Current URL Data:</h2>

                            URL: {props?.url!} <br/>
                            Schedule: {props?.schedule!}<br/>
                            Scrapes Ran:{props?.scrapesRan!}<br/>
                        </div>
                        <br/><br/>

                        <form onSubmit={SubmitScheduleData}>
                            Enter new schedule:<br/>
                            <input type={"text"} name="schedule" className={styles.input_color} placeholder= {props?.schedule!} />
                            <button className={styles.submit_modal} >
                                Submit
                            </button>

                        </form>
                        <button className={styles.close_modal} onClick={toggleModal}>
                            CLOSE
                        </button>
                        <button className={styles.delete_modal} onClick={deleteURLData}>
                            Delete URL data
                        </button>
                    </div>
                </div>)
            }
        </div>
    )
};