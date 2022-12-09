import { GetServerSidePropsContext } from "next";
import React, { createRef, RefObject } from "react";
import WebsiteUrlInput from "../components/website-selector/WebsiteUrlInput";
import styles from '../styles/pages/website-selector.module.css'
import { GenerateCSSSelector } from "../common/GenerateCSSSelector";
import { CompactTable } from '@table-library/react-table-library/compact';
import FrequencyDropdown from "../components/website-selector/FrequencyDropdown";
import { CRON_SCHEDULE } from "../common/CronSchedules";
import CronInput from "../components/website-selector/CronInput";

/**
 * This method is run on the server and the data it returns is passed to the component's props
 * @see https://nextjs.org/docs/api-reference/data-fetching/get-server-side-props
 * @param ctx server side context
 * @returns an object containing properties to pass to the client
 */
interface WebsiteSelectorProps { }

interface WebsiteSelectorState {
    currentWebsite: string | null,
    isLoadingWebsite: boolean,
    isSelectingElement: boolean,
    selectedElements: {
        id: string,
        name: string,
        selector: string
    }[],
    frequency: {
        name: string,
        cron: string
    }
}

/**
 * The website selector page (Key interaction #2,#3)
 * Route: "/website-selector"
 */
export default class WebsiteSelector extends React.Component<WebsiteSelectorProps, WebsiteSelectorState> {
    ChildIFrame: RefObject<HTMLIFrameElement> | null;
    COLUMNS = [
        { label: 'Name', renderCell: (item: any) => item.name },
        { label: 'Selector', renderCell: (item: any) => item.selector }
    ];
    constructor(props: any) {
        super(props);
        this.state = {
            currentWebsite: null,
            isLoadingWebsite: false,
            isSelectingElement: false,
            selectedElements: [],
            frequency: {
                "name": "monthly",
                cron: CRON_SCHEDULE["monthly"]
            }
        };
        this.ChildIFrame = createRef<HTMLIFrameElement>();
    }
    override componentDidMount(): void {
        (window as any).ChildIFrameEventHandler = this.OnChildIFrameEvent.bind(this);
    }
    override componentDidUpdate(prevProps: Readonly<WebsiteSelectorProps>, prevState: Readonly<WebsiteSelectorState>, snapshot?: any): void {
        if (prevState.currentWebsite != this.state.currentWebsite) {
            this.setState({ ...this.state, isLoadingWebsite: true, selectedElements: [], frequency: {"name": "monthly", "cron": CRON_SCHEDULE["monthly"]}, isSelectingElement: false });
        }
    }
    SendEventToChildIFrame(event: string, data: any = null) {
        (this.ChildIFrame?.current?.contentWindow as any).sendEventFromParent(event, data);
    }

    OnChildIFrameEvent(event: string, data: any) {
        switch (event) {
            case "SCRIPT_LOADED":
                this.setState({ ...this.state, isLoadingWebsite: false });
                break;
            case "ELEMENT_CLICKED":
                const cssSelector = GenerateCSSSelector(data);

                const selectedElements = this.state.selectedElements;
                const nextId = parseInt(selectedElements[selectedElements.length - 1]?.id ?? 0) + 1
                const newElement = {
                    id: nextId.toString(),
                    name: "element-" + nextId,
                    selector: cssSelector
                }
                this.setState({ ...this.state, isSelectingElement: false, selectedElements: [...selectedElements, newElement] })
            default:
                break;
        }
    }
    OnSelectElementButtonClick(e: React.MouseEvent) {
        if (this.state.currentWebsite == null || this.state.isLoadingWebsite) return;

        if (this.state.isSelectingElement) {
            this.SendEventToChildIFrame("STOP_SELECTION");
        }
        else {
            this.SendEventToChildIFrame("START_SELECTION");
        }
        this.setState({ ...this.state, isSelectingElement: !this.state.isSelectingElement });

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
    OnFrequencyValueChanged(v: string) {
        this.setState({
            ...this.state, frequency: {
                name: v,
                cron: (CRON_SCHEDULE as any)?.[v] ?? ""
            }
        });
    }
    CanSave() {
        return this.state.currentWebsite != null && !this.state.isLoadingWebsite && this.state.selectedElements.length > 0 && this.state.frequency.cron != "";
    }
    async OnSaveDetailClicked(e: React.MouseEvent) {
        if (!this.CanSave()) {
            e.preventDefault();
            return;
        }
        console.log("hi");
        await fetch("/api/scrapedetail", {
            method: "post",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },

            //make sure to serialize your JSON body
            body: JSON.stringify({
                data: {
                    selectedElements: this.state.selectedElements,
                    frequency: this.state.frequency,
                    website: this.state.currentWebsite
                }
            })
        }).then(r => {
            if (r.ok) {
                window.location.href = "/manager";
            }
        });
    }

    override render(): React.ReactNode {
        return (
            <div className="flex flex-row flex-1">
                <div className="flex flex-col h-full bg-slate-300 w-1/3 border-r-2 border-slate-500 max-w-sm">
                    <div className="flex h-1/4 border-b-2 border-slate-500 bg-slate-100 items-center pb-10">
                        <WebsiteUrlInput onSearchClicked={(website) => this.setState({ currentWebsite: website })}></WebsiteUrlInput>
                    </div>
                    <div className="flex grow flex-col items-center pt-2 pl-1 pr-1 relative">
                        <button
                            className="px-5 py-2.5 text-white bg-indigo-600 rounded-md duration-150 hover:bg-indigo-700 active:shadow-lg"
                            onClick={(e) => this.OnSelectElementButtonClick(e)}
                        >
                            {this.state.isSelectingElement ? "Stop selecting element" : "Select element"}
                        </button>
                        <div className="w-full mt-2 border-2">
                            <CompactTable columns={this.COLUMNS} data={{ nodes: this.state.selectedElements }}></CompactTable>
                        </div>
                        <hr></hr>
                        <div className="w-full border-slate-500 pt-10">
                            <FrequencyDropdown onValueChanged={(v) => this.OnFrequencyValueChanged(v)}></FrequencyDropdown>
                            {this.state.frequency.name == "custom" &&
                                <CronInput onChange={(v: any) => this.setState({ ...this.state, frequency: { name: "custom", cron: v } })}></CronInput>
                            }
                        </div>
                        <button
                            className={"absolute bottom-2 px-5 py-2.5 text-white bg-indigo-600 rounded-md duration-150 hover:bg-indigo-700 active:shadow-lg" + (this.CanSave() ? "" : " bg-gray-500 hover:bg-gray-500")}
                            onClick={(e) => this.OnSaveDetailClicked(e)}
                        >
                            Save Scrape Detail
                        </button>
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