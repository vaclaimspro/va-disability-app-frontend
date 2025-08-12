import { ModelInit, MutableModel, __modelMeta__, ManagedIdentifier } from "@aws-amplify/datastore";
// @ts-ignore
import { LazyLoading, LazyLoadingDisabled } from "@aws-amplify/datastore";





type EagerTodo = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Todo, 'id'>;
  };
  readonly id: string;
  readonly name: string;
  readonly description?: string | null;
  readonly owner?: string | null;
  readonly createdAt: string;
  readonly updatedAt: string;
}

type LazyTodo = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Todo, 'id'>;
  };
  readonly id: string;
  readonly name: string;
  readonly description?: string | null;
  readonly owner?: string | null;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export declare type Todo = LazyLoading extends LazyLoadingDisabled ? EagerTodo : LazyTodo

export declare const Todo: (new (init: ModelInit<Todo>) => Todo) & {
  copyOf(source: Todo, mutator: (draft: MutableModel<Todo>) => MutableModel<Todo> | void): Todo;
}

type EagerUserSubscription = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<UserSubscription, 'id'>;
  };
  readonly id: string;
  readonly userId: string;
  readonly status: string;
  readonly startDate: string;
  readonly endDate?: string | null;
  readonly planName: string;
  readonly price: number;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly owner?: string | null;
}

type LazyUserSubscription = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<UserSubscription, 'id'>;
  };
  readonly id: string;
  readonly userId: string;
  readonly status: string;
  readonly startDate: string;
  readonly endDate?: string | null;
  readonly planName: string;
  readonly price: number;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly owner?: string | null;
}

export declare type UserSubscription = LazyLoading extends LazyLoadingDisabled ? EagerUserSubscription : LazyUserSubscription

export declare const UserSubscription: (new (init: ModelInit<UserSubscription>) => UserSubscription) & {
  copyOf(source: UserSubscription, mutator: (draft: MutableModel<UserSubscription>) => MutableModel<UserSubscription> | void): UserSubscription;
}

type EagerUserProfile = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<UserProfile, 'id'>;
  };
  readonly id: string;
  readonly username: string;
  readonly email: string;
  readonly fullName?: string | null;
  readonly dateOfBirth?: string | null;
  readonly phoneNumber?: string | null;
  readonly address?: string | null;
  readonly membershipStatus?: string | null;
  readonly stripeCustomerId?: string | null;
  readonly stripeSubscriptionId?: string | null;
  readonly owner?: string | null;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly disabilities?: string | null;
  readonly dependents?: string | null;
  readonly serviceDates?: string | null;
  readonly strategyData?: string | null;
  readonly claimPackage?: string | null;
  readonly appointments?: string | null;
  readonly todos?: string | null;
  readonly symptomLogs?: string | null;
  readonly presumptiveSymptoms?: string | null;
  readonly savedDocuments?: string | null;
  readonly sessionInfo?: string | null;
}

type LazyUserProfile = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<UserProfile, 'id'>;
  };
  readonly id: string;
  readonly username: string;
  readonly email: string;
  readonly fullName?: string | null;
  readonly dateOfBirth?: string | null;
  readonly phoneNumber?: string | null;
  readonly address?: string | null;
  readonly membershipStatus?: string | null;
  readonly stripeCustomerId?: string | null;
  readonly stripeSubscriptionId?: string | null;
  readonly owner?: string | null;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly disabilities?: string | null;
  readonly dependents?: string | null;
  readonly serviceDates?: string | null;
  readonly strategyData?: string | null;
  readonly claimPackage?: string | null;
  readonly appointments?: string | null;
  readonly todos?: string | null;
  readonly symptomLogs?: string | null;
  readonly presumptiveSymptoms?: string | null;
  readonly savedDocuments?: string | null;
  readonly sessionInfo?: string | null;
}

export declare type UserProfile = LazyLoading extends LazyLoadingDisabled ? EagerUserProfile : LazyUserProfile

export declare const UserProfile: (new (init: ModelInit<UserProfile>) => UserProfile) & {
  copyOf(source: UserProfile, mutator: (draft: MutableModel<UserProfile>) => MutableModel<UserProfile> | void): UserProfile;
}

type EagerDisabilityApplication = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<DisabilityApplication, 'id'>;
  };
  readonly id: string;
  readonly applicantID: string;
  readonly applicationStatus: string;
  readonly submissionDate?: string | null;
  readonly disabilityType: string;
  readonly description?: string | null;
  readonly notes?: string | null;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly owner?: string | null;
}

type LazyDisabilityApplication = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<DisabilityApplication, 'id'>;
  };
  readonly id: string;
  readonly applicantID: string;
  readonly applicationStatus: string;
  readonly submissionDate?: string | null;
  readonly disabilityType: string;
  readonly description?: string | null;
  readonly notes?: string | null;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly owner?: string | null;
}

export declare type DisabilityApplication = LazyLoading extends LazyLoadingDisabled ? EagerDisabilityApplication : LazyDisabilityApplication

export declare const DisabilityApplication: (new (init: ModelInit<DisabilityApplication>) => DisabilityApplication) & {
  copyOf(source: DisabilityApplication, mutator: (draft: MutableModel<DisabilityApplication>) => MutableModel<DisabilityApplication> | void): DisabilityApplication;
}

type EagerPublicFAQ = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<PublicFAQ, 'id'>;
  };
  readonly id: string;
  readonly question: string;
  readonly answer: string;
  readonly category?: string | null;
  readonly createdAt: string;
  readonly updatedAt: string;
}

type LazyPublicFAQ = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<PublicFAQ, 'id'>;
  };
  readonly id: string;
  readonly question: string;
  readonly answer: string;
  readonly category?: string | null;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export declare type PublicFAQ = LazyLoading extends LazyLoadingDisabled ? EagerPublicFAQ : LazyPublicFAQ

export declare const PublicFAQ: (new (init: ModelInit<PublicFAQ>) => PublicFAQ) & {
  copyOf(source: PublicFAQ, mutator: (draft: MutableModel<PublicFAQ>) => MutableModel<PublicFAQ> | void): PublicFAQ;
}