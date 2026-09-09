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
      style={{ borderLeftColor: theme.COLORS['success-color'] }}
      contentContainerStyle={{ paddingHorizontal: RFValue(15) }}
      text1Style={{
        fontSize: theme.FONT_SIZE.MD,
        fontWeight: 'bold',
      }}
      text2Style={{
        fontSize: theme.FONT_SIZE.SM,
        color: theme.COLORS['black-color'],
      }}
    />
  ),
  /*
      Overwrite 'error' type,
      by modifying the existing `ErrorToast` component
    */
  error: (props) => (
    <ErrorToast
      {...props}
      contentContainerStyle={{ paddingHorizontal: RFValue(15) }}
      text1Style={{
        fontSize: theme.FONT_SIZE.MD,
      }}
      text2Style={{
        fontSize: theme.FONT_SIZE.SM,
        color: theme.COLORS['black-color'],
      }}
    />
  ),
};
