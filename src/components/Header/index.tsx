import React, { useCallback } from 'react';

import { Platform } from 'react-native';

import { useNavigation } from '@react-navigation/native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Feather } from '@expo/vector-icons';

import { useTheme } from 'styled-components/native';

import { HeaderContainer, HeaderBackButton, HeaderTitle } from './styles';

interface IHeaderProps {
  title: string;
}

export function Header({ title }: IHeaderProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  const paddingTop =
    Platform.OS === 'android' ? insets.top + 20 : insets.top + 10;

  const handleGoBackNavigation = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  return (
    <HeaderContainer style={{ paddingTop }}>
      <HeaderBackButton onPress={handleGoBackNavigation}>
        <Feather
          name="chevron-left"
          size={25}
          color={theme.COLORS['white-color']}
        />

        <HeaderTitle>{title}</HeaderTitle>
      </HeaderBackButton>
    </HeaderContainer>
  );
}
