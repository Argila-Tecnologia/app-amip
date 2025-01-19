import { useCallback } from 'react';

import { useNavigation } from '@react-navigation/native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Feather } from '@expo/vector-icons';

import { useTheme } from 'styled-components/native';

import { useAuth } from '@hooks/auth';

import { noImage } from '@utils/no-image';

import logoImage from '../../assets/AMIP_LOGO.png';

import {
  HeaderAppContainer,
  HeaderAppBox,
  HeaderAppLogoImage,
  HeaderAppProfileButton,
  HeaderAppBoxProfile,
  HeaderAppPersonPhotoImage,
  HeaderAppPersonPhotoIcon,
} from './styles';

export function HeaderApp() {
  const { player } = useAuth();
  const navigation = useNavigation();
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  const paddingTop = insets.top + 10;

  // FUNCTION
  const handleProfile = useCallback(() => {
    if (player.id) {
      navigation.navigate('profileScreen');
    } else {
      navigation.navigate('signInScreen');
    }
  }, [navigation, player.id]);
  // END FUNCTION

  return (
    <HeaderAppContainer style={{ paddingTop }}>
      <HeaderAppBox>
        <HeaderAppLogoImage source={logoImage} contentFit="contain" />

        {/* <HeaderAppTitle>AMIP</HeaderAppTitle> */}
      </HeaderAppBox>

      <HeaderAppProfileButton onPress={handleProfile}>
        {player.id ? (
          <HeaderAppBoxProfile>
            {/* <HeaderAppPersonText numberOfLines={2} ellipsizeMode="tail">
              Olá, {'\n'}
              {player.name}
            </HeaderAppPersonText> */}

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
