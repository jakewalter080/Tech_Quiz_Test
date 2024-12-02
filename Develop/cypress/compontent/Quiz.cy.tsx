import Quiz from '../../client/src/components/Quiz'

describe('Quiz Component Tests', () => {
  beforeEach(() => {
    cy.mount(<Quiz />)
  })

  describe('Initial State', () => {
    it('should display start button on initial render', () => {
      cy.get('.btn.btn-primary').contains('Start Quiz').should('be.visible')
    })
  })

  describe('Quiz Start', () => {
    beforeEach(() => {

      cy.intercept('GET', '/api/questions/random', {
        body: [
          {
            _id: '1',
            question: 'What is React?',
            answers: [
              { text: 'A JavaScript library', isCorrect: true },
              { text: 'A database', isCorrect: false },
              { text: 'A server', isCorrect: false }
            ]
          },
          {
            _id: '2',
            question: 'What is TypeScript?',
            answers: [
              { text: 'A superset of JavaScript', isCorrect: true },
              { text: 'A database', isCorrect: false }
            ]
          }
        ]
      }).as('getQuestions')
    })
    it('should move to next question after answering', () => {
        cy.get('h2').contains('First Question')
        cy.get('.btn.btn-primary').first().click()
        cy.get('h2').contains('Second Question')
      })
  
      it('should track score correctly', () => {

        cy.get('.btn.btn-primary').first().click()

        cy.get('.btn.btn-primary').last().click()
        
        cy.get('.alert.alert-success').contains('1/2')
      })
    })

    describe('Quiz Completion', () => {
        beforeEach(() => {
          cy.intercept('GET', '/api/questions/random', {
            body: [
              {
                _id: '1',
                question: 'Test Question',
                answers: [
                  { text: 'Correct', isCorrect: true },
                  { text: 'Wrong', isCorrect: false }
                ]
              }
            ]
          }).as('getQuestions')
    
          cy.get('.btn.btn-primary').contains('Start Quiz').click()
          cy.wait('@getQuestions')
        })
