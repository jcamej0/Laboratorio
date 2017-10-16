Feature: Create new breed
  I want to create a new breed in Laboratoire
  So that i can register the breed data

  Scenario: Create Breed
    Given that I have clean "Breeds" model
    Given that I have a body
      """
      {
        "name": "boxer",
        "active": true,
        "species": "58e7fa8588697014ab803ec4"
      }
      """
    When I POST on "/breeds"
    Then I should get a code 200
    Then I should recive a JSON response
    Then The "body" should contain "name,active"

  Scenario: Invalid Create Breed (Duplicated)
    Given that I have a body
      """
      {
        "name": "boxer",
        "active": true,
        "species": "58e7fa8588697014ab803ec4"
      }
      """
    When I POST on "/breeds"
    Then I should get a code 409
    Then I should recive a JSON response
    Then The "body" should contain "code,mongoCode,message"
    
  Scenario: Invalid Create Breed (wrong data types)
    Given that I have a body
      """
      {
        "name": 1234567,
        "active": "number"
      }
      """
    When I POST on "/breeds"
    Then I should get a code 400
    Then I should recive a JSON response
    Then The "body" should contain "message,code,failedValidation,results, path, paramName"

  Scenario: Modify Breed
    Given that i have a random "breed"
    Given that I have a body
      """
      {
        "name": "doberman",
        "active": true
      }
      """
    When I PUT on "/breeds/{id}"
    Then I should get a code 200
    Then I should recive a JSON response
    Then The "body" should contain "_id,updatedAt,createdAt,name,active"

  Scenario: Invalid Modify Breed (wrong data types)
    Given that i have a random "breed"
    Given that I have a body
      """
      {
        "name": 1234567,
        "active": "number"
      }
      """
    When I PUT on "/breeds/{id}"
    Then I should get a code 400
    Then I should recive a JSON response
    Then The "body" should contain "message,code,failedValidation,results,path,paramName"

  Scenario: Delete Breed
    Given that i have a random "breed"
    When I DELETE on "/breeds/{id}"
    Then I should get a code 200
    Then I should recive a JSON response
    Then The "body" should contain "_id,updatedAt,createdAt,name,active"
    