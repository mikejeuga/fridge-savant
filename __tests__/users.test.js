const generatePasswordHash = require('../auth/generatePasswordHash')
const bcrypt = require('bcryptjs')
const request = require('supertest')
const app = require('../server')


describe('generatePasswordHash', ()=> {
  it('should return a hashed password', async() => {
    let password = "123456"
    let encryptedPassword = await generatePasswordHash(password)
    expect(await bcrypt.compare(password, encryptedPassword)).toBe(true)
  })
});


describe('Signing up a user', ()=>{
  it('should send a json file with user informations to the db', async () =>{
    await request(app).post('/api/users').send({
      "name": "test-name",
      "email": "test@name.com",
      "password": "123456"
  })
  .expect(200)
  })


  it('should send a bad request error when name is not provided', async ()=> {
    await request(app).post('/api/users').send({
      "email": "test@name.com",
      "password": "123456"
  })
  .expect(400)
  })

  it('should send a bad request error when email is not provided', async ()=> {
    await request(app).post('/api/users').send({
      "name": "test-name",
      "password": "123456"
  })
  .expect(400)
  })

  it('should send a bad request error when password is not provided', async ()=> {
    await request(app).post('/api/users').send({
      "name": "test-name",
      "email": "test@name.com"
  })
  .expect(400)
  })

  it('should send a 500 bad request error if User already exist', async () => {
    await request(app).post('/api/users').send({
      "name": "test2-name",
      "email": "test2@name.com",
      "password": "123456"
  })

  await request(app).post('/api/users').send({
    "name": "test3-name",
    "email": "test2@name.com",
    "password": "654321"
}).expect(500)
  })
})



describe("Getting the user information (Login ?)", ()=>{
  it('should send the user information back', async ()=> {
    await request(app).get('/api/users').send({
      "email": "test2@name.com",
      "password": "123456"
  })
  .expect(200)
})

it('should send an error if no email provided', async ()=> {
  await request(app).get('/api/users').send({
    "password": "123456"
})
.expect(400)
})

it('should send an error if no password provided', async ()=> {
  await request(app).get('/api/users').send({
    "email": "test2@name.com"
})
.expect(400)
})

  it('should send a 500 error the user password is incorrect', async ()=> {
    await request(app).get('/api/users').send({
      "email": "test2@name.com",
      "password": "145006"
  })
  .expect(500)
  })

  it('should send a 500 error if the user email is incorrect', async ()=> {
    await request(app).get('/api/users').send({
      "email": "tes@name.com",
      "password": "123456"
  })
  .expect(500)
  })

})
