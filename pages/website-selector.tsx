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
            <div className="flex flex-row flex-1">
                <div className="flex-1 flex-col h-full bg-red-500">
                    Left
                </div>
                <div className="flex-1 flex-col h-full bg-blue-500">
                    Right
                </div>
            </div>
        )
    }
}