/// <reference types="cypress" />

import { findRunnerByEmail, findNextPublicRace, registerRun, createOrUpdateRunner } from '$lib/strapi';

describe('Strapi API', () => {
  describe('findRunnerByEmail', () => {
    const email = 'testuser@email.com';
    const user = { email , firstName: 'Test', lastName: 'User' };
    const data = [{ id: 1, attributes: user }];
    
    beforeEach(() => {
      cy.intercept({
        method: 'GET', 
        url: '/api/runners*',
      }, { data }).as('findRunner')
    });
    
    it('should find a runner by its email', () => {
      cy.wrap(findRunnerByEmail('testuser@email.com')).then((subject) => {
        expect(Array.isArray(subject)).to.be.true;
        expect(subject).to.deep.equal([{ id: 1, ...user }]);
      });
    });
  });
  
  describe('findNextPublicRace', () => {
    const today = new Date();
    const parcours = { id: 1, name: 'Parcours', distance: 5, laps: 2 }
    const race = { 
      startDate: today.toISOString(), startTime: '10:00', parcours: 
      { data: { attributes: parcours }}
    };
    const data = [{ id: 1, attributes: race }];

    beforeEach(() => {
      cy.intercept({
        method: 'GET',
        url: '/api/races*',
      }, { data }).as('findRace');
    });

    it('should find the next public race', () => {
      cy.wrap(findNextPublicRace()).then(subject => {
        expect(subject).to.deep.equal({ id: 1, ...race, parcours });
      });
    });
  });

  describe('registerRun', () => {
    const run = {
      runner: { id: 1 } as App.Runner,
      race: 1,
      copyright: true,
      walking: false,
    };
    const data = { id: 1, attributes: { ...run, runner: 1 }};

    beforeEach(() => {
      cy.intercept('POST', '/api/runs', { data }).as('createRun');
    });
    it('should register a new run to a given race', () => {
      cy.wrap(registerRun(run)).then(subject => {
        expect(subject).to.deep.equal(data);
      });
      cy.wait('@createRun')
        .its('request.body').should('deep.equal', { data: { ...run, runner: 1 } });
    });
  });

  describe('createOrUpdateRunner', () => {
    const runner = {
      minor: false,
      child: false,
      firstName: 'Test',
      lastName: 'User',
      email: 'testuser@email.com',
    };
    const data = { id: 1, attributes: runner };

    beforeEach(() => {
      cy .intercept({
        method: 'POST',
        url: '/api/runners*'
      }, { data }).as('createRunner');
    });

    it('should create a new runner', async () => {
      cy.wrap(createOrUpdateRunner({ runner })).then(subject => {
        expect(subject).to.deep.equal({ id: 1, ...runner });
      });
      cy.wait('@createRunner').its('request.body').should('include', JSON.stringify(runner));
    });
  });
});
