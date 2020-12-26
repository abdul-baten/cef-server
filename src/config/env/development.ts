import path from 'path';

const devConfig = {
  app: {
    title: 'cefalo e-commerce server',
    baseUrl: '/api'
  },
  port: process.env.PORT || 6064,
  database: {
    url: 'mongodb+srv://cefalo:cefalo@cefalo.vc94c.mongodb.net/ecommerce?retryWrites=true&w=majority'
  },
  session: {
    secret: 'Z6?x4Td8D&W8j5zAMQv2uxFZ$V$#_RWU',
    tokenEncryptionKey: '4@&ZfX?xWf$shcSV?&', // length must be 16
    tokenLife: 10, // in minute
    issuer: 'cefalo',
    subject: 'cefalo@users',
    audience: 'http://localhost/',
    algorithm: 'RS256', // RSASSA [ "RS256", "RS384", "RS512" ]
    rsaPrivateKey: path.join(__dirname, '../keys/private.key'),
    rsaPublicKey: path.join(__dirname, '../keys/public.key')
  }
};

module.exports = devConfig;
