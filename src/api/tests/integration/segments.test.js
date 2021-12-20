const request = require('supertest');
const assert = require('assert');
const httpStatus = require('http-status');
const app = require('../../../index');
const Segment = require('../../plant/models/segment.model');

const MOCK_SEGMENTS_CREATION = {
  name: "Description name",
  description: "Some description",
}


describe('admin/segments', async () => {
  
  it("should create a segment", async () => {

     await post('/segments', MOCK_SEGMENTS_CREATION).expect(httpStatus.CREATED);
    const {name} = res.body
    expect(name).to.be.equal("Description name");
    // return request(app)
    //   .post('/segments')
    //   .send(MOCK_SEGMENTS_CREATION)
    //   .expect(httpStatus.CREATED)
    //  .then((res) => {
    //    const {name} = res.body
    //       expect(name).to.be.equal("Description name");
    //     });
  })
  //   it("should return all segments", () => {
  //   return request(app)
  //   .get('/segments')
  //   .send({ 
  //     name: "Description name",
  //     description: "Some description",
  //   })
  //   .expect(httpStatus.OK)
  // })
})