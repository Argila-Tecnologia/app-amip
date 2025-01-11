import { useCallback } from 'react';

import { useNavigation } from '@react-navigation/native';

import { Feather } from '@expo/vector-icons';

import { useTheme } from 'styled-components/native';

import { useAuth } from '@hooks/auth';

import { noImage } from '@utils/no-image';

import logoImage from '../../assets/logo-AMIP.png';

import {
  HeaderAppContainer,
  HeaderAppBox,
  HeaderAppLogoImage,
  HeaderAppTitle,
  HeaderAppProfileButton,
  HeaderAppBoxProfile,
  HeaderAppPersonText,
  HeaderAppPersonPhotoImage,
  HeaderAppPersonPhotoIcon,
} from './styles';

export function HeaderApp() {
  const { player } = useAuth();
  const navigation = useNavigation();
  const theme = useTheme();

  // FUNCTION
  const handleProfile = useCallback(() => {
    navigation.navigate('profileScreen');
  }, [navigation]);
  // END FUNCTION

  return (
    <HeaderAppContainer>
      <HeaderAppBox>
        <HeaderAppLogoImage source={logoImage} />

        <HeaderAppTitle>AMIP</HeaderAppTitle>
      </HeaderAppBox>

      <HeaderAppProfileButton onPress={handleProfile}>
        {player ? (
          <HeaderAppBoxProfile>
            <HeaderAppPersonText numberOfLines={2} ellipsizeMode="tail">
              Olá, {'\n'}
              {player.name}
            </HeaderAppPersonText>

            <HeaderAppPersonPhotoImage
              source={{
                uri: player.avatar_url
                  ? player.avatar_url
                  : noImage(player.name),
              }}
              contentFit="cover"
            />
          </HeaderAppBoxProfile>
        ) : (
          <HeaderAppBoxProfile>
            <HeaderAppPersonPhotoIcon>
              <Feather
                name="user"
                size={25}
                color={theme.COLORS['black-color']}
              />
            </HeaderAppPersonPhotoIcon>
          </HeaderAppBoxProfile>
        )}
      </HeaderAppProfileButton>
    </HeaderAppContainer>
  );
}
