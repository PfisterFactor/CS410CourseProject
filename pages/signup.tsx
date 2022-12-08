import { GetServerSidePropsContext } from "next";
import React, {useState} from "react";
import { ConnectToDB } from "../backend/db/Database";
import { UserModel } from "../backend/db/schemas/User";
import styles from "../styles/pages/login.module.css"
import { Input } from 'antd';
import { Form, Button } from 'antd'
import { useForm } from 'antd/lib/form/Form';
import mongoose = require("mongoose");
import axios from "axios";

interface SignupProps {
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
    // const [email, setEmail] = useState('');
    // const [password, setPassword] = useState('')

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
/**s
 * The login page (Key interaction #1)
 * Route: "/login"
 */
export default class Signup extends React.Component<SignupProps> {
    override render(): React.ReactNode {

		//ConnectToDB();

		const handleSubmit = (event: React.FormEvent) => {
			event.preventDefault();
			const email_input = document.getElementById('email_box').value;
			const pass_input = document.getElementById('pass_box').value;
			console.log(email_input); // sanity check
			console.log(pass_input); // sanity check
			axios.post('http://localhost:3000/api/signup', {params: {email: email_input, pass: pass_input}})
		}
		
        return (
            <div className={styles["body"]}>
				<form className={styles["body"]} onSubmit={handleSubmit}>
					<h1 className={styles["login-header"]}>New Account Setup</h1>
					<br/>
					<div className={styles["input-box"]}>
						<input id={"email_box"} className={styles["input"]} placeholder={"Username"}
							></input>
					</div>
					<br/>
					<div className={styles["input-box"]}>
						<input id={"pass_box"} className={styles["input"]} placeholder={"Password"} type={"password"}
							></input>
					</div>
					<br/>
					<div className={styles["input-box"]}>
						<button className={styles["button"]} type={"submit"}>Create New Account</button>
					</div>
				</form>
            </div>
        )
    }
}