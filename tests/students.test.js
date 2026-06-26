const request = require("supertest");

jest.setTimeout(20000);

const baseURL = "https://student-api-mission2.onrender.com";

describe("Student API Tests", () => {

  test("GET /students should return 200", async () => {
    const res = await request(baseURL).get("/students");
    expect(res.statusCode).toBe(200);
  }, 15000);

});