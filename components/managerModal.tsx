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
            });
    };

    const SubmitScheduleData = (e:any) => {
        e.preventDefault();
        var new_schedule  = e.target.schedule.value;
        console.log("Rescheduling URL with ID: ", props._id);
        console.log("New Schedule: ", new_schedule);

        const CRON_regex = /(((\d+,)+\d+|(\d+(\/|-)\d+)|\d+|\*) ?){5,7}/ // Taken from: https://regexpattern.com/cron-time-expression/
        const is_valid_CRON = CRON_regex.test(new_schedule);
        console.log(is_valid_CRON);

        if (new_schedule == null || new_schedule == "" || !is_valid_CRON) {
            alert("ERROR! Invalid schedule was attempted to be added. Please enter a valid CRON schedule. See \"https://crontab.guru/\" for help!");
        } else {
            console.log("before axios");
            axios.put("http://localhost:3000/api/manager", {data: {doc_id: props._id, update_schedule:new_schedule }});
            alert("Data Updated! Refresh window to see results!");
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
                            Current URL Data:<br/>

                            URL: {props?.url!} <br/>
                            Schedule: {props?.schedule!}<br/>
                            Scrapes Ran: {props?.scrapesRan!}<br/>
                        </div>
                        <br/><br/>

                        <form onSubmit={SubmitScheduleData}>
                            Enter new CRON schedule:<br/>
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