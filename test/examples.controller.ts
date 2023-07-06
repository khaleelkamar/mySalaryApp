import { expect } from 'chai';
import { describe, it } from 'mocha';
import request from 'supertest';
import app from '../server'; // Assuming your Express app is exported as `app`
import db from '../server/model';

let accessToken: string; // Access token for authenticated requests
let salaryId: number; // ID of an existing salary record

const { user: User, salary: Salary } = db;
describe('Login API', () => {
  it('should return a token and user data on successful login', async () => {
    const response = await request(app)
      .post('/api/v1/login')
      .send({ userName: 'testUser0', password: 'password' });

    expect(response.status).to.equal(200);
    expect(response.body).to.have.property('token');
    expect(response.body).to.have.property('data');

    // Set the access token for authenticated requests
    accessToken = response.body.token;
  });

  it('should return 404 if user is not found', async () => {
    const response = await request(app)
      .post('/api/v1/login')
      .send({ userName: 'nonexistentuser', password: 'examplepassword' });

    expect(response.status).to.equal(404);
    expect(response.body).to.have.property('message', 'User not found');
  });

  it('should return 401 if password is invalid', async () => {
    const response = await request(app)
      .post('/api/v1/login')
      .send({ userName: 'testUser0', password: 'invalidpassword' });

    expect(response.status).to.equal(401);
    expect(response.body).to.have.property('message', 'Invalid password');
  });

  it('should return 400 if request body is invalid', async () => {
    const response = await request(app).post('/api/v1/login').send({});

    expect(response.status).to.equal(400);
    expect(response.body).to.have.property('errors');
  });
});

describe('Create Salary API', () => {
  before(async () => {
    // Perform login to obtain access token
    const response = await request(app)
      .post('/api/v1/login')
      .send({ userName: 'testUser0', password: 'password' });

    accessToken = response.body.token;
  });

  it('should create a new salary record and return success message', async () => {
    const newSalary = {
      name: 'John Doe',
      salary: 5000,
      currency: 'USD',
      department: 'IT',
      sub_department: 'Development',
      on_contract: true,
    };

    const response = await request(app)
      .post('/api/v1/createSalary')
      .set({ accesstoken: `${accessToken}` })
      .send(newSalary);

    expect(response.status).to.equal(201);
    expect(response.body).to.have.property(
      'message',
      'Record created successfully'
    );
    expect(response.body).to.have.property('data');
    // Add more assertions as needed
  });

  it('should return 400 if request body is invalid', async () => {
    const response = await request(app)
      .post('/api/v1/createSalary')
      .set({ accesstoken: `${accessToken}` })
      .send({});

    expect(response.status).to.equal(400);
    expect(response.body).to.have.property('errors');
    // Add more assertions as needed
  });

  it('should return 500 on internal server error', async () => {
    // Mock the Salary.create method to throw an error
    const originalCreate = Salary.create;
    Salary.create = () => {
      throw new Error('Mocked error');
    };

    const newSalary = {
      name: 'John Doe',
      salary: 5000,
      currency: 'USD',
      department: 'IT',
      sub_department: 'Development',
      on_contract: true,
    };

    const response = await request(app)
      .post('/api/v1/createSalary')
      .set({ accesstoken: `${accessToken}` })
      .send(newSalary);

    expect(response.status).to.equal(500);
    expect(response.body).to.have.property('errors');
    expect(response.body.errors[0]).to.have.property(
      'msg',
      'Internal server error'
    );

    // Restore the original method
    Salary.create = originalCreate;
  });
});

describe('Delete Salary API', () => {
  before(async () => {
    // Perform login to obtain access token
    const response = await request(app)
      .post('/api/v1/login')
      .send({ userName: 'testUser0', password: 'password' });

    accessToken = response.body.token;
    // Retrieve an existing salary record ID from the database
    const salaryRecord = await Salary.findOne(); // Adjust the query as per your requirements
    if (salaryRecord) {
      salaryId = salaryRecord.id;
    }
  });

  it('should delete a salary record and return success message', async () => {
    const response = await request(app)
      .get(`/api/v1/deleteSalary/${salaryId}`)
      .set({ accesstoken: `${accessToken}` });

    expect(response.status).to.equal(200);
    expect(response.body).to.have.property(
      'message',
      'Record deleted successfully'
    );
  });

  it('should return 404 if the salary record does not exist', async () => {
    // Assuming you have a non-existent salary record with an ID of 100 in your database
    const nonExistentSalaryId = 100;

    const response = await request(app)
      .get(`/api/v1/deleteSalary/${nonExistentSalaryId}`)
      .set({ accesstoken: `${accessToken}` });

    expect(response.status).to.equal(404);
    expect(response.body).to.have.property('errors');
    expect(response.body.errors[0]).to.have.property('msg', 'Record not found');
  });
});

describe('Get Salary Stats by Department API', () => {
  it('should retrieve salary statistics by department', async () => {
    const response = await request(app)
      .get('/api/v1/getSalaryStatsByDepartment')
      .set({ accesstoken: `${accessToken}` });

    expect(response.status).to.equal(200);
    expect(response.body).to.have.property('data');
    expect(response.body.data).to.be.an('array');
    // Add more assertions as needed
  });


  it('should return 500 on internal server error', async () => {
    // Mock the Salary.findAll method to throw an error
    const originalFindAll = Salary.findAll;
    Salary.findAll = () => {
      throw new Error('Mocked error');
    };

    const response = await request(app)
      .get('/api/v1/getSalaryStatsByDepartment')
      .set({ accesstoken: `${accessToken}` });

    expect(response.status).to.equal(500);
    expect(response.body).to.have.property('message', 'Internal server error');

    // Restore the original method
    Salary.findAll = originalFindAll;
  });
});
