const moment = require('moment');
const crypto = require("crypto");
const qs = require('qs');
require('dotenv').config();

function createPaymentLink(req, res, next) {
    // Set timezone
    process.env.TZ = 'Asia/Ho_Chi_Minh';

    // Get reservation details (e.g. amount, bankCode, description from frontend)
    const amount = req.body.amount; // Full or partial payment amount
    const description = req.body.description || `Thanh toán cho mã GD: ${moment().format('DDHHmmss')}`; // Default description if not provided
    const language = 'vn'; // User's language, default to 'vn'

    // Generate a unique order ID
    const orderId = moment().format('DDHHmmss');
    const ipAddr = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    // Get VNPay configuration from environment variables
    const tmnCode = process.env.VNP_TMN_CODE;
    const secretKey = process.env.VNP_HASH_SECRET;
    const vnpUrl = process.env.VNP_URL;
    const returnUrl = process.env.VNP_RETURN_URL;

    const createDate = moment().format('YYYYMMDDHHmmss'); // Current time for createDate

    // Create the VNPay payment parameters
    let vnp_Params = {
        'vnp_Version': '2.1.0',
        'vnp_Command': 'pay',
        'vnp_TmnCode': tmnCode,
        'vnp_Locale': language,
        'vnp_CurrCode': 'VND',
        'vnp_TxnRef': orderId, // Unique transaction reference
        'vnp_OrderInfo': description, // Dynamic order description
        'vnp_OrderType': 'other',
        'vnp_Amount': amount * 100, // Amount in VND (VNPay expects amount in cents)
        'vnp_ReturnUrl': returnUrl, // The URL the user will be redirected to after payment
        'vnp_IpAddr': ipAddr, // Client's IP address
        'vnp_CreateDate': createDate, // The create date in VNPay format
    };

    // Optionally add bank code if provided by the user
    // if (bankCode) {
    //     vnp_Params['vnp_BankCode'] = bankCode; // If the user selected a bank
    // }

    // Sort the parameters
    vnp_Params = sortObject(vnp_Params);

    // Prepare the signature data for the secure hash
    const signData = qs.stringify(vnp_Params, { encode: false });
    const hmac = crypto.createHmac("sha512", secretKey);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex");

    // Add secure hash to the parameters
    vnp_Params['vnp_SecureHash'] = signed;

    // Construct the payment URL
    const paymentUrl = `${vnpUrl}?${qs.stringify(vnp_Params, { encode: false })}`;

    // Return the payment URL as JSON response
    res.json({ paymentUrl });
}

// Helper function to sort the parameters
function sortObject(obj) {
    let sorted = {};
    let str = [];
    let key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) {
            str.push(encodeURIComponent(key));
        }
    }
    str.sort();
    for (key = 0; key < str.length; key++) {
        sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
    }
    return sorted;
}

module.exports = {
    createPaymentLink
};
