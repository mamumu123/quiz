'use strict';

const axios = require('axios').default;

exports.main = (evt, ctx) => {
  return new Promise((RES, REJ) => {
	try{
		axios.request(evt.options).then(function (response) {
		  RES(response.data)
		})
		.catch(function (error) {
		  REJ(error)
		});
	}catch(e){
		REJ(e)
	}
  });
}