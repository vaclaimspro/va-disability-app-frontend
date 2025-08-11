/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createTodo = /* GraphQL */ `
  mutation CreateTodo(
    $input: CreateTodoInput!
    $condition: ModelTodoConditionInput
  ) {
    createTodo(input: $input, condition: $condition) {
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
export const updateTodo = /* GraphQL */ `
  mutation UpdateTodo(
    $input: UpdateTodoInput!
    $condition: ModelTodoConditionInput
  ) {
    updateTodo(input: $input, condition: $condition) {
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
export const deleteTodo = /* GraphQL */ `
  mutation DeleteTodo(
    $input: DeleteTodoInput!
    $condition: ModelTodoConditionInput
  ) {
    deleteTodo(input: $input, condition: $condition) {
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
export const createUserSubscription = /* GraphQL */ `
  mutation CreateUserSubscription(
    $input: CreateUserSubscriptionInput!
    $condition: ModelUserSubscriptionConditionInput
  ) {
    createUserSubscription(input: $input, condition: $condition) {
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
export const updateUserSubscription = /* GraphQL */ `
  mutation UpdateUserSubscription(
    $input: UpdateUserSubscriptionInput!
    $condition: ModelUserSubscriptionConditionInput
  ) {
    updateUserSubscription(input: $input, condition: $condition) {
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
export const deleteUserSubscription = /* GraphQL */ `
  mutation DeleteUserSubscription(
    $input: DeleteUserSubscriptionInput!
    $condition: ModelUserSubscriptionConditionInput
  ) {
    deleteUserSubscription(input: $input, condition: $condition) {
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
export const createUserProfile = /* GraphQL */ `
  mutation CreateUserProfile(
    $input: CreateUserProfileInput!
    $condition: ModelUserProfileConditionInput
  ) {
    createUserProfile(input: $input, condition: $condition) {
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
export const updateUserProfile = /* GraphQL */ `
  mutation UpdateUserProfile(
    $input: UpdateUserProfileInput!
    $condition: ModelUserProfileConditionInput
  ) {
    updateUserProfile(input: $input, condition: $condition) {
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
export const deleteUserProfile = /* GraphQL */ `
  mutation DeleteUserProfile(
    $input: DeleteUserProfileInput!
    $condition: ModelUserProfileConditionInput
  ) {
    deleteUserProfile(input: $input, condition: $condition) {
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
export const createDisabilityApplication = /* GraphQL */ `
  mutation CreateDisabilityApplication(
    $input: CreateDisabilityApplicationInput!
    $condition: ModelDisabilityApplicationConditionInput
  ) {
    createDisabilityApplication(input: $input, condition: $condition) {
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
export const updateDisabilityApplication = /* GraphQL */ `
  mutation UpdateDisabilityApplication(
    $input: UpdateDisabilityApplicationInput!
    $condition: ModelDisabilityApplicationConditionInput
  ) {
    updateDisabilityApplication(input: $input, condition: $condition) {
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
export const deleteDisabilityApplication = /* GraphQL */ `
  mutation DeleteDisabilityApplication(
    $input: DeleteDisabilityApplicationInput!
    $condition: ModelDisabilityApplicationConditionInput
  ) {
    deleteDisabilityApplication(input: $input, condition: $condition) {
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
export const createPublicFAQ = /* GraphQL */ `
  mutation CreatePublicFAQ(
    $input: CreatePublicFAQInput!
    $condition: ModelPublicFAQConditionInput
  ) {
    createPublicFAQ(input: $input, condition: $condition) {
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
export const updatePublicFAQ = /* GraphQL */ `
  mutation UpdatePublicFAQ(
    $input: UpdatePublicFAQInput!
    $condition: ModelPublicFAQConditionInput
  ) {
    updatePublicFAQ(input: $input, condition: $condition) {
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
export const deletePublicFAQ = /* GraphQL */ `
  mutation DeletePublicFAQ(
    $input: DeletePublicFAQInput!
    $condition: ModelPublicFAQConditionInput
  ) {
    deletePublicFAQ(input: $input, condition: $condition) {
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
