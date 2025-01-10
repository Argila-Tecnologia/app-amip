import React, { useCallback } from 'react';

import { useNavigation } from '@react-navigation/native';

import { Feather } from '@expo/vector-icons';

import { useTheme } from 'styled-components';

import { Container, BackButton, Title } from './styles';

interface IProps {
  title: string;
}

const Header: React.FC<IProps> = ({ title }) => {
  const theme = useTheme();

  const navigation = useNavigation();

  const handleGoBackNavigation = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  return (
    <Container>
      <BackButton onPress={handleGoBackNavigation}>
        <Feather
          name="chevron-left"
          size={25}
          color={theme.colors['white-color']}
        />
      </BackButton>

      <Title>{title}</Title>
    </Container>
  );
};

export { Header };
