const request = require('supertest');
const {Sequelize} = require('sequelize');
//const sequelize = new Sequelize('sqlite::memory:', {
  //  logging: false,
//});
const {app, server, sequelize } = require('../index');


describe('Test the users endpoints', () => {

  beforeAll(async () => {
  await sequelize.sync({ force: true }); // Reset the database before tests
  });

  test('It should create a new user', async () => {
    const newUser = { name: "John Doe", isManager: false, site: "Test Site" };  
    const response = await request(app).post('/api/users').send(newUser);
    expect(response.body).toMatchObject(newUser);
    expect(response.statusCode).toBe(200);
   });
  
   test('should retrieve a list of all users', async() => {
      const response = await request(app).get('/api/users');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
   });

   test('It should retrieve user with id:1 create in post test', async () => {
    const response = await request(app).get('/api/users/1');
    expect(response.body).toMatchObject({name: 'John Doe'});
    expect(response.statusCode).toBe(200);
   });

   test('It should update a user', async () => {
    const updateUser = { name: "Jane Doe", isManager: false, site: "Test Site" };  
    const response = await request(app).put('/api/users/1').send(updateUser);
    expect(response.body).toMatchObject(updateUser);
    expect(response.statusCode).toBe(200);
 });

  test('It should delete a user', async () => {
   const response = await request(app).delete('/api/users/1');
   expect(response.body).toEqual({data: 'The user with id of 1 is removed.'});
   expect(response.statusCode).toBe(200);

    // Verify that the user is indeed deleted
    const userResponse = await request(app).get('/api/users/1');
    expect(userResponse.statusCode).toBe(200);
    expect(userResponse.body).toBeNull(); // Assuming your API returns null for a non-existent user

 });


   afterAll(async () => {
    await sequelize.close(); // Close the database connection after tests
    server.close() // Closing the connection allows Jest to exit successfully.
});

  });


  