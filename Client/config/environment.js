let config = require('./netbio-config.json');

const PROD_API_URL = config.api_urls.production_api_url
const LOCAL_SERVER_URL = config.api_urls.local_server_api
const USE_LOCAL_DEV_SERVER = config.development.run_on_local_server

const DEV_API_URL = USE_LOCAL_DEV_SERVER ? LOCAL_SERVER_URL : PROD_API_URL;
export const BASE_API_URL = process.env.NODE_ENV === 'production' ? PROD_API_URL : DEV_API_URL;
