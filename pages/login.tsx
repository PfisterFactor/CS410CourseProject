import React from "react";
import styles from "../styles/pages/login.module.css"

interface LoginProps {

}

/**
 * The login page (Key interaction #1)
 * Route: "/login"
 */
export default class Login extends React.Component<LoginProps> {
    override render(): React.ReactNode {
        console.log(styles);
        return (
            <div className={styles["body"]}>

                <h1 className={styles["login-header"]}>Login Page</h1>
                <div className={styles["input-box"]}>
                    <input className={styles["input"]}></input>
                </div>
            </div>
        )
    }
}