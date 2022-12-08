import { GetServerSidePropsContext } from "next";
import React, { createRef, RefObject, useState } from "react";
import WebsiteUrlInput from "../components/WebsiteUrlInput";
import styles from '../styles/pages/website-selector.module.css'
import { GenerateCSSSelector } from "../common/GenerateCSSSelector";

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
interface WebsiteSelectorProps {}

interface WebsiteSelectorState {
    currentWebsite: string | null,
    isLoadingWebsite: boolean
}

/**
 * The website selector page (Key interaction #2,#3)
 * Route: "/website-selector"
 */
export default class WebsiteSelector extends React.Component<WebsiteSelectorProps, WebsiteSelectorState> {
    ChildIFrame: RefObject<HTMLIFrameElement> | null;
    constructor(props: any) {
        super(props);
        this.state = {
            currentWebsite: null,
            isLoadingWebsite: false
        };
        this.ChildIFrame = createRef<HTMLIFrameElement>();
    }
    override componentDidMount(): void {
        (window as any).ChildIFrameEventHandler = this.OnChildIFrameEvent.bind(this);
    }
    override componentDidUpdate(prevProps: Readonly<WebsiteSelectorProps>, prevState: Readonly<WebsiteSelectorState>, snapshot?: any): void {
        if (prevState.currentWebsite != this.state.currentWebsite) {
            this.setState({ ...this.state, isLoadingWebsite: true });
        }
    }
    SendEventToChildIFrame(event: string, data: any = null) {
        (this.ChildIFrame?.current?.contentWindow as any).sendEventFromParent(event, data);
    }

    OnChildIFrameEvent(event: string, data: any) {
        switch (event) {
            case "SCRIPT_LOADED":
                this.SendEventToChildIFrame("START_SELECTION");
                this.setState({...this.state, isLoadingWebsite: false});
                break;
            case "ELEMENT_CLICKED":
                console.log(data);
                const cssSelector = GenerateCSSSelector(data);
                console.log(cssSelector)
            default:
                break;
        }
    }
    OnChildIFrameLoad(iframe: HTMLIFrameElement) {
        this.InjectSelectionScript(iframe);
    }
    InjectSelectionScript(iframe: HTMLIFrameElement) {
        const jqueryInject = document.createElement("script");
        const script = document.createElement("script");
        jqueryInject.src = "https://code.jquery.com/jquery-3.6.1.min.js";
        script.src = window.location.origin + "/inject/selectorScript.js";
        if (iframe?.contentWindow?.jQuery == null) {
            iframe.contentDocument?.head.appendChild(jqueryInject);
        }
        iframe.contentDocument?.head.appendChild(script);
    }

    override render(): React.ReactNode {
        return (
            <div className="flex flex-row flex-1">
                <div className="flex-col h-full bg-slate-400 w-1/3 border-r-2 border-slate-500 max-w-sm">
                    <div className="flex h-1/4 border-b-2 border-slate-500 bg-slate-300 items-center pb-10">
                        <WebsiteUrlInput onSearchClicked={(website) => this.setState({ currentWebsite: website })}></WebsiteUrlInput>
                    </div>
                </div>
                <div className="flex-1 flex-col h-full bg-slate-200">
                    <div className="w-full h-full flex flex-col p-5">
                        {this.state?.currentWebsite != null &&
                            <div className="w-full flex-1 border-2 border-black relative">
                                {this.state.isLoadingWebsite &&
                                    <div className="w-full h-full absolute flex items-center justify-center bg-slate-500/30">
                                        <svg className={`w-1/4 h-1/4 ${styles.spinning}`} aria-hidden="true" focusable="false" data-prefix="fas" data-icon="sync" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg=""><path fill="currentColor" d="M440.65 12.57l4 82.77A247.16 247.16 0 0 0 255.83 8C134.73 8 33.91 94.92 12.29 209.82A12 12 0 0 0 24.09 224h49.05a12 12 0 0 0 11.67-9.26 175.91 175.91 0 0 1 317-56.94l-101.46-4.86a12 12 0 0 0-12.57 12v47.41a12 12 0 0 0 12 12H500a12 12 0 0 0 12-12V12a12 12 0 0 0-12-12h-47.37a12 12 0 0 0-11.98 12.57zM255.83 432a175.61 175.61 0 0 1-146-77.8l101.8 4.87a12 12 0 0 0 12.57-12v-47.4a12 12 0 0 0-12-12H12a12 12 0 0 0-12 12V500a12 12 0 0 0 12 12h47.35a12 12 0 0 0 12-12.6l-4.15-82.57A247.17 247.17 0 0 0 255.83 504c121.11 0 221.93-86.92 243.55-201.82a12 12 0 0 0-11.8-14.18h-49.05a12 12 0 0 0-11.67 9.26A175.86 175.86 0 0 1 255.83 432z" data-darkreader-inline-fill="" ></path></svg>
                                    </div>
                                }
                                <iframe ref={this.ChildIFrame} className="w-full h-full" src={`/api/mirrorwebsite?mirror=${this.state.currentWebsite}`} sandbox="allow-scripts allow-same-origin" onLoad={(e) => this.OnChildIFrameLoad(e.target as HTMLIFrameElement)}></iframe>
                            </div>
                        }
                    </div>
                </div>
            </div>
        )
    }
}