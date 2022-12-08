import { GetServerSidePropsContext } from "next";
import React from "react";
import styles from '../styles/pages/website-selector.module.css'


interface WebsiteSelectorProps {
    test: string
}

/**
 * This method is run on the server and the data it returns is passed to the component's props
 * @see https://nextjs.org/docs/api-reference/data-fetching/get-server-side-props
 * @param ctx server side context
 * @returns an object containing properties to pass to the client
 */
export async function getServerSideProps(ctx: GetServerSidePropsContext) {
    return {
        props: {
            test: "testing123"
        }
    };
}
/**
 * The website selector page (Key interaction #2,#3)
 * Route: "/website-selector"
 */
export default class WebsiteSelector extends React.Component<WebsiteSelectorProps> {
    override render(): React.ReactNode {
        return (
            <div>
                Put website selector screen hereg
                <p>{this.props.test}</p>
            </div>
        )
    }
}