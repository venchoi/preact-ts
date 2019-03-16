import { Component, h } from "preact";
// import Header from "./components/header";
import * as styles from "./app.scss";

if ((module as any).hot) {
  // tslint:disable-next-line:no-var-requires
  require("preact/debug");
}

export default class App extends Component {
  public render() {
    return (
        <div id="app" className={styles.app}>app</div>
    );
  }
}
