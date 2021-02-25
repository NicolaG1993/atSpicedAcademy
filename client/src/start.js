import ReactDOM from "react-dom";
import Welcome from "./welcome";
import { App } from "./app";

import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import reduxPromise from "redux-promise";
import { composeWithDevTools } from "redux-devtools-extension";
import { reducer } from "./redux/reducer";

import { init } from "./socket.js";

// function HelloWorld() {
//     return <div>Hello, World!</div>;
// }

const store = createStore(
    reducer,
    composeWithDevTools(applyMiddleware(reduxPromise))
);

let elem;
if (location.pathname === "/welcome") {
    elem = <Welcome />;
} else {
    elem =
        (init(store),
        (
            <Provider store={store}>
                <App />
            </Provider>
        ));
}

//render my function in my DOM?
ReactDOM.render(elem, document.querySelector("main"));
// ReactDOM.render(<HelloWorld />, document.querySelector("main"));

//npm start
//npm run dev
//npm run dev:server
//npm run dev:client
// sudo service postgresql start
// killall node

//npm run test filename ??
