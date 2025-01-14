export declare global {
  namespace ReactNavigation {
    interface RootParamList {
      // tabNewsScreen: NonNullable<unknown> | undefined;
      // tabChampionshipsScreen: NonNullable<unknown> | undefined;
      // tabMuseumScreen: NonNullable<unknown> | undefined;
      appBottomTabs: NonNullable<unknown> | undefined;

      newsScreen: undefined;

      detailsNewsScreen: { newsId: string };

      championshipsScreen: undefined;

      detailsChampionshipsScreen: { championshipId: string };

      museumsScreen: undefined;

      detailsMuseumScreen: { museumId: string };

      subscriptionScreen: { championshipId: string } | undefined;

      playersScreen: undefined;

      profileScreen: undefined;
      editProfileInformationScreen: undefined;
      editPasswordScreen: undefined;

      contactScreen: undefined;

      // AUTH ROUTES
      signInScreen: undefined;
      signUpScreen: undefined;
      forgotPasswordScreen: undefined;
    }
  }
}
