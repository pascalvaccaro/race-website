/// <reference types="cypress" />

import { findNextPublicRace, STRAPI_URL } from '$lib/strapi';

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

describe('Enregistrer un participant', () => {
  let race: App.Race;
  const runner = {
    email: 'testuser@email.com',
    firstName: 'Test',
    lastName: 'User',
  };
  before(async () => {
    race = await findNextPublicRace() as App.Race;
  });
  
  beforeEach(() => {
    cy.intercept('POST', FRONTEND_URL + '*', (req) => req.redirect('/')).as('submitForm');
    cy.visit(FRONTEND_URL);
  });
  
  it('pour sa première course', () => {
    Object.entries(runner).forEach(([key, value]) => cy.get(`input[name="runner.${key}"]`).clear().type(value));
    cy.get('input[name="files.certificates').selectFile('cypress/e2e/assets/certificat_medical.pdf')
      .get('form').submit()
      .wait('@submitForm').should(({ request }) => {
        expect(request.headers).to.include({
          'content-type': 'application/x-www-form-urlencoded'
        });
        expect(request.body).to.equal(`runner.email=testuser%40email.com&runner.firstName=Test&runner.lastName=User&run.runner=&runner.id=&run.copyright=on&files.certificates=certificat_medical.pdf&run.race=${race.id}`);
      });
    });
    
  it('en marchant', () => {
    Object.entries(runner).forEach(([key, value]) => cy.get(`input[name="runner.${key}"]`).clear().type(value));
    cy.get('input[name="run.walking"]').click()
      .get('input[name="files.certificates"]').should('not.exist')
      .get('form').submit()
      .wait('@submitForm').should(({ request }) => {
        expect(request.headers).to.include({
          'content-type': 'application/x-www-form-urlencoded'
        });
        expect(request.body).to.equal(`runner.email=testuser%40email.com&runner.firstName=Test&runner.lastName=User&run.runner=&runner.id=&run.walking=on&run.copyright=on&run.race=${race.id}`);
      });
  });

  describe('pour sa énième course', () => {
    before(() => {
      const data = [{ id: 1, attributes: runner }];
      cy.intercept('GET', STRAPI_URL + '/api/runners*', { data }).as('findRunner');
    });

    it('préremplit le formulaire avec ses informations', () => {
      cy.get('input[name="runner.email"]').clear().type(runner.email).blur()
        .get('input[name="runner.firstName"').should('have.value', runner.firstName)
        .get('input[name="runner.lastName"').should('have.value', runner.lastName)
        .get('input[name="files.certificates').selectFile('cypress/e2e/assets/certificat_medical.pdf')
        .get('button[type="submit"').click()
        .wait('@submitForm').should(({ request }) => {
          expect(request.headers).to.include({
          'content-type': 'application/x-www-form-urlencoded'
          });
          expect(request.body).to.equal(`runner.email=testuser%40email.com&runner.firstName=Test&runner.lastName=User&run.runner=1&runner.id=1&run.copyright=on&files.certificates=certificat_medical.pdf&run.race=${race.id}`);
        });
    });
  });

  describe('avec plusieurs coureurs possibles', () => {
    const second = {
      email: 'seconduser@email.com',
      firstName: 'Second',
      lastName: 'Runner',
    };
    before(() => {
      const data = [{ id: 1, attributes: runner }, { id: 2, attributes: second }];
      cy.intercept('GET', STRAPI_URL + '/api/runners*', { data }).as('findRunners');
    });

    it('présente une liste de sélection', () => {
      cy.get('input[name="runner.email"]').clear().type(runner.email).blur()
        .get('select[name="runnerId"]')
        .should('contain', runner.firstName + ' ' + runner.lastName)
        .should('contain', second.firstName + ' ' + second.lastName);
    });
  });

  describe('mineur', () => {
    it('de plus de 16 ans', () => {
      Object.entries(runner).forEach(([key, value]) => cy.get(`input[name="runner.${key}"]`).clear().type(value));
      cy.get('input[name="files.certificates').selectFile('cypress/e2e/assets/certificat_medical.pdf')
        .get('[data-cy="Je suis mineur et..."').click()
        .get('input[name="runner.child"][value="false"]').click()
        .get('input[name="files.authorizations"').selectFile('cypress/e2e/assets/autorisation_parentale.jpg')
        .get('form').submit()
        .wait('@submitForm').should(({ request }) => {
          expect(request.headers).to.include({
            'content-type': 'application/x-www-form-urlencoded'
          });
          expect(request.body).to.equal(`runner.email=testuser%40email.com&runner.firstName=Test&runner.lastName=User&run.runner=&runner.id=&run.copyright=on&files.certificates=certificat_medical.pdf&runner.child=false&files.authorizations=autorisation_parentale.jpg&run.race=${race.id}`);
        });
    });

    it('de moins de 16 ans', () => {
      Object.entries(runner).forEach(([key, value]) => cy.get(`input[name="runner.${key}"]`).clear().type(value));
      cy.get('input[name="files.certificates').selectFile('cypress/e2e/assets/certificat_medical.pdf')
        .get('[data-cy="Je suis mineur et..."').click()
        .get('input[name="runner.child"][value="true"]').click()
        .get('p.alert').should('have.text', 'Les mineur-e-s de moins de 16 ans doivent impérativement être accompagné-e-s d\'un adulte pendant toute la course !')
        .get('form').submit()
        .wait('@submitForm').should(({ request }) => {
          expect(request.headers).to.include({
            'content-type': 'application/x-www-form-urlencoded'
          });
          expect(request.body).to.equal(`runner.email=testuser%40email.com&runner.firstName=Test&runner.lastName=User&run.runner=&runner.id=&run.copyright=on&files.certificates=certificat_medical.pdf&runner.child=true&run.race=${race.id}`);
        });
    });
  });
});