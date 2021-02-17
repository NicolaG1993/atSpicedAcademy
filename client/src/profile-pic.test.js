import ProfilePic from "./profile-pic";
import { render } from "@testing-library/react";

// 3 tests
// when no image from is passed, the default img is used as the src

test("when no image from is passed, the default img is used as the src", () => {
    const { container } = render(<ProfilePic />);
    // console.log(
    //     'container.querySelector("img"): ',
    //     container.querySelector("img").src
    // );
    const img = container.querySelector("img");
    expect(img.src.endsWith("/default.png")).toBe(true);
});

// when an image prop from is passed, that prop becomes the src of the image

test("when an image prop from is passed, that prop becomes the src of the image", () => {
    const { container } = render(
        <ProfilePic image="https://www.fillmurray.com/500/500" />
    );
    const img = container.querySelector("img");
    expect(img.src).toBe("https://www.fillmurray.com/500/500");
});

// first and last name become the alt tag of the image when passed as props

test("first and last name become the alt tag of the image when passed as props", () => {
    const { container } = render(<ProfilePic first="Pete" last="Anderson" />);
    const img = container.querySelector("img");
    expect(img.alt).toBe("Pete Anderson");
});
