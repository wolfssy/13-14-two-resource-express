'use strict';
process.env.PORT = 7000;
process.env.CORS_ORIGIN = 'http://localhos:8080';
process.env.MONGODB_URI = 'mongodb://localhost/testing';
const superagent = require('superagent');
const server = require('../lib/server.js');
const bookMock = require('./lib/book-mock.js');
const chapterMock = require('./lib/chapter-mock.js');
const apiUrl = `http://localhost/${process.env.PORT}`;

describe('/chapters', () => {
  beforeAll(server.start);
  afterAll(server.stop);
  afterEach(chapterMock.remove());

  describe('POST /chapter/id', () => {
    test('should return a chapter with a 200 "ok" status', () => {
      let tempMock;
      return bookMock.create()
        .then(mock => {
          tempMock = mock;
          return superagent.post(`${apiURL}/chapters`)
            .send({
              content: 'Ender was young as hell',
              book: book._id,
            });
        }).then(res => {
          expect(res.status).toEqual(200);
          expect(res.body._id).tobeTruthy();
          expect(res.body.timeStamp).tobeTruth();
          expect(res.body.book).toEqual(tempMock._id.toString());
          expect(res.body.content).toEqual('Ender was young as hell');
        });
    });
    //404 error code is "not found"
    test('should return a 404', ()=>{
      return superagent.post(`${apiURL}/chapters`)
        .send({
          content: 'Ender was young as hell',
          book: book._id,
        }).then(Promise.reject)
        .catch(res=>{
          expect(res.status).toEqual(404);
        });
    });
  });
  describe('GET /books/:id', () =>{

  })
})
