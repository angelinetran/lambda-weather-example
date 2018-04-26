import YQL from 'yql';

export const hello = (event, context, callback) => {

  //https://api.login.yahoo.com/oauth2/request_auth?client_id=${process.env.YAHOO_API_KEY}&redirect_uri=oob&response_type=code&language=en-us

  const query = new YQL('select * from weather.forecast where (location = 46278)');

  query.exec((err, data) => {
    console.log(data.query.results.channel, 'data')
    const location = data.query.results.channel.location;
    const condition = data.query.results.channel.item.condition;

    console.log('The current weather in ' + location.city + ', ' + location.region + ' is ' + condition.temp + ' degrees.');

    const response = {
      statusCode: 200,
      body: JSON.stringify({
        message: 'The current weather in ' + location.city + ', ' + location.region + ' is ' + condition.temp + ' degrees.',
      }),
    };

    callback(null, response);
  });
};