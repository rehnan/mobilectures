module.exports.adapters = {
	'default': 'MongodbProd',

      MongodbProd: {
        adapter: 'sails-mongo',
        schema: true,
        url: process.env.DB_URL
      }
};