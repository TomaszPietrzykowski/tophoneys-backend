const asyncHandler = require("express-async-handler")
const nodemailer = require("nodemailer")
const logger = require("../Logger")
const appEmails = require("../utils/appEmails")

// ***************************************************
//
//     I Website contact form handler
//
exports.sendEmail = asyncHandler(async (req, res) => {
  const senderEmail = req.body.email
  const senderName = req.body.name
  const content = req.body.message

  // 1. Get content of
  // a) original message from contact form
  const output = `<p>From: ${senderName}</p>
  <p>Email: ${senderEmail}</p>
  <p>${content}</p>
  `
  const txt = `${content}`

  // b) confirmation message to sender
  const outputResponse = appEmails.sendEmailConfirmationHtml(senderName)
  const txtResponse = appEmails.sendEmailConfirmationTxt(senderName)

  // c) vendor new email notification
  const outputNotify = appEmails.newEmailNotificationHtml(
    senderEmail,
    senderName
  )
  const txtNotify = appEmails.newEmailNotificationTxt(senderEmail, senderName)

  // 2. Create  transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_CLIENT_ID,
      pass: process.env.EMAIL_CLIENT_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false,
    },
  })

  // 3. Send actual email
  let info = await transporter.sendMail({
    from: process.env.VENDOR_OFFICIAL_EMAIL,
    to: process.env.VENDOR_OFFICIAL_EMAIL,
    replyTo: `${senderName}<${senderEmail}>`,
    subject: `New message from: ${senderName}<${senderEmail}>`,
    text: txt,
    html: output,
  })

  // 4. Send confirmation email
  await transporter.sendMail({
    from: process.env.VENDOR_OFFICIAL_EMAIL,
    to: `${senderName}<${senderEmail}>`,
    subject: `Thank you for reaching out to us :)`,
    text: txtResponse,
    html: outputResponse,
  })

  // 5. Send new email notification to vendor
  await transporter.sendMail({
    from: process.env.VENDOR_OFFICIAL_EMAIL,
    to: process.env.VENDOR_CONFIRMATION_EMAIL,
    subject: `New email in TOP HONEYS inbox!`,
    text: txtNotify,
    html: outputNotify,
  })
  res.status(200).json({
    status: "success",
    message: "email has been sent",
    envelope: info.envelope,
    accepted: info.accepted,
  })
})

// ***************************************************
//
//     II App confirmation emails handler
//
exports.sendConfirmationEmail = async (
  clientEmail,
  clientName,
  orderId,
  type
) => {
  // 1. Get content for:
  // a) order creation confirmation email:
  const orderHtmlOutput = appEmails.orderConfirmationHtml(orderId)
  const orderTxtOutput = appEmails.orderConfirmationTxt(orderId)

  // b) purchase confirmation email:
  const PurchaseHtmlOutput = appEmails.purchaseConfirmationHtml(
    clientName,
    orderId
  )
  const PurchaseTxtOutput = appEmails.purchaseConfirmationTxt(
    clientName,
    orderId
  )

  // c) new purchase vendor notification
  const newPurchaseHtml = appEmails.purchaseNotificationHtml(orderId)
  const newPurchaseTxt = appEmails.purchaseNotificationTxT(orderId)

  // d) registration confirmation email
  const newRegisterHtml = appEmails.registerConfirmationHtml(clientName)
  const newRegisterTxt = appEmails.registerConfirmationTxT(clientName)

  // 2. Determine email content based on passed type
  const htmlOutput =
    type === "order"
      ? orderHtmlOutput
      : type === "purchase"
      ? PurchaseHtmlOutput
      : newRegisterHtml
  const txtOutput =
    type === "order"
      ? orderTxtOutput
      : type === "order"
      ? PurchaseTxtOutput
      : newRegisterTxt
  const title =
    type === "order"
      ? `Your order at TOP HONEYS`
      : type === "purchase"
      ? `Thank you for your purchase at TOP HONEYS`
      : `Welcome at TOP HONEYS ${clientName} :)`

  try {
    // 3. Create  transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_CLIENT_ID,
        pass: process.env.EMAIL_CLIENT_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false,
      },
    })

    // 4. Send actual confirmation email
    let info = await transporter.sendMail({
      from: process.env.VENDOR_OFFICIAL_EMAIL,
      to: `${clientName}<${clientEmail}>`,
      subject: title,
      text: txtOutput,
      html: htmlOutput,
    })

    if (type === "purchase") {
      // 5. Send purchase notification to vendor
      await transporter.sendMail({
        from: process.env.VENDOR_OFFICIAL_EMAIL,
        to: process.env.VENDOR_CONFIRMATION_EMAIL,
        subject: `New purchase in your shop!`,
        text: newPurchaseTxt,
        html: newPurchaseHtml,
      })
    }
  } catch (err) {
    logger.log({
      msg: `### APP ERROR ###\nOriginated in: emailController.sendConfirmationEmail()\nError: ${err}`,
    })
    throw new Error(err)
  }
}
