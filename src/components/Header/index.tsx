import React, { ComponentProps, useCallback } from 'react';

import { useNavigation } from '@react-navigation/native';

import { Feather } from '@expo/vector-icons';

import { useTheme } from 'styled-components/native';

import { HeaderContainer, HeaderBackButton, HeaderTitle } from './styles';

interface IHeaderProps extends ComponentProps<typeof HeaderContainer> {
  title: string;
}

export function Header({ title, ...rest }: IHeaderProps) {
  const theme = useTheme();

  const navigation = useNavigation();

  const handleGoBackNavigation = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  return (
    <HeaderContainer {...rest}>
      <HeaderBackButton onPress={handleGoBackNavigation}>
        <Feather
          name="chevron-left"
          size={25}
          color={theme.COLORS['white-color']}
        />
      </HeaderBackButton>

      <HeaderTitle>{title}</HeaderTitle>
    </HeaderContainer>
  );
}
