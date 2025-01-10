export declare global {
  namespace ReactNavigation {
    interface RootParamList {
      tabNewsScreen: NonNullable<unknown> | undefined;
      tabChampionshipsScreen: NonNullable<unknown> | undefined;
      tabMuseumScreen: NonNullable<unknown> | undefined;

      detailsNewsScreen: NonNullable<unknown> | undefined;
      detailsChampionshipsScreen: NonNullable<unknown> | undefined;
      detailsMuseumScreen: NonNullable<unknown> | undefined;
      profileScreen: undefined;
      subscriptionScreen: NonNullable<unknown> | undefined;
      editInformationScreen: undefined;
      passwordUpdateScreen: undefined;
      contactScreen: undefined;

      // AUTH ROUTES
      signInScreen: undefined;
      signUpScreen: undefined;
      forgotPasswordScreen: undefined;

      newsScreen: undefined;
      championshipsScreen: undefined;
      museumScreen: undefined;
    }
  }
}
