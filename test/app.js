const request = require('supertest');
const app = require('../app.js');

describe('GET /', () => {
  it('should return 200 OK', (done) => {
    request(app)
      .get('/')
      .expect(200, done);
  });
});

describe('GET /login', () => {
  it('should return 200 OK', (done) => {
    request(app)
      .get('/login')
      .expect(200, done);
  });
});

describe('GET /signup', () => {
  it('should return 200 OK', (done) => {
    request(app)
      .get('/signup')
      .expect(200, done);
  });
});

describe('GET /contact', () => {
  it('should return 200 OK', (done) => {
    request(app)
      .get('/contact')
      .expect(200, done);
  });
});

describe('GET /non-existing-url', () => {
  it('should return 404', (done) => {
    request(app)
      .get('/non-existing-url')
      .expect(404, done);
  });
});




describe('GET /api/query/australia', () => {
  it('should return 200 OK', (done) => {
    request(app)
      .get('/api/query/australia')
      .expect(200, done);
  });
});

describe('GET /api/random', () => {
  it('should return 200 OK', (done) => {
    request(app)
      .get('/api/random')
      .expect(200, done);
  });
});

describe('GET /api/outgoing/deloraine', () => {
  it('should return 200 OK', (done) => {
    request(app)
      .get('/api/outgoing/deloraine')
      .expect(200, done);
  }).timeout(5000);
});

describe('GET /api/incoming/australia', () => {
  it('should return 200 OK', (done) => {
    request(app)
      .get('/api/incoming/australia')
      .expect(200, done);
  });
});

describe('GET /api/image/australia', () => {
  it('should return 200 OK', (done) => {
    request(app)
      .get('/api/image/australia')
      .expect(200, done);
  });
});

describe('GET /api/contains/australia/tasmania', () => {
  it('should return 200 OK', (done) => {
    request(app)
      .get('/api/contains/australia/tasmania')
      .expect(200, done);
  });
});
