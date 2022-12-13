import "../styles/globals.css";
import type { AppContext, AppInitialProps, AppProps } from "next/app";
import App from "next/app";
import { AppHeader } from "../components/AppHeader";

/**
 * Parent component for all components in a NextJS application
 * Runs on server
 * We shouldn't have to touch this
 * See: https://nextjs.org/docs/advanced-features/custom-app
 */
export default class MyApp extends App<AppProps> {
  override render(): JSX.Element {
    return (
      <div className="h-screen flex flex-col">
        <AppHeader />
        <this.props.Component {...this.props.pageProps} />
      </div>
    );
  }
}
