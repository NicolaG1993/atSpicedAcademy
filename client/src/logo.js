export function Logo() {
    return (
        <div className="logo">
            {/* <h1>Logo</h1> */}
            <img src="/logo.png" alt="logo" />
        </div>
    );
}

// things in the public folder get served automatically, so if you go to localhost:8080/logo.png it will check if there is anything in the public folder and serve that
