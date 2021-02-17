exports.requireLoggedInUser = function (req, res, next) {
    if (!req.session.userId) {
        res.redirect("/welcome");
    } else {
        next();
    }
};

exports.requireLoggedOutUser = (req, res, next) => {
    if (req.session.userId) {
        return res.redirect("/");
    }
    next();
};

exports.setToken = (req, res, next) => {
    res.cookie("mytoken", req.csrfToken());
    next();
};

exports.dealWithCookieVulnerabilities = (req, res, next) => {
    res.set("x-frame-options", "deny");
    res.locals.csrfToken = req.csrfToken();
    next();
};
