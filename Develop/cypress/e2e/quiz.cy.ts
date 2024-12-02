describe('Tech Quiz E2E Tests', () => {
    beforeEach(() => {
      cy.visit('/')
    })

    describe('Quiz Start and Navigation', () => {
        it('should start quiz when clicking start button', () => {
          cy.get('.btn.btn-primary').contains('Start Quiz').should('be.visible')
          
          cy.get('.btn.btn-primary').contains('Start Quiz').click()
          
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

    describe('Quiz Interaction', () => {
        beforeEach(() => {
          cy.get('.btn.btn-primary').contains('Start Quiz').click()
        })
        it('should navigate through all questions', () => {

          cy.get('h2').invoke('text').as('firstQuestion')
    
          cy.get('.btn.btn-primary').first().click()
    
          cy.get('h2').invoke('text').then((text) => {
            cy.get('@firstQuestion').should('not.equal', text)
          })
        })
        it('should track quiz progress', () => {
            for (let i = 0; i < 3; i++) {
              cy.get('.btn.btn-primary').first().should('exist').click()
            }
          })
        })

        describe('Quiz Completion', () => {
            it('should complete full quiz flow', () => {
              cy.get('.btn.btn-primary').contains('Start Quiz').click()
              for (let i = 0; i < 10; i++) {
                cy.get('.btn.btn-primary').first().should('exist').click()
              }
              cy.get('h2').contains('Quiz Completed').should('be.visible')
              cy.get('.alert.alert-success').should('be.visible')
              cy.get('.btn.btn-primary').contains('Take New Quiz').should('be.visible')
            })

            it('should start new quiz after completion', () => {
                cy.get('.btn.btn-primary').contains('Start Quiz').click()
                for (let i = 0; i < 10; i++) {
                  cy.get('.btn.btn-primary').first().should('exist').click()
                }
                cy.get('.btn.btn-primary').contains('Take New Quiz').click()
                cy.get('h2').should('exist')
                cy.get('.alert.alert-secondary').should('have.length.at.least', 2)
              })
            })

            describe('Error Handling', () => {
                it('should handle API errors gracefully', () => {
                  cy.intercept('GET', '/api/questions/random', {
                    statusCode: 500,
                    body: { error: 'Server error' }
                  }).as('getQuestionsError')
            
                  cy.get('.btn.btn-primary').contains('Start Quiz').click()
                  cy.wait('@getQuestionsError')
                  
                  cy.get('.spinner-border').should('not.exist')
                })
            
                it('should handle network timeout', () => {
 
                  cy.intercept('GET', '/api/questions/random', {
                    forceNetworkError: true
                  }).as('getQuestionsTimeout')
            
                  cy.get('.btn.btn-primary').contains('Start Quiz').click()
                  cy.wait('@getQuestionsTimeout')

                  cy.get('.spinner-border').should('not.exist')
                })
              })
            })