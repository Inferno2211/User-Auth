const twilio = require("twilio");

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);
const verifySid = process.env.TWILIO_VERIFY_SID;

async function createVerification(mobile) {
    const verification = await client.verify.v2
        .services(verifySid)
        .verifications.create({
            channel: "sms",
            to: mobile,
        });
    return verification;
}

async function createVerificationCheck(code, mobile) {
    const verificationCheck = await client.verify.v2
        .services(verifySid)
        .verificationChecks.create({
            code: code,
            to: mobile,
        });
    return verificationCheck;
}

module.exports = { createVerification, createVerificationCheck };