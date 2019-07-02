const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  grant_type: process.env.GRANT_TYPE,
  username: process.env.AUTH_USERNAME,
  password: process.env.PASSWORD,
  client_id: process.env.CLIENT_ID,
  client_secret: process.env.CLIENT_SECRET,
  auth_protocol: process.env.AUTH_PROTOCOL,
  auth_host: process.env.AUTH_HOST,
  auth_port: process.env.AUTH_PORT,
  auth_path: process.env.AUTH_PATH,
  auth_method: process.env.AUTH_METHOD,
  vat_number: process.env.VAT_NUMBER,
  business_place: process.env.BUSINESS_PLACE,
  tax_protocol: process.env.TAX_PROTOCOL,
  tax_host: process.env.TAX_HOST,
  tax_port: process.env.TAX_PORT,
  tax_path: process.env.TAX_PATH,
  tax_method: process.env.TAX_METHOD,
  tax_rate: process.env.TAX_RATE,
  pms_port: parseInt(process.env.PMS_PORT),
  pos_port: parseInt(process.env.POS_PORT)
};