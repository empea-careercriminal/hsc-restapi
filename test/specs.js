/**
 * test for our super fabric REST API
 */
/*
1. It starts by importing the supertest library.
2. It then starts the server by running the command:
```
node app.js
```
3. It then starts the tests by running the command:
```
npm test
```
4. It then checks if the api is running by sending a request to the root url.
5. It then sends a request to the /setData endpoint to send a value from a to b.
6. It then queries the /getData/B endpoint to get the value of the key B.
*/
const supertest = require('supertest');
const api = supertest('localhost:3000');

describe("Hyperledger Fabric API tests", function() {
  it("checks if api is running", async function() {
    //this.skip();
    let result = await api.get('/')
    console.log(result.body)
  }) 
  
  it("send a value from a to b", async function() {
    //this.skip();
    let payload = {
      p1: 'b',
      p2: 'a',
      value: '10'
    };
    let result = await api.post('/setData').send(payload)
    console.log(result.body)
  })

  it("query a key", async function() {
    //this.skip();
    let key = 'B';
    let result = await api.get('/getData/'+key)
    console.log(result.body)
  })

})