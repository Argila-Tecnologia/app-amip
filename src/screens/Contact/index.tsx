import { useCallback } from 'react';

import { Linking } from 'react-native';

import { MaterialCommunityIcons } from '@expo/vector-icons';

import Toast from 'react-native-toast-message';

import { useTheme } from 'styled-components/native';

import { WHATSAPP_PHONE_NUMBER } from '@env';

import { Header } from '@components/Header';

import {
  ContactButton,
  ContactIcon,
  ContactText,
  ContactContainer,
  ContactContent,
} from './styles';

export function ContactScreen() {
  const theme = useTheme();

  // FUNCTION
  const handleEmail = useCallback(async () => {
    const canOpenMail = await Linking.canOpenURL(
      'mailto:amip@gmail.com?subject=[AMIP] Mais informações&body=Gostaria de mais informações',
    );

    if (canOpenMail) {
      await Linking.openURL(
        'mailto:amip@gmail.com?subject=[AMIP] Mais informações&body=Gostaria de mais informações',
      );
    }
  }, []);

  const handleWhatsapp = useCallback(() => {
    Linking.canOpenURL(`whatsapp://send?phone=${WHATSAPP_PHONE_NUMBER}`)
      .then((supported) => {
        if (supported) {
          return Linking.openURL(
            `whatsapp://send?phone=${WHATSAPP_PHONE_NUMBER}&text=Gostaria de mais informações`,
          );
        }
        return Linking.openURL(
          `https://api.whatsapp.com/send?phone=${WHATSAPP_PHONE_NUMBER}&text=Gostaria de mais informações`,
        );
      })
      .catch(() => {
        Toast.show({
          type: 'error',
          position: 'bottom',
          text2: 'Verifique se o WhatsApp está instalado no seu dispositivo.',
        });
      });
  }, []);
  // END FUNCTION

  return (
    <ContactContainer>
      <Header title="Contato" />

      <ContactContent>
        <ContactButton color="blue" onPress={handleEmail}>
          <ContactIcon>
            <MaterialCommunityIcons
              name="email"
              size={30}
              color={theme.COLORS['white-color']}
            />
          </ContactIcon>

          <ContactText>amip@gmail.com</ContactText>
        </ContactButton>

        <ContactButton color="green" onPress={handleWhatsapp}>
          <ContactIcon>
            <MaterialCommunityIcons
              name="whatsapp"
              size={30}
              color={theme.COLORS['white-color']}
            />
          </ContactIcon>

          <ContactText>(81) 99313-9096</ContactText>
        </ContactButton>
      </ContactContent>
    </ContactContainer>
  );
}
