import ReactDOM from "react-dom";
import Welcome from "./welcome";
//render my function in my DOM?
// ReactDOM.render(<HelloWorld />, document.querySelector("main"));

// function HelloWorld() {
//     return <div>Hello, World!</div>;
// }

let elem;
if (location.pathname === "/welcome") {
    elem = <Welcome />;
} else {
    elem = <p>I am not the welcome route</p>;
}

ReactDOM.render(<Welcome />, document.querySelector("main"));

//npm start
//npm run dev:client
// sudo service postgresql start
