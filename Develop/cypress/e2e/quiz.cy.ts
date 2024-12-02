describe('Tech Quiz E2E Tests', () => {
    beforeEach(() => {
      cy.visit('/')
    })

    describe('Quiz Start and Navigation', () => {
        it('should start quiz when clicking start button', () => {
          // Initial state check
          cy.get('.btn.btn-primary').contains('Start Quiz').should('be.visible')
          
          // Start quiz
          cy.get('.btn.btn-primary').contains('Start Quiz').click()
          
          // Verify question appears
          cy.get('h2').should('exist')
          cy.get('.alert.alert-secondary').should('have.length.at.least', 2)
        })

    it('should show loading state while fetching questions', () => {
        cy.intercept('GET', '/api/questions/random', (req) => {
          req.reply({
            delay: 1000,
            fixture: 'questions.json'
          })
        }).as('getQuestionsDelayed')
  
        cy.get('.btn.btn-primary').contains('Start Quiz').click()
        cy.get('.spinner-border').should('be.visible')
        cy.wait('@getQuestionsDelayed')
        cy.get('.spinner-border').should('not.exist')
      })
    })