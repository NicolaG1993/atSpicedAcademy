import BioEditor from "./bio-editor";
import { render, waitFor, fireEvent } from "@testing-library/react";
import axios from "./axios";

jest.mock("./axios");

test("add button is rendered if there is no bio", async () => {
    console.log();
});
