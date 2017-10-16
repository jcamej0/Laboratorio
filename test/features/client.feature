Feature: Create new client
  I want to create a new client in Laboratoire
  So that i can register the client data

  Scenario: Create Client
    Given that I have clean "Clients" model
    Given that I have a body
      """
      {
        "email": "zgranda@gmail.com",
        "idNumber": 19251111,
        "idType": "v",
        "firstName": "Zoilo",
        "lastName": "Granda"
      }
      """
    When I POST on "/clients"
    Then I should get a code 200
    Then I should recive a JSON response
    Then The "body" should contain "email,idNumber,idType,firstName,lastName"

  Scenario: Invalid Create Client (Duplicated)
    Given that I have a body
      """
      {
        "email": "zgranda@gmail.com",
        "idNumber": 19251111,
        "idType": "v",
        "firstName": "Zoilo",
        "lastName": "Granda"
      }
      """
    When I POST on "/clients"
    Then I should get a code 409
    Then I should recive a JSON response
    Then The "body" should contain "code,mongoCode,message"
    
  Scenario: Invalid Create Client (wrong data types)
    Given that I have a body
        """
        {
          "email": 1234567,
          "idNumber": "numero de cedula",
          "idType": "l",
          "firstName": null,
          "lastName": "do-you-even-lift-bro?"
        }
        """
    When I POST on "/clients"
    Then I should get a code 400
    Then I should recive a JSON response
    Then The "body" should contain "message,code,failedValidation,results, path, paramName"

  Scenario: Modify Client
    Given that i have a random "client"
    Given that I have a body
      """
      {
        "email": "zgranda@gmail.com",
        "idNumber": 29251124,
        "idType": "v",
        "firstName": "Zoilo",
        "lastName": "Granda"
      }
      """
    When I PUT on "/clients/{id}"
    Then I should get a code 200
    Then I should recive a JSON response
    Then The "body" should contain "_id,updatedAt,createdAt,email,idNumber,idType,firstName,lastName,__v,deleteAt"

  Scenario: Invalid Modify Client (wrong data types)
    Given that i have a random "client"
    Given that I have a body
      """
      {
        "email": "luke-yo-soy-tu-padre",
        "idNumber": "123,982.12",
        "idType": "0",
        "firstName": false,
        "lastName": null
      }
      """
    When I PUT on "/clients/{id}"
    Then I should get a code 400
    Then I should recive a JSON response
    Then The "body" should contain "message,code,failedValidation,results,path,paramName"

  Scenario: Delete Client
    Given that i have a random "client"
    When I DELETE on "/clients/{id}"
    Then I should get a code 200
    Then I should recive a JSON response
    Then The "body" should contain "_id,updatedAt,createdAt,email,idNumber,idType,firstName,lastName,__v,deleteAt"
    