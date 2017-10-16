Feature: View Swagger
  As a user of Laboratoire
  I want to have documentation on Laboratoire
  So that I can concentrate on building awesome applications

  Scenario: Getting swagger documentation
    When I GET on "/swagger"
    Then I should get a code 200
    Then I should recive a JSON response
    Then The "body" should contain "swagger, info, securityDefinitions, host, basePath, schemes, paths"