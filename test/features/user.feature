Feature: Create User
  As a non logged user of Laboratoire
  I want to create a new user in Laboratoire
  So that I access Laboratoire

  Scenario: Create User
    Given that I have clean "Users" model
    Given that I have a body
      """
      {
        "email": "gustavogelf@gmail.com",
        "password": "19005898",
        "idNumber": 19005898,
        "idType": "v",
        "firstName": "Gustavo",
        "lastName": "Laguna"
      }
      """
    When I POST on "/users"
    Then I should get a code 200
    Then I should recive a JSON response
    Then The "body" should contain "status,updatedAt,createdAt,email,idNumber,idType,firstName,lastName,_id,lastLogin,settings"

  Scenario: Create Duplicated User
    Given that I have clean "Users" model
    Given that I have a register user
      """
      {
        "email": "gustavogelf@gmail.com",
        "password": "19005898",
        "idNumber": 19005898,
        "idType": "v",
        "firstName": "Gustavo",
        "lastName": "Laguna"
      }
      """
    Given that I have a body
      """
      {
        "email": "gustavogelf@gmail.com",
        "password": "19005898",
        "idNumber": 19005898,
        "idType": "v",
        "firstName": "Gustavo",
        "lastName": "Laguna"
      }
      """
    When I POST on "/users"
    Then I should get a code 409
    Then I should recive a JSON response

  Scenario: Create Invalid User
    Given that I have clean "Users" model
    Given that I have a body
      """
      {
        "email": "gustavogelf@gmail.com",
        "password": "19005898",
        "idNumber": 19005898,
        "idType": "v"
      }
      """
    When I POST on "/users"
    Then I should get a code 400
    Then I should recive a JSON response

    Scenario: Login with User
      Given that I have clean "Users" model
      Given that I have a register user
        """
        {
          "email": "gustavogelf@gmail.com",
          "password": "19005898",
          "idNumber": 19005898,
          "idType": "v",
          "firstName": "Gustavo",
          "lastName": "Laguna"
        }
        """
      Given that I have a body
        """
        {
          "username": "gustavogelf@gmail.com",
          "password": "19005898"
        }
        """
      When I POST on "/login"
      Then I should get a code 200
      Then I should recive a JSON response
      Then The "body" should contain "issued_at, access_token, scope, attributes, expires_in, refresh_token, refresh_token_expires_in, token_type"

    Scenario: Login with Invalid Credentials
      Given that I have clean "Users" model
      Given that I have a register user
        """
        {
          "email": "gustavogelf@gmail.com",
          "password": "19005898",
          "idNumber": 19005898,
          "idType": "v",
          "firstName": "Gustavo",
          "lastName": "Laguna"
        }
        """
      Given that I have a body
        """
        {
          "username": "gustavogelf@gmail.com",
          "password": "1905898"
        }
        """
      When I POST on "/login"
      Then I should get a code 400
      Then I should recive a JSON response
      Then The "body" should contain "message, cause, isOperational, code"

    Scenario: Get me with Credentials
      Given that I have clean "Users" model
      Given that I have a logged user
      When I GET on "/users/me"
      Then I should get a code 200
      Then I should recive a JSON response
      Then The "body" should contain "status,updatedAt,createdAt,email,idNumber,idType,firstName,lastName,_id,lastLogin,settings"

    Scenario: Invite new user
      Given that I have clean "Users" model
      Given that I have a logged user
      Given that I have a body
        """
        {
          "idNumber": 19251125,
          "idType": "v",
          "firstName": "Nuevo",
          "lastName": "Usuario",
          "email": "nuevo@usuario.com"
        }
        """
      When I POST on "/users/invite"
      Then I should get a code 200
      Then I should recive a JSON response
      Then The "body" should contain "success,message"

    Scenario: Invalid user invite (wrong JSON value types)
      Given that I have clean "Users" model
      Given that I have a logged user
      Given that I have a body
        """
        {
          "idNumber": "no-soy-una-cedula",
          "idType": "v",
          "firstName": 1337,
          "lastName": "Usuario",
          "email": "yo-soy-un-email,en-serio"
        }
        """
      When I POST on "/users/invite"
      Then I should get a code 400
      Then I should recive a JSON response
      Then The "body" should contain "message,code,failedValidation,results,path,paramName"

    Scenario: Invalid user invite (user not logged)
      Given that I have clean "Users" model
      Given that I have a body
        """
        {
          "idNumber": 19251125,
          "idType": "v",
          "firstName": "Nuevo",
          "lastName": "Usuario",
          "email": "nuevo@usuario.com"
        }
        """
      When I POST on "/users/invite"
      Then I should get a code 401
      Then I should recive a JSON response
      Then The "body" should contain "message,code,statusCode"
  
    Scenario: Edit User
      Given that I have clean "Users" model
      Given that I have a logged user
      Given that I have a body
        """
        {
          "idNumber": 19251124,
          "idType": "v",
          "firstName": "Zoiloo",
          "lastName": "Granda"
        }
        """
      When I PUT on "/users/me"
      Then I should get a code 200
      Then I should recive a JSON response
      Then The "body" should contain "  _id,updatedAt,createdAt,firstName,lastName,email,idNumber,idType,__v,lastLogin,settings,status"

    Scenario: Invalid Edit User (incorrect JSON value types)
      Given that I have clean "Users" model
      Given that I have a logged user
      Given that I have a body
        """
        {
          "idNumber": "los-delfines-vuelan",
          "idType": "v",
          "firstName": 50170,
          "lastName": "Granda"
        }
        """
      When I PUT on "/users/me"
      Then I should get a code 400
      Then I should recive a JSON response
      Then The "body" should contain "message,code,failedValidation,results"

    Scenario: Change user password
      Given that I have clean "Users" model
      Given that I have a register user
        """
        {
          "email": "zgranda@gmail.com",
          "password": "19251124",
          "idNumber": 19251124,
          "idType": "v",
          "firstName": "Zoilo",
          "lastName": "Granda"
        }
        """
        Given that I have a body
        """
        {
          "username": "zgranda@gmail.com",
          "password": "19251124"
        }
        """
      When I POST on "/login"
      Then I should get a code 200
      Then I should recive a JSON response
      Given that I have a body
        """
        {
          "oldPassword": "19251124",
          "newPassword": "19251125",
          "email": "zgranda@gmail.com"
        }
        """
      When I PUT on "/users/password"
      Then I should get a code 200
      Then I should recive a JSON response
      Then The "body" should contain "success,message"

    Scenario: Invalid Change user password (wrong old password)
      Given that I have clean "Users" model
      Given that I have a register user
        """
        {
          "email": "zgranda@gmail.com",
          "password": "19251124",
          "idNumber": 19251124,
          "idType": "v",
          "firstName": "Zoilo",
          "lastName": "Granda"
        }
        """
      Given that I have a body
        """
        {
          "oldPassword": "12345678",
          "newPassword": "19251125",
          "email": "zgranda@gmail.com"
        }
        """
      When I PUT on "/users/password"
      Then I should get a code 401
      Then I should recive a JSON response
      Then The "body" should contain "message,code,statusCode"

    Scenario: Invalid Change user password (incorrect email)
      Given that I have clean "Users" model
      Given that I have a register user
        """
        {
          "email": "zgranda@gmail.com",
          "password": "19251124",
          "idNumber": 19251124,
          "idType": "v",
          "firstName": "Zoilo",
          "lastName": "Granda"
        }
        """
      Given that I have a body
        """
        {
          "oldPassword": "19251124",
          "newPassword": "19251125",
          "email": 12345678
        }
        """
      When I PUT on "/users/password"
      Then I should get a code 401
      Then I should recive a JSON response
      Then The "body" should contain "message,code,statusCode"

    Scenario: InvalidChange user password (user registered but not logged)
      Given that I have clean "Users" model
      Given that I have a register user
        """
        {
          "email": "zgranda@gmail.com",
          "password": "19251124",
          "idNumber": 19251124,
          "idType": "v",
          "firstName": "Zoilo",
          "lastName": "Granda"
        }
        """
      Given that I have a body
        """
        {
          "oldPassword": "19251124",
          "newPassword": "19251125",
          "email": "zgranda@gmail.com"
        }
        """
      When I PUT on "/users/password"
      Then I should get a code 401
      Then I should recive a JSON response
      Then The "body" should contain "message,code,statusCode"
