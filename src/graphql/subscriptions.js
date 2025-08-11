/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateTodo = /* GraphQL */ `
  subscription OnCreateTodo(
    $filter: ModelSubscriptionTodoFilterInput
    $owner: String
  ) {
    onCreateTodo(filter: $filter, owner: $owner) {
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
export const onUpdateTodo = /* GraphQL */ `
  subscription OnUpdateTodo(
    $filter: ModelSubscriptionTodoFilterInput
    $owner: String
  ) {
    onUpdateTodo(filter: $filter, owner: $owner) {
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
export const onDeleteTodo = /* GraphQL */ `
  subscription OnDeleteTodo(
    $filter: ModelSubscriptionTodoFilterInput
    $owner: String
  ) {
    onDeleteTodo(filter: $filter, owner: $owner) {
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
export const onCreateUserSubscription = /* GraphQL */ `
  subscription OnCreateUserSubscription(
    $filter: ModelSubscriptionUserSubscriptionFilterInput
    $owner: String
  ) {
    onCreateUserSubscription(filter: $filter, owner: $owner) {
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
export const onUpdateUserSubscription = /* GraphQL */ `
  subscription OnUpdateUserSubscription(
    $filter: ModelSubscriptionUserSubscriptionFilterInput
    $owner: String
  ) {
    onUpdateUserSubscription(filter: $filter, owner: $owner) {
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
export const onDeleteUserSubscription = /* GraphQL */ `
  subscription OnDeleteUserSubscription(
    $filter: ModelSubscriptionUserSubscriptionFilterInput
    $owner: String
  ) {
    onDeleteUserSubscription(filter: $filter, owner: $owner) {
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
export const onCreateUserProfile = /* GraphQL */ `
  subscription OnCreateUserProfile(
    $filter: ModelSubscriptionUserProfileFilterInput
    $owner: String
  ) {
    onCreateUserProfile(filter: $filter, owner: $owner) {
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
export const onUpdateUserProfile = /* GraphQL */ `
  subscription OnUpdateUserProfile(
    $filter: ModelSubscriptionUserProfileFilterInput
    $owner: String
  ) {
    onUpdateUserProfile(filter: $filter, owner: $owner) {
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
export const onDeleteUserProfile = /* GraphQL */ `
  subscription OnDeleteUserProfile(
    $filter: ModelSubscriptionUserProfileFilterInput
    $owner: String
  ) {
    onDeleteUserProfile(filter: $filter, owner: $owner) {
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
export const onCreateDisabilityApplication = /* GraphQL */ `
  subscription OnCreateDisabilityApplication(
    $filter: ModelSubscriptionDisabilityApplicationFilterInput
    $owner: String
  ) {
    onCreateDisabilityApplication(filter: $filter, owner: $owner) {
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
export const onUpdateDisabilityApplication = /* GraphQL */ `
  subscription OnUpdateDisabilityApplication(
    $filter: ModelSubscriptionDisabilityApplicationFilterInput
    $owner: String
  ) {
    onUpdateDisabilityApplication(filter: $filter, owner: $owner) {
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
export const onDeleteDisabilityApplication = /* GraphQL */ `
  subscription OnDeleteDisabilityApplication(
    $filter: ModelSubscriptionDisabilityApplicationFilterInput
    $owner: String
  ) {
    onDeleteDisabilityApplication(filter: $filter, owner: $owner) {
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
export const onCreatePublicFAQ = /* GraphQL */ `
  subscription OnCreatePublicFAQ(
    $filter: ModelSubscriptionPublicFAQFilterInput
  ) {
    onCreatePublicFAQ(filter: $filter) {
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
export const onUpdatePublicFAQ = /* GraphQL */ `
  subscription OnUpdatePublicFAQ(
    $filter: ModelSubscriptionPublicFAQFilterInput
  ) {
    onUpdatePublicFAQ(filter: $filter) {
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
export const onDeletePublicFAQ = /* GraphQL */ `
  subscription OnDeletePublicFAQ(
    $filter: ModelSubscriptionPublicFAQFilterInput
  ) {
    onDeletePublicFAQ(filter: $filter) {
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
