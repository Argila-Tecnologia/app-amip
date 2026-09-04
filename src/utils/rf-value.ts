import { Dimensions, Platform, StatusBar } from 'react-native';

// Reimplementação local do `RFValue` de `react-native-responsive-fontsize`
// (removida por estar sem manutenção e não testada na New Architecture, ver
// achado do `expo-doctor`). A fórmula é pequena o suficiente pra manter aqui
// em vez de trocar por outra dependência externa. Mantida byte-a-byte igual
// ao original (incluindo a lista fixa de alturas de iPhone X-style, copiada
// de `react-native-iphone-x-helper`) pra não mudar nenhum tamanho de fonte
// já calibrado nas telas existentes. Única diferença proposital: o original
// checava `Platform.isTVOS`, que não existe na API atual do RN (`tsc`
// acusou o erro) - trocado por `Platform.isTV`, que é o que a checagem
// claramente pretendia fazer.
function isIphoneXStyle(): boolean {
  const { height, width } = Dimensions.get('window');

  return (
    Platform.OS === 'ios' &&
    !Platform.isPad &&
    !Platform.isTV &&
    (height === 780 ||
      width === 780 ||
      height === 812 ||
      width === 812 ||
      height === 844 ||
      width === 844 ||
      height === 896 ||
      width === 896 ||
      height === 926 ||
      width === 926)
  );
}

// Guideline height para um device padrão de 5", igual ao default original.
export function RFValue(fontSize: number, standardScreenHeight = 680): number {
  const { height, width } = Dimensions.get('window');
  const standardLength = width > height ? width : height;
  const offset =
    width > height ? 0 : Platform.OS === 'ios' ? 78 : (StatusBar.currentHeight as number);

  const deviceHeight =
    isIphoneXStyle() || Platform.OS === 'android' ? standardLength - offset : standardLength;

  const heightPercent = (fontSize * deviceHeight) / standardScreenHeight;
  return Math.round(heightPercent);
}
