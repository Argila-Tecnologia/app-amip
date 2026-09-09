import { useCallback } from 'react';

import { Platform } from 'react-native';

import { useNavigation } from '@react-navigation/native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Feather } from '@expo/vector-icons';

import { useTheme } from 'styled-components/native';

import { useAuth } from '@hooks/auth';
import { useThemeMode } from '@hooks/theme';

import logoImage from '../../assets/AMIP_LOGO.png';

import {
  HeaderAppContainer,
  HeaderAppBox,
  HeaderAppLogoImage,
  HeaderAppActions,
  HeaderAppThemeButton,
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
  const { themeName, toggleTheme } = useThemeMode();

  const paddingTop = Platform.OS === 'android' ? insets.top + 15 : insets.top;

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

      <HeaderAppActions>
        {/*
          Troca de tema direta (sem navegar pra lugar nenhum) - antes era
          uma engrenagem que abria uma tela de Configurações só com esse
          toggle dentro; trocado por um ícone que já mostra o tema ATIVO
          (lua = escuro ativo, sol = claro ativo) e alterna com 1 toque.
          Fica aqui, ao lado do perfil, porque essa é a única área do
          header já visível em toda tela pública (News/Campeonatos/Museu).
        */}
        <HeaderAppThemeButton onPress={toggleTheme}>
          <Feather
            name={themeName === 'dark' ? 'moon' : 'sun'}
            size={22}
            color={theme.COLORS['white-color']}
          />
        </HeaderAppThemeButton>

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
                <Feather name="user" size={25} color={theme.COLORS.text} />
              </HeaderAppPersonPhotoIcon>
            </HeaderAppBoxProfile>
          )}
        </HeaderAppProfileButton>
      </HeaderAppActions>
    </HeaderAppContainer>
  );
}
