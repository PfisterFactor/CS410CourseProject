import Cookies from "js-cookie";
import React from "react";

export default class Signout extends React.Component<{},{}> {
    override render() {
        return (
        <div className="w-full h-full flex justify-center items-center">
            <h1>Logging you out...</h1>
        </div>);
    }
    override componentDidMount(): void {
        Cookies.remove("LoginToken", {
            "secure": true,
            "sameSite": "strict"
        });
        window.location.href = "/login";
    }
}