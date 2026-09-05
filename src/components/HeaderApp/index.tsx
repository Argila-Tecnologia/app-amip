import { useCallback } from 'react';

import { Platform } from 'react-native';

import { useNavigation } from '@react-navigation/native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Feather } from '@expo/vector-icons';

import { useTheme } from 'styled-components/native';

import { useAuth } from '@hooks/auth';

import logoImage from '../../assets/AMIP_LOGO.png';

import {
  HeaderAppContainer,
  HeaderAppBox,
  HeaderAppLogoImage,
  HeaderAppActions,
  HeaderAppSettingsButton,
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

  const paddingTop = Platform.OS === 'android' ? insets.top + 15 : insets.top;

  // FUNCTION
  const handleProfile = useCallback(() => {
    if (player.id) {
      navigation.navigate('profileScreen');
    } else {
      navigation.navigate('signInScreen');
    }
  }, [navigation, player.id]);

  const handleSettings = useCallback(() => {
    navigation.navigate('settingsScreen');
  }, [navigation]);
  // END FUNCTION

  return (
    <HeaderAppContainer style={{ paddingTop }}>
      <HeaderAppBox>
        <HeaderAppLogoImage source={logoImage} contentFit="contain" />

        {/* <HeaderAppTitle>AMIP</HeaderAppTitle> */}
      </HeaderAppBox>

      <HeaderAppActions>
        {/*
          Acesso às Configurações (tema claro/escuro) - fica aqui, ao lado
          do perfil, porque essa é a única área do header já visível em
          toda tela pública (News/Campeonatos/Museu); colocado antes do
          botão de perfil pra não competir com o avatar/ícone dele.
        */}
        <HeaderAppSettingsButton onPress={handleSettings}>
          <Feather
            name="settings"
            size={22}
            color={theme.COLORS['white-color']}
          />
        </HeaderAppSettingsButton>

        <HeaderAppProfileButton onPress={handleProfile}>
          {player.id ? (
            <HeaderAppBoxProfile>
              {/* <HeaderAppPersonText numberOfLines={2} ellipsizeMode="tail">
                Olá, {'\n'}
                {player.name}
              </HeaderAppPersonText> */}

              {/*
                Mesma troca do Profile: FallbackImage cobre "sem avatar" e
                "avatar falhou ao carregar" com a logo da AMIP, em vez do
                placeholder de iniciais (noImage) que só cobria o primeiro
                caso.
              */}
              <HeaderAppPersonPhotoImage
                source={{ uri: player.avatar_url }}
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
      </HeaderAppActions>
    </HeaderAppContainer>
  );
}
