Feature: Create new patient
  I want to create a new patient in Laboratoire
  So that i can register the patient data

  Scenario: Create Patient
    Given that I have clean "Patients" model
    Given that I have a body
      """
      {
        "name": "apolo",
        "active": true,
        "breed": "58ed21dddba72913b554d664",
        "birthDate": "2017-04-18T21:20:31.326Z"
      }
      """
    When I POST on "/patients"
    Then I should get a code 200
    Then I should recive a JSON response
    Then The "body" should contain "name,updatedAt,createdAt,breed,birthDate,_id,deleteAt"

  Scenario: Invalid Create Patient (Duplicated)
    Given that I have a body
      """
      {
        "name": "apolo",
        "active": true,
        "breed": "58ed21dddba72913b554d664",
        "birthDate": "2017-04-18T21:20:31.326Z"
      }
      """
    When I POST on "/patients"
    Then I should get a code 409
    Then I should recive a JSON response
    Then The "body" should contain "code,mongoCode,message"
    
  Scenario: Invalid Create Patient (wrong data types)
    Given that I have a body
      """
      {
        "name": 1234567,
        "active": "number",
        "birthDate": "2017-04-18T21:20:31.326Z"
      }
      """
    When I POST on "/patients"
    Then I should get a code 400
    Then I should recive a JSON response
    Then The "body" should contain "message,code,failedValidation,results, path, paramName"

  Scenario: Modify Patient
    Given that i have a random "patient"
    Given that I have a body
      """
      {
        "name": "pelusa",
        "active": true
      }
      """
    When I PUT on "/patients/{id}"
    Then I should get a code 200
    Then I should recive a JSON response
    Then The "body" should contain "name,updatedAt,createdAt,breed,birthDate,_id,deleteAt"

  Scenario: Invalid Modify Patient (wrong data types)
    Given that i have a random "patient"
    Given that I have a body
      """
      {
        "name": 1234567,
        "active": "number"
      }
      """
    When I PUT on "/patients/{id}"
    Then I should get a code 400
    Then I should recive a JSON response
    Then The "body" should contain "message,code,failedValidation,results,path,paramName"

  Scenario: Delete Patient
    Given that i have a random "patient"
    When I DELETE on "/patients/{id}"
    Then I should get a code 200
    Then I should recive a JSON response
    Then The "body" should contain "name,updatedAt,createdAt,breed,birthDate,_id,deleteAt"
    