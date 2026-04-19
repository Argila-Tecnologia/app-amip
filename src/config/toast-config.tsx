import {
  ToastConfig,
  SuccessToast,
  ErrorToast,
} from 'react-native-toast-message';

import { scale, moderateScale } from 'react-native-size-matters';

import theme from '@theme/index';

export const toastConfig: ToastConfig = {
  success: (props) => (
    <SuccessToast
      {...props}
      style={{ borderLeftColor: theme.COLORS['success-color'] }}
      contentContainerStyle={{ paddingHorizontal: scale(15) }}
      text1Style={{
        fontSize: moderateScale(theme.FONT_SIZE.MD),
        fontWeight: 'bold',
      }}
      text2Style={{
        fontSize: moderateScale(theme.FONT_SIZE.SM),
        color: theme.COLORS['black-color'],
      }}
    />
  ),

  error: (props) => (
    <ErrorToast
      {...props}
      contentContainerStyle={{ paddingHorizontal: scale(15) }}
      text1Style={{
        fontSize: moderateScale(theme.FONT_SIZE.MD),
      }}
      text2Style={{
        fontSize: moderateScale(theme.FONT_SIZE.SM),
        color: theme.COLORS['black-color'],
      }}
    />
  ),
};
