import Cookies from "js-cookie";
import { GetServerSidePropsContext } from "next";
import React from "react";
import { EmailInput } from "../components/login/EmailInput";
import { PasswordInput } from "../components/login/PasswordInput";
import styles from "../styles/pages/login.module.css";

interface LoginState {
  email: string;
  password: string;
  statusText: string;
}

/**
 * This method is run on the server and the data it returns is passed to the component's props
 * @see https://nextjs.org/docs/api-reference/data-fetching/get-server-side-props
 * @param ctx server side context
 * @returns an object containing properties to pass to the client
 */
export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  return {
    props: {},
  };
}
/**s
 * The login page (Key interaction #1)
 * Route: "/login"
 */
export default class Login extends React.Component<{}, LoginState> {
  constructor(props: any) {
    super(props);
    this.state = {
      email: "",
      password: "",
      statusText: "",
    };
  }
  OnSubmit(e: React.FormEvent) {
    e.preventDefault();
    this.Submit(e);
  }
  async Submit(e: React.FormEvent) {
    e.preventDefault();
    this.setState({ ...this.state, statusText: "" });
    const response = await fetch("/api/login", {
      method: "POST",
      body: JSON.stringify({
        email: this.state.email,
        password: this.state.password,
      }),
    });
    const jsonResp = await response.json();
	if (jsonResp["error"] != null) {
		this.setState({...this.state,statusText: jsonResp["error"]});
		return;
	}
	const loginToken = jsonResp["data"]?.["loginToken"];
	Cookies.set("LoginToken", loginToken, {
	  secure: true,
	  sameSite: "strict",
	});
	window.location.href = "/manager";
  }

  override render(): React.ReactNode {
    return (
      <div className="w-full h-full flex flex-col justify-center items-center">
        <div className="flex items-baseline justify-start">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="-2 -2 24 24"
            width={120}
            height={60}
            className={"inline-block"}
            fill="currentColor"
          >
            <path d="M3 12a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1H3zm0-2a3 3 0 0 1-3-3V3a3 3 0 0 1 3-3h14a3 3 0 0 1 3 3v4a3 3 0 0 1-3 3 3 3 0 0 1 3 3v4a3 3 0 0 1-3 3H3a3 3 0 0 1-3-3v-4a3 3 0 0 1 3-3zm0-8a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1H3zm2 4a1 1 0 1 1 0-2 1 1 0 0 1 0 2zm3 0a1 1 0 1 1 0-2 1 1 0 0 1 0 2zm0 10a1 1 0 1 1 0-2 1 1 0 0 1 0 2zm-3 0a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"></path>
          </svg>
          <h1 className="text-6xl mb-12">Web Scraper</h1>
        </div>
        <form className="border-2 w-1/2" onSubmit={(e) => this.OnSubmit(e)}>
          <h1 className="text-center text-3xl mt-8">Login</h1>
          <div className={styles["input-box"]}>
            <EmailInput
              onChange={(email) =>
                this.setState({ ...this.state, email: email })
              }
              value={this.state.email}
            ></EmailInput>
          </div>
          <div className={styles["input-box"]}>
            <PasswordInput
              onChange={(password) =>
                this.setState({ ...this.state, password: password })
              }
              value={this.state.password}
            ></PasswordInput>
          </div>
          <div className="text-center mt-4 mb-4">
            <button
              className="px-5 py-2.5 text-white bg-indigo-600 rounded-md duration-150 hover:bg-indigo-700 active:shadow-lg"
              type="submit"
            >
              Login
            </button>
          </div>
          <textarea
            readOnly
            id={"success_box"}
            className="text-center w-full"
            defaultValue={this.state.statusText}
          ></textarea>
        </form>
      </div>
    );
  }
}
