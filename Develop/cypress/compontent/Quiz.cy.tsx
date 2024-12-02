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