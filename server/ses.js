const aws = require("aws-sdk");

let secrets;
if (process.env.NODE_ENV == "production") {
    secrets = process.env; // in prod the secrets are environment variables
} else {
    secrets = require("./secrets"); // in dev they are in secrets.json which is listed in .gitignore
}

const ses = new aws.SES({
    accessKeyId: secrets.AWS_KEY,
    secretAccessKey: secrets.AWS_SECRET,
    region: "eu-west-1", // Ireland
    // Frankfurt eu-central-1
});

exports.sendEmail = function (recipient, message, subject) {
    return ses
        .sendEmail({
            // whatever email address you verified should go here!
            // if you're using spiced credentials - use the @spicedling address you were assigned here
            Source: "My Social Network <daffy.handball@spicedling.email>",
            Destination: {
                ToAddresses: [recipient],
            },
            Message: {
                Body: {
                    Text: {
                        Data: message,
                    },
                },
                Subject: {
                    Data: subject,
                },
            },
        })
        .promise()
        .then(() => console.log("ses.sendEmail worked!"))
        .catch((err) => console.log(err));
};
