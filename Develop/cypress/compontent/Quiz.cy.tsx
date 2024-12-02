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
      // Mock the API response with test questions
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

    