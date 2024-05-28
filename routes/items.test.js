process.env.NODE_ENV = "test";

const request = require("supertest");
const app = require("../app");
let items = require("../fakeDb");


let chips = {name: 'chips', price: 1.99};

beforeEach(() => {
    items.push(chips);
});

afterEach(() => {
    items.length = 0;
});

describe('GET /items', () => {
    test('Gets all shopping list items', async () => {
        const resp = await request(app).get('/items');
        expect(resp.statusCode).toBe(200);
        expect(resp.body).toEqual([chips]);
        expect(resp.body).toContainEqual(chips);
    });
})

describe('POST /items', () => {
    test('Creates a list item', async () => {
        const dip = {name: 'dip', price: 3.50};
        const resp = await request(app).post('/items').send(dip);
        expect(resp.statusCode).toBe(201);
        expect(resp.body).toEqual({added: dip});
    });
    test('Responds with 400 if name/price is missing', async () =>{
        const resp1 = await request(app).post('/items').send({});
        expect(resp1.statusCode).toBe(400);

        const resp2 = await request(app).post('/items').send({price: 1.50});
        expect(resp2.statusCode).toBe(400);

        const resp3 = await request(app).post('/items').send({name: 'free item'});
        expect(resp3.statusCode).toBe(400);
    });
})

describe('GET /items/:name', () => {
    test('Get item by name', async () => {
        const resp = await request(app).get(`/items/${chips.name}`);
        expect(resp.statusCode).toBe(200);
        expect(resp.body).toEqual(chips);
    });
    test('Responds witht 404 for invalid item', async() => {
        const resp = await request(app).get(`/items/dip`);
        expect(resp.statusCode).toBe(404);
        expect(resp.body).toEqual({error: 'Item not found'});
    })
})

describe('PATCH /items/:name', () => {
    test('Update item name', async () => {
        const resp = await request(app).patch(`/items/${chips.name}`).send({name: 'cheesepuffs', price: 1.99});
        expect(resp.statusCode).toBe(200);
        expect(resp.body).toEqual({updated: {name: 'cheesepuffs', price: 1.99}});
    });
    test('Update item price', async () => {
        const resp = await request(app).patch(`/items/${chips.name}`).send({name: 'chips', price: 4.50});
        expect(resp.statusCode).toBe(200);
        expect(resp.body).toEqual({updated: {name: 'chips', price: 4.50}});
    });
    test('Responds witht 404 for invalid item', async() => {
        const resp = await request(app).patch(`/items/dip`).send({name: 'cheesepuffs'});
        expect(resp.statusCode).toBe(404);
        expect(resp.body).toEqual({error: 'Item not found'});
    })
})

describe("/DELETE /items/:name", () => {
    test("Deleting an item", async () => {
      const resp = await request(app).delete(`/items/${chips.name}`);
      expect(resp.statusCode).toBe(200);
      expect(resp.body).toEqual({ message: 'Deleted' })
    })
    test("Responds with 404 for deleting invalid item", async () => {
      const res = await request(app).delete(`/items/cheesepuffs`);
      expect(res.statusCode).toBe(404);
    })
  })