import { GetServerSidePropsContext } from "next";
import React from "react";
import { ConnectToDB } from "../backend/db/Database";
import { UserModel } from "../backend/db/schemas/User";
import styles from "../styles/pages/login.module.css"

interface LoginProps {
    email: String,
    password: String
}

/**
 * This method is run on the server and the data it returns is passed to the component's props
 * @see https://nextjs.org/docs/api-reference/data-fetching/get-server-side-props
 * @param ctx server side context
 * @returns an object containing properties to pass to the client
 */
export async function getServerSideProps(ctx: GetServerSidePropsContext) {
    ConnectToDB();
    const exampleUser = await UserModel.findOne({
        email: "example@example.com"
    }).exec();

    return {
        props: {
            email: exampleUser?.email,
            password: exampleUser?.password
        }
    };
}
/**
 * The login page (Key interaction #1)
 * Route: "/login"
 */
export default class Login extends React.Component<LoginProps> {
    override render(): React.ReactNode {
        return (
            <div className={styles["body"]}>

                <h1 className={styles["login-header"]}>Login Page</h1>
                <div className={styles["input-box"]}>
                    <input className={styles["input"]}></input>
                </div>
                <p className={styles["testing-styles"]}>Put Login Screen here</p>
                <p>Example of fetching user email (dont do this lol): {this.props.email}</p>
                <p>Example of fetching user password: (dont do this lol) {this.props.password}</p>
                <p>You probably want to set up an api endpoint in /api/ for creating a new user or logging in</p>
            </div>
        )
    }
}