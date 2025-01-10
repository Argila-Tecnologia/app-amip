import {
  ToastConfig,
  SuccessToast,
  ErrorToast,
} from 'react-native-toast-message';

import { RFValue } from 'react-native-responsive-fontsize';

import theme from '@theme/index';

// NOTE - types of message default: success, error, info
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
