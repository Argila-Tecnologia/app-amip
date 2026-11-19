import {
  ToastConfig,
  SuccessToast,
  ErrorToast,
} from 'react-native-toast-message';

import { RFValue } from '@utils/rf-value';

import theme from '@theme/index';

// NOTE - types of message default: success, error, info
// Import estático (sempre o tema 'light', o export default de '@theme/index')
// é proposital, não um bug: a caixa do toast (SuccessToast/ErrorToast da lib)
// nunca ganhou fundo customizado, então ela permanece sempre clara nos dois
// temas do app - por isso o texto abaixo também fica em 'black-color' fixo,
// e não precisa (nem deve) virar dinâmico com useTheme() enquanto a caixa em
// si não acompanhar o tema.
export const toastConfig: ToastConfig = {
  /*
      Overwrite 'success' type,
      by modifying the existing `BaseToast` component
    */
  success: (props) => (
    <SuccessToast
      {...props}
      // A lib limita "text2" a 1 linha por padrão (BaseToast.js,
      // text2NumberOfLines = 1) e a caixa tem altura fixa (60) - mensagens
      // mais longas (ex: os toasts de erro de login/recuperação de senha)
      // apareciam cortadas com "...". "height: 'auto'" deixa a caixa
      // crescer com o conteúdo em vez de cortar o texto.
      style={{ borderLeftColor: theme.COLORS['success-color'], height: 'auto' }}
      contentContainerStyle={{
        paddingHorizontal: RFValue(15),
        paddingVertical: RFValue(10),
      }}
      text1Style={{
        fontSize: theme.FONT_SIZE.MD,
        fontWeight: 'bold',
      }}
      text2Style={{
        fontSize: theme.FONT_SIZE.SM,
        color: theme.COLORS['black-color'],
      }}
      text2NumberOfLines={3}
    />
  ),
  /*
      Overwrite 'error' type,
      by modifying the existing `ErrorToast` component
    */
  error: (props) => (
    <ErrorToast
      {...props}
      style={{ height: 'auto' }}
      contentContainerStyle={{
        paddingHorizontal: RFValue(15),
        paddingVertical: RFValue(10),
      }}
      text1Style={{
        fontSize: theme.FONT_SIZE.MD,
      }}
      text2Style={{
        fontSize: theme.FONT_SIZE.SM,
        color: theme.COLORS['black-color'],
      }}
      text2NumberOfLines={3}
    />
  ),
};
