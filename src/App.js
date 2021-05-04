import logo from "./logo.svg";
import "./App.css";
import { withAuthenticator, AmplifySignOut } from "@aws-amplify/ui-react";

function App() {
  return (
    <div className="App">
      <div>
        <h1>React</h1>
        <AmplifySignOut />
      </div>
    </div>
  );
}

export default withAuthenticator(App);
