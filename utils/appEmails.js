//
//
//   Application level email contents for confirmation and notification purposes
//
//
const template = require("./emailTemplate")

//    ***************************************************************************
//
// 1. Register new user confirmation
//    @: client
//
exports.registerConfirmationHtml = (userName) => {
  return template(`<h1>Sweet to meet you ${userName} :)</h1>
        <p>Thank you for creating user account.</p>
        <p>Your user profile is accessible after logging in at tophoneys.com or via below link:</p>
        <p><a href="${process.env.HOME_DOMAIN}/profile">My Profile</a></p>
        <p>In your profile you may edit your user data as well as find your order number and check shipping status.</p>
        <p>Your account is 100% free and voluntary.</p>
        <p>You may contact us at <a href="mailto:info@tophoneys.com">info@tophoneys.com</a></p>
        <p>Happy shopping!</p>
        `)
}
exports.registerConfirmationTxT = (userName) => {
  return `Sweet to meet you ${userName} :)
  \nThank you for creating user account at tophoneys.com
  \nYour user profile is accessible after logging in at tophoneys.com 
  \nIn your profile you may edit your user data as well as find your orders history: whenever you need to find order number or check shipping status
  \nYou may contact us at info@tophoneys.com
  \nYour account is 100% free and voluntary
  `
}

//    ***************************************************************************
//
// 2. Place order confirmation
//    @: client
//
exports.orderConfirmationHtml = (orderId) => {
  return template(`<h1>You have just placed the order.</h1>
  <p>Order details and status: <a href="${process.env.HOME_DOMAIN}/order/${orderId}">link to my order</a></p>
    <p>Order ID: ${orderId}</p>
    <p>You may pay your order within 2 calendar days.</p>
    <p>Thank you for shopping at TOP HONEYS :).</p>
    `)
}
exports.orderConfirmationTxt = (orderId) => {
  return `Thank you for creating an order.\n\n
        Order ID:  ${orderId}\n\nOrder details and status: "${process.env.HOME_DOMAIN}/order/${orderId}"`
}

//    ***************************************************************************
//
// 3. Purchase confirmation
//    @: client
exports.purchaseConfirmationHtml = (clientName, orderId) => {
  return template(`<h1>${clientName}, thank you for your purchase.</h1>
  <p>You can find yor purchase details and shipping status here: <a href="${process.env.HOME_DOMAIN}/order/${orderId}">link to my order</a></p>
  <p>We usually ship orders within 24 hours from payment. In some cases it may take up to 4 working days.</p>
  <p>If you have questions regarding your purchase contact us at <a href="mailto:info@tophoneys.com" sty;e="color:inherit">info@tophoneys.com</a></p>
  <p>Make sure to mention your order number: ${orderId}</p>
  <p>We hope to see you back soon :).</p>`)
}

exports.purchaseConfirmationTxt = (clientName, orderId) => {
  return `${clientName}, thank you for your purchase at TOP HONEYS.\n\n
        We usually ship orders within 24 hours from the moment the payment is credited. Sometimes it may take up to 2-4 days.
        \n\nYour purchase details and shipping status: "${process.env.HOME_DOMAIN}/order/${orderId}"\n\nWe hope to see you back soon :).`
}

//    ***************************************************************************
//
// 4. Purchase notification
//    @: vendor
exports.purchaseNotificationHtml = (orderId) => {
  return template(`<p>New purchase in your shop!</p>
        <p>Purchase details: <a href="${process.env.HOME_DOMAIN}/order/${orderId}">link to order</a></p>
        <p>Well done! :)</p>`)
}
exports.purchaseNotificationTxT = (orderId) => {
  return `New purchase in your shop!\n\nPurchase details: '${process.env.HOME_DOMAIN}/order/${orderId}' \n\nWell done! :)`
}

//    ***************************************************************************
//
// 5. New email from contact form notification
//    @: vendor
exports.newEmailNotificationHtml = (senderEmail, senderName) => {
  return template(`
      <p>New message from contact form:</p>
      <p>From: ${senderName}</p>
      <p>Email: ${senderEmail}</p>
      <p>Read the full message: <a href="poczta.mydevil.net">open email client</a></p>
      `)
}
exports.newEmailNotificationTxt = (senderEmail, senderName) => {
  return `New message from contact form: ${senderName}\n email: ${senderEmail}. \n\nRead the full message: poczta.mydevil.net`
}

//    ***************************************************************************
//
// 6. Success sending email from contact form notification
//    @: client
exports.sendEmailConfirmationHtml = (senderName) => {
  return template(`
  <p>${senderName}, thank you for sending us a message.</p>
  <p>We will answer as soon as possible.</p>
  
  `)
}
exports.sendEmailConfirmationTxt = (senderName) => {
  return `Hi, ${senderName}\n Thank you for sending us a message. We will answer as soon as possible.`
}
