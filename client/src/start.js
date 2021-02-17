import ReactDOM from "react-dom";
import Welcome from "./welcome";
import { App } from "./app";
//render my function in my DOM?
// ReactDOM.render(<HelloWorld />, document.querySelector("main"));

// function HelloWorld() {
//     return <div>Hello, World!</div>;
// }

let elem;
if (location.pathname === "/welcome") {
    elem = <Welcome />;
} else {
    elem = <App />;
}

ReactDOM.render(elem, document.querySelector("main"));

//npm start
//npm run dev
//npm run dev:server
//npm run dev:client
// sudo service postgresql start
// killall node

//npm run test filename ??
