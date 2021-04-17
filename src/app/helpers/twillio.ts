import config from "$config";
import format from "string-format";
// const client = require("twilio")(config.twilio.sid, config.twilio.token);

const message = `Mã xác thực của bạn là: {code}`;

export const handlePhoneNumber = async (phoneNumber: string) => {
  if (phoneNumber.startsWith("84")) phoneNumber = "+" + phoneNumber;
  if (phoneNumber.startsWith("0")) phoneNumber = "+81" + phoneNumber.substr(1);
  return phoneNumber;
};

// export const sendSMS = async (params: any) => {
//   const { code, to } = params;

//   const body = format(message, { code });

//   client.messages
//     .create({ body, from: config.twilio.phoneNumber, to })
//     .then(() => console.log("success"))
//     .catch((err) => console.log("err", err));
// };
