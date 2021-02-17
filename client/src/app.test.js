import App from "./app";
import { render, waitFor, fireEvent } from "@testing-library/react";
import axios from "./axios";

jest.mock("./axios");

//NOT DONE
axios.get.mockResolvedValue({
    data: {
        first: "Nicola",
        last: "Gaioni",
        imgurl: "https://www.fillmurray.com/500/500",
        id: 1,
    },
});

test("app stuff", async () => {
    const { container } = render(<App />);
    // console.log("container.innerHTML: ", container.innerHTML);
    // i could test to see if the data has not yet loaded that the spinner div loads
    expect(container.innerHTML).toContain("spinner");

    // we can tell react testing library to wait for a specific dom element to be on the page before running more tests
    await waitFor(() => container.querySelector(".red-frame"));

    expect(container.innerHTML).toContain("h1");
    // console.log("container.innerHTML: ", container.innerHTML);
    // we can "fire" different event of elements of our choice and then look at the DOM again aftwards and run tests on it.
    const smallProfilePic = container.querySelector("img");
    fireEvent.click(smallProfilePic);
    // console.log("container.innerHTML: ", container.innerHTML);
    expect(container.innerHTML).toContain("Upload");
});

// console.log("testing...");

// const myMockFn = jest.fn((n) => n >= 18);

// test("filter calls function properly", () => {
//     const a = [22, 15, 37];
//     a.filter(myMockFn);

//     console.log("myMockFn.mock: ", myMockFn.mock);
//     // check that filter calls the callback for each element in the array
//     expect(myMockFn.mock.calls.length).toBe(3);

//     // check that the first element "passes" the filter check
//     expect(myMockFn.mock.results[0].value).toBeTruthy();

//     // check that the second element "fails" the filter check
//     expect(myMockFn.mock.results[1].value).toBe(false);
// });

//non so se funziona questa parte, devo ancora provarla
