Feature: Create new specie
  I want to create a new specie in Laboratoire
  So that i can register the specie data

  Scenario: Create Specie
    Given that I have clean "Species" model
    Given that I have a body
      """
      {
        "name": "Perro",
        "active": true
      }
      """
    When I POST on "/species"
    Then I should get a code 200
    Then I should recive a JSON response
    Then The "body" should contain "name,active"

  Scenario: Invalid Create Specie (Duplicated)
    Given that I have a body
      """
      {
        "name": "Perro",
        "active": true
      }
      """
    When I POST on "/species"
    Then I should get a code 409
    Then I should recive a JSON response
    Then The "body" should contain "code,mongoCode,message"
    
  Scenario: Invalid Create Specie (wrong data types)
    Given that I have a body
      """
      {
        "name": 1234567,
        "active": "number"
      }
      """
    When I POST on "/species"
    Then I should get a code 400
    Then I should recive a JSON response
    Then The "body" should contain "message,code,failedValidation,results, path, paramName"

  Scenario: Modify Specie
    Given that i have a random "specie"
    Given that I have a body
      """
      {
        "name": "Gato",
        "active": true
      }
      """
    When I PUT on "/species/{id}"
    Then I should get a code 200
    Then I should recive a JSON response
    Then The "body" should contain "_id,updatedAt,createdAt,name,active"

  Scenario: Invalid Modify Specie (wrong data types)
    Given that i have a random "specie"
    Given that I have a body
      """
      {
        "name": 1234567,
        "active": "number"
      }
      """
    When I PUT on "/species/{id}"
    Then I should get a code 400
    Then I should recive a JSON response
    Then The "body" should contain "message,code,failedValidation,results,path,paramName"

  Scenario: Delete Specie
    Given that i have a random "specie"
    When I DELETE on "/species/{id}"
    Then I should get a code 200
    Then I should recive a JSON response
    Then The "body" should contain "_id,updatedAt,createdAt,name,active"
    