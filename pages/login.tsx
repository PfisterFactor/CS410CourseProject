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
            <div>
                <p className={styles["testing-styles"]}>Put Login Screen here</p>
            </div>
        )
    }
}