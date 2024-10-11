const request = require('supertest');
const {Sequelize} = require('sequelize');
//const sequelize = new Sequelize('sqlite::memory:', {
  //  logging: false,
//});
const {app, server, sequelize } = require('../index');


describe('Test the users endpoints', () => {

  //  beforeAll(async () => {
  //      await sequelize.sync({ force: true }); // Reset the database before tests
  //  });

    test('It should create a new user', async () => {
      const newUser = { name: "John Doe", isManager: false, site: "Test Site" };  
      const response = await request(app).post('/api/users').send(newUser);
      expect(response.body).toMatchObject(newUser);
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
   expect(response.body).toEqual({id:'1'});
   expect(response.statusCode).toBe(200);
 });


   afterAll(async () => {
    await sequelize.close(); // Close the database connection after tests
    server.close() // Closing the connection allows Jest to exit successfully.
});

  });


  