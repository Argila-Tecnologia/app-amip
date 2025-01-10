export declare global {
  namespace ReactNavigation {
    interface RootParamList {
      TabNews: NonNullable | undefined;
      TabChampionships: NonNullable | undefined;
      TabMuseum: NonNullable | undefined;

      DetailsNewsScreen: NonNullable | undefined;
      DetailsChampionshipsScreen: NonNullable | undefined;
      DetailsMuseumScreen: NonNullable | undefined;
      ProfileScreen: undefined;
      SubscriptionScreen: NonNullable | undefined;
      EditInformationScreen: undefined;
      PasswordUpdateScreen: undefined;
      ContactScreen: undefined;

      // AUTH ROUTES
      SignIn: undefined;
      SignUp: undefined;
      ForgotPasswordScreen: undefined;

      News: undefined;
      Championships: undefined;
      Museum: undefined;
    }
  }
}
