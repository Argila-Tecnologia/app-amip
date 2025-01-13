export declare global {
  namespace ReactNavigation {
    interface RootParamList {
      // tabNewsScreen: NonNullable<unknown> | undefined;
      // tabChampionshipsScreen: NonNullable<unknown> | undefined;
      // tabMuseumScreen: NonNullable<unknown> | undefined;
      appBottomTabs: NonNullable<unknown> | undefined;

      detailsNewsScreen: { newsId: string };

      detailsChampionshipsScreen: { championshipId: string };

      detailsMuseumScreen: { museumId: string };

      profileScreen: undefined;
      editInformationScreen: undefined;
      passwordUpdateScreen: undefined;

      subscriptionScreen: { championshipId: string } | undefined;

      contactScreen: undefined;

      // AUTH ROUTES
      signInScreen: undefined;
      signUpScreen: undefined;
      forgotPasswordScreen: undefined;

      newsScreen: undefined;
      championshipsScreen: undefined;
      museumsScreen: undefined;

      playersScreen: undefined;
    }
  }
}
