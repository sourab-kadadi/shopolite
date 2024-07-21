export default () => ({
    port: parseInt(process.env.PORT, 10) || 2000,
    nodeEnv: process.env.NODE_ENV,
    database: {
      host: process.env.DATABASE_HOST,
      port: parseInt(process.env.DATABASE_PORT, 10) || 5432
    },
    s3Credential: {
      accessKey: process.env.S3_ACCESS_KEY,
      secrateKey: process.env.S3_SECRATE_KEY,
      region: process.env.S3_REGION,
      bucketName: process.env.S3_BUCKET_NAME,
    },
    redisCredential: {
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT
    },
    expiryToken: {
      access_token_exp:  parseInt(process.env.ACCESS_TOKEN_EXPIRY),
      refresh_token_exp:  parseInt(process.env.REFRESH_TOKEN_EXPIRY),
    },
    jwtSecrate: {
      access_token_secrate: process.env.ACCESS_TOKEN_SECRATE,
      refresh_token_secrate: process.env.REFRESH_TOKEN_SECRATE
    },
    firebaseNotification: {
      firebase_fcm_url: process.env.FIREBASE_FCM_URL,
      firebase_fcm_server_key: process.env.FIREBASE_FCM_SERVER_KEY
    },
    sms: {
      sms_url: process.env.SMS_URL,
      sms_api_key: process.env.SMS_APIKEY,
      sms_sender: process.env.SMS_SENDER
    },
    googleMap: {
      apiKey: process.env.GOOGLE_MAP_API_KEY,
      map_url: process.env.GOOGLE_MAP_URL
    }
  });