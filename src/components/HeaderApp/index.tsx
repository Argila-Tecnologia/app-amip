import { Platform } from 'react-native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Feather } from '@expo/vector-icons';

import { useTheme } from 'styled-components/native';

import { useThemeMode } from '@hooks/theme';

import logoImage from '../../assets/AMIP_LOGO.png';

import {
  HeaderAppContainer,
  HeaderAppBox,
  HeaderAppLogoImage,
  HeaderAppActions,
  HeaderAppThemeButton,
} from './styles';

// O botão de perfil que ficava aqui (ao lado do de tema) foi removido -
// "Perfil" virou uma aba fixa no rodapé (app.bottom.tabs.routes.tsx), então
// ter os dois caminhos pro mesmo lugar ficaria redundante.
export function HeaderApp() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { themeName, toggleTheme } = useThemeMode();

  const paddingTop = Platform.OS === 'android' ? insets.top + 15 : insets.top;

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
          Fica aqui, única ação que sobrou no header, já que o perfil
          saiu daqui (virou aba) - visível em toda tela pública
          (News/Campeonatos/Museu).
        */}
        <HeaderAppThemeButton onPress={toggleTheme}>
          <Feather
            name={themeName === 'dark' ? 'moon' : 'sun'}
            size={22}
            color={theme.COLORS['white-color']}
          />
        </HeaderAppThemeButton>
      </HeaderAppActions>
    </HeaderAppContainer>
  );
}
