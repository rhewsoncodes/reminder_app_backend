request = require("supertest");
const User = require("../model/User");
const Task = require("../model/Task");
baseURL = "localhost:3500/user";

const Cleanup = async () => {
  const bbb = await User.findOneAndDelete({
    email: "thebestrequest@gmail.com",
  }); //im so sorry
};

Cleanup();

//Test to make sure conflicts are not allowed for username
request(baseURL)
  .post("/")
  .send({
    firstName: "Robert",
    lastName: "Hewson",
    username: "testuser123",
    email: "testema214214il@gmail.com",
    confirmEmail: "testema214214il@gmail.com",
    pwd: "test123",
    confirmPwd: "test123",
  })
  .set("Accept", "application/json")
  .expect(409)
  .end((err, res) => {
    if (err) throw err;
    console.log(res.body);
  });

//Test to make sure conflicts are not allowed for email
request(baseURL)
  .post("/")
  .send({
    firstName: "Robert",
    lastName: "Hewson",
    username: "testus44443",
    email: "testemail@gmail.com",
    confirmEmail: "testemail@gmail.com",
    pwd: "test123",
    confirmPwd: "test123",
  })
  .set("Accept", "application/json")
  .expect(409)
  .end((err, res) => {
    if (err) throw err;
    console.log(res.body);
  });

//Test for bad request when password and confirm password dont match
request(baseURL)
  .post("/")
  .send({
    firstName: "Robert",
    lastName: "Hewson",
    username: "testus44443",
    email: "testemail@gmail.com",
    confirmEmail: "testemail@gmail.com",
    pwd: "test1234",
    confirmPwd: "test123",
  })
  .set("Accept", "application/json")
  .expect("Content-Type", /json/)
  .expect(400)
  .end((err, res) => {
    if (err) throw err;
    console.log(res.body);
  });

//Test to confirm bad request when email and confirm email dont match
request(baseURL)
  .post("/")
  .send({
    firstName: "Robert",
    lastName: "Hewson",
    username: "testus44443",
    email: "testemail@gmail.com",
    confirmEmail: "testemail2@gmail.com",
    pwd: "test1234",
    confirmPwd: "test123",
  })
  .set("Accept", "application/json")
  .expect("Content-Type", /json/)
  .expect(400)
  .end((err, res) => {
    if (err) throw err;
    console.log(res.body);
  });

//Make sure is 201 when everything is fine and dandy
request(baseURL)
  .post("/")
  .send({
    firstName: "Proud",
    lastName: "Request",
    username: "goodRequest",
    email: "thebestrequest@gmail.com",
    confirmEmail: "thebestrequest@gmail.com",
    pwd: "whosagoodrequest",
    confirmPwd: "whosagoodrequest",
  })
  .set("Accept", "application/json")
  .expect(201)
  .end((err, res) => {
    if (err) throw err;
    console.log(res.body);
  });
