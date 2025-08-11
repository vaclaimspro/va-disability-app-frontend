/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getTodo = /* GraphQL */ `
  query GetTodo($id: ID!) {
    getTodo(id: $id) {
      id
      name
      description
      owner
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
  }
`;
export const listTodos = /* GraphQL */ `
  query ListTodos(
    $filter: ModelTodoFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listTodos(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        description
        owner
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getUserSubscription = /* GraphQL */ `
  query GetUserSubscription($id: ID!) {
    getUserSubscription(id: $id) {
      id
      userId
      status
      startDate
      endDate
      planName
      price
      createdAt
      updatedAt
      owner
      _version
      _deleted
      _lastChangedAt
      __typename
    }
  }
`;
export const listUserSubscriptions = /* GraphQL */ `
  query ListUserSubscriptions(
    $filter: ModelUserSubscriptionFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listUserSubscriptions(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        userId
        status
        startDate
        endDate
        planName
        price
        createdAt
        updatedAt
        owner
        _version
        _deleted
        _lastChangedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getUserProfile = /* GraphQL */ `
  query GetUserProfile($id: ID!) {
    getUserProfile(id: $id) {
      id
      username
      email
      fullName
      dateOfBirth
      phoneNumber
      address
      membershipStatus
      stripeCustomerId
      stripeSubscriptionId
      owner
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      disabilities
      dependents
      serviceDates
      strategyData
      claimPackage
      appointments
      todos
      symptomLogs
      presumptiveSymptoms
      savedDocuments
      sessionInfo
      __typename
    }
  }
`;
export const listUserProfiles = /* GraphQL */ `
  query ListUserProfiles(
    $filter: ModelUserProfileFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listUserProfiles(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        username
        email
        fullName
        dateOfBirth
        phoneNumber
        address
        membershipStatus
        stripeCustomerId
        stripeSubscriptionId
        owner
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        disabilities
        dependents
        serviceDates
        strategyData
        claimPackage
        appointments
        todos
        symptomLogs
        presumptiveSymptoms
        savedDocuments
        sessionInfo
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getDisabilityApplication = /* GraphQL */ `
  query GetDisabilityApplication($id: ID!) {
    getDisabilityApplication(id: $id) {
      id
      applicantID
      applicationStatus
      submissionDate
      disabilityType
      description
      notes
      createdAt
      updatedAt
      owner
      _version
      _deleted
      _lastChangedAt
      __typename
    }
  }
`;
export const listDisabilityApplications = /* GraphQL */ `
  query ListDisabilityApplications(
    $filter: ModelDisabilityApplicationFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listDisabilityApplications(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        applicantID
        applicationStatus
        submissionDate
        disabilityType
        description
        notes
        createdAt
        updatedAt
        owner
        _version
        _deleted
        _lastChangedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getPublicFAQ = /* GraphQL */ `
  query GetPublicFAQ($id: ID!) {
    getPublicFAQ(id: $id) {
      id
      question
      answer
      category
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
  }
`;
export const listPublicFAQS = /* GraphQL */ `
  query ListPublicFAQS(
    $filter: ModelPublicFAQFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listPublicFAQS(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        question
        answer
        category
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
