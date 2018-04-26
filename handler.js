import axios from "axios";
import * as AWS from "aws-sdk";

const ses = new AWS.SES();

export const weather = async (event, context, callback) => {

  const weather = await getWeather();
  const message = `It is ${weather.description} and ${weather.temp} degrees in ${weather.city}`;

  const emailMessage = {
    subject: 'Weather Forcast',
    text: message
  }

  await email(emailMessage);

  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: message
    }),
  };

  callback(null, response);
};

async function getWeather() {
  const url = `https://api.openweathermap.org/data/2.5/weather?APPID=${process.env.OPEN_WEATHER_MAP_API_KEY}&zip=46278,us`;

  const results = await axios(url);
  const weather = results.data;

  const temp = weather.main.temp;
  const conversion = (1.8 * (temp - 273) + 32).toFixed(0);

  return {
    temp: conversion,
    description: weather.weather[0].description,
    city: weather.name
  }
}

async function email(data) {
  return new Promise( (resolve, reject) => {
    const params = {
      Destination: {
        ToAddresses: [ "atran@trendyminds.com"],
      },
      Message: {
        Subject: {
          Data: data.subject,
          Charset: 'UTF-8'
        },
        Body: {
          Text: {
            Data: data.text,
            Charset: "UTF-8"
          }
        }
      },
      Source: "atran@trendyminds.com"
    };

    ses.sendEmail(params, (err) => {
      if (err) {
        console.log("Email Error:", err);
        reject(err);
      }
      resolve({
        statusCode: 200,
        headers: { "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify({ status: "success" })
      });
    });
  });
}