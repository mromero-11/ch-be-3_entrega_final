import request from 'supertest';
import mongoose from 'mongoose';
import { describe, it, before, after, beforeEach } from 'mocha';
import { expect } from 'chai';
import { MongoMemoryServer } from 'mongodb-memory-server';

import app from '../app.js';
import User from '../dao/models/User.js';
import Pet from '../dao/models/Pet.js';
import Adoption from '../dao/models/Adoption.js';

describe('Adoption Router Functional Tests', function() {
  let mongoServer;

  before(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri(), {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  after(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    await User.deleteMany({});
    await Pet.deleteMany({});
    await Adoption.deleteMany({});
  });

  describe('GET /api/adoptions', () => {
    it('should return empty array when no adoptions exist', async () => {
      const res = await request(app).get('/api/adoptions');
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('status', 'success');
      expect(res.body.payload).to.be.an('array').that.is.empty;
    });

    it('should return all adoptions', async () => {
      const user     = await User.create({ first_name:'T', last_name:'U', email:'a@b.c', password:'h', role:'user', pets:[] });
      const pet      = await Pet.create({ name:'Fido', specie:'dog', age:3, adopted:true, owner:user._id });
      const adoption = await Adoption.create({ owner:user._id, pet:pet._id });

      const res = await request(app).get('/api/adoptions');
      expect(res.status).to.equal(200);
      expect(res.body.payload).to.have.lengthOf(1);
      expect(res.body.payload[0]._id).to.equal(adoption._id.toString());
    });
  });

  describe('GET /api/adoptions/:aid', () => {
    it('404 for non-existent adoption', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res    = await request(app).get(`/api/adoptions/${fakeId}`);
      expect(res.status).to.equal(404);
      expect(res.body).to.have.property('error', 'Adoption not found');
    });

    it('return adoption if exists', async () => {
      const user     = await User.create({ first_name:'T', last_name:'U', email:'a@b.c', password:'h', role:'user', pets:[] });
      const pet      = await Pet.create({ name:'Fido', specie:'dog', age:3, adopted:true, owner:user._id });
      const adoption = await Adoption.create({ owner:user._id, pet:pet._id });

      const res = await request(app).get(`/api/adoptions/${adoption._id}`);
      expect(res.status).to.equal(200);
      expect(res.body.payload._id).to.equal(adoption._id.toString());
    });
  });

  describe('POST /api/adoptions/:uid/:pid', () => {
    it('404 if user does not exist', async () => {
      const fakeUser = new mongoose.Types.ObjectId();
      const fakePet  = new mongoose.Types.ObjectId();
      const res      = await request(app).post(`/api/adoptions/${fakeUser}/${fakePet}`);
      expect(res.status).to.equal(404);
      expect(res.body.error).to.equal('user Not found');
    });

    it('404 if pet does not exist', async () => {
      const user    = await User.create({ first_name:'T', last_name:'U', email:'a@b.c', password:'h', role:'user', pets:[] });
      const fakePet = new mongoose.Types.ObjectId();
      const res     = await request(app).post(`/api/adoptions/${user._id}/${fakePet}`);
      expect(res.status).to.equal(404);
      expect(res.body.error).to.equal('Pet not found');
    });

    it('400 if pet already adopted', async () => {
      const user = await User.create({ first_name:'T', last_name:'U', email:'a@b.c', password:'h', role:'user', pets:[] });
      const pet  = await Pet.create({ name:'Fido', specie:'dog', age:3, adopted:true, owner:user._id });
      const res  = await request(app).post(`/api/adoptions/${user._id}/${pet._id}`);
      expect(res.status).to.equal(400);
      expect(res.body.error).to.equal('Pet is already adopted');
    });

    it('200 creates adoption successfully', async () => {
      const user = await User.create({ first_name:'T', last_name:'U', email:'a@b.c', password:'h', role:'user', pets:[] });
      const pet  = await Pet.create({ name:'Fido', specie:'dog', age:3, adopted:false, owner:null });

      const res = await request(app).post(`/api/adoptions/${user._id}/${pet._id}`);
      expect(res.status).to.equal(200);
      expect(res.body).to.include({ status: 'success', message: 'Pet adopted' });

      const updatedPet     = await Pet.findById(pet._id);
      const updatedUser    = await User.findById(user._id);
      const adoptionRecord = await Adoption.findOne({ owner: user._id, pet: pet._id });

      expect(updatedPet.adopted).to.be.true;
      expect(updatedPet.owner.toString()).to.equal(user._id.toString());

      const petIds = updatedUser.pets.map(pet => pet._id.toString());
      expect(petIds).to.include(pet._id.toString());

      expect(adoptionRecord).to.not.be.null;
    });
  });
});
