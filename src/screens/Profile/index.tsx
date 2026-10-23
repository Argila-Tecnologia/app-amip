import React, { useCallback, useState } from 'react';

import { useNavigation } from '@react-navigation/native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Alert, Keyboard, Platform, ScrollView } from 'react-native';

import { Feather } from '@expo/vector-icons';

import * as ImagePicker from 'expo-image-picker';

import { File } from 'expo-file-system';

import { useTheme } from 'styled-components/native';

import { AxiosError } from 'axios';

import Toast from 'react-native-toast-message';

import { api } from '@services/api';

import { useAuth } from '@hooks/auth';

import { Loading } from '@components/Loading';
import { ChooseTakePhotoModal } from '@components/ChooseTakePhotoModal';

import {
  ProfileAvatarButton,
  ProfileAvatarCamera,
  ProfileAvatarImage,
  ProfileAvatarImageNameContainer,
  ProfileContainer,
  ProfileContent,
  ProfileHeader,
  ProfileHeaderLogoutButton,
  ProfileHeaderLogoutContainer,
  ProfileHeaderTitle,
  ProfileHeaderTitleContainer,
  ProfileName,
  ProfileOptionButton,
  ProfileOptionButtonIcon,
  ProfileOptionButtonTitle,
  ProfileOptionsCard,
  ProfileOptionsContent,
  ProfileRemoveAccountButton,
  ProfileRemoveAccountText,
} from './styles';

// Usado só pro nome do arquivo de avatar enviado ao servidor (não pra
// exibição) - espaços e acentos no nome do atleta (ex: "Lubnnia Morais",
// "João Paulo") acabavam virando sequências como "%20"/"%C3%A3" *literais*
// no nome salvo em disco (a camada de multipart/form-data do React Native
// percent-encoda o filename do Content-Disposition antes de enviar, e o
// servidor nunca decodifica de volta ao salvar). Depois, ao montar a URL
// pra exibir a foto, o Express decodifica esses "%XX" de volta durante o
// lookup do arquivo estático - como o arquivo real no disco tem os "%XX"
// literais no nome, a busca sempre dava 404: o upload "funcionava"
// (POST/PATCH 200, toast de sucesso), mas a foto nunca aparecia depois.
// Substituir qualquer caractere fora de a-z/0-9 por "_" evita esse
// descompasso de codificação inteiramente, pra qualquer nome.
function sanitizeFilename(name: string): string {
  return name.replace(/[^a-zA-Z0-9]+/g, '_');
}

export function ProfileScreen() {
  const [openTakePhotoModal, setIsOpenTakePhotoModal] = useState(false);
  const [loadingUpdatePhoto, setIsLoadingUpdatePhoto] = useState(false);

  const { player, updatePlayerProfile, signOut } = useAuth();
  const theme = useTheme();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const paddingTop =
    Platform.OS === 'android' ? insets.top + 20 : insets.top + 10;

  // FUNCTIONS
  const handleToggleTakePhotoModal = useCallback(() => {
    Keyboard.dismiss();

    setIsOpenTakePhotoModal((oldState) => !oldState);
  }, []);

  const handleSignOut = useCallback(() => {
    Alert.alert('Equipe AMIP', 'Deseja fazer o logout da aplicação?', [
      {
        text: 'Não',
        style: 'cancel',
        onPress: () => null,
      },
      {
        text: 'Sim',
        style: 'default',
        onPress: () => {
          // Não precisa mais navegar manualmente daqui pra appBottomTabs -
          // "profileScreen" é uma das PRIVATE_SCREEN_NAMES que
          // src/routes/index.tsx já observa: assim que "player.id" fica
          // vazio (signOut), aquele efeito detecta que a rota atual é
          // privada e reseta sozinho pra appBottomTabs. Antes de Perfil
          // virar aba, chamar navigation.navigate('appBottomTabs') aqui
          // funcionava (empilhava de volta pra uma rota irmã já existente);
          // agora que Perfil é uma aba DENTRO de appBottomTabs, chamar isso
          // por conta própria daqui de dentro não teria como garantir que
          // volta pra aba inicial (Notícias) - o reset (index 0) do efeito
          // em routes/index.tsx é o jeito confiável de fazer isso.
          signOut();
        },
      },
    ]);
  }, [signOut]);

  // UPDATE PHOTO
  const handleTakePhotoCamera = useCallback(async () => {
    try {
      setIsLoadingUpdatePhoto(true);

      const photoSelected = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        quality: 1,
        allowsEditing: true,
      });

      if (photoSelected.canceled) {
        handleToggleTakePhotoModal();

        return;
      }

      if (photoSelected.assets[0].uri) {
        handleToggleTakePhotoModal();

        // `FileSystem.getInfoAsync` (import de 'expo-file-system') foi
        // removido do pacote principal a partir da migração pro SDK 57 -
        // virou um stub que sempre lança em runtime (o método real agora
        // vive só em 'expo-file-system/legacy'). A classe `File` é a API
        // nova recomendada pelo Expo: "exists"/"size" são propriedades
        // síncronas, não precisam de await.
        const photoFileInfo = new File(photoSelected.assets[0].uri);

        if (photoFileInfo.exists) {
          const photoSizeMegabyte = photoFileInfo.size / 1024 / 1024;

          if (photoSizeMegabyte > 5) {
            return Toast.show({
              type: 'error',
              text2: 'Essa imagem é muito grande. Escolha uma de até 5MB',
              position: 'bottom',
            });
          }
        }

        const fileExtension = photoSelected.assets[0].uri.split('.').pop();

        const photoFile = {
          name: `img_${sanitizeFilename(player.name)}.${fileExtension}`.toLowerCase(),
          uri: photoSelected.assets[0].uri,
          type: `${photoSelected.assets[0].type}/${fileExtension}`,
        } as any;

        const playerPhotoUploadForm = new FormData();

        playerPhotoUploadForm.append('avatar', photoFile);

        const avatarUpdateResponse = await api.patch(
          '/players/update/avatar',
          playerPhotoUploadForm,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          },
        );

        if (avatarUpdateResponse.status === 200) {
          const playerUpdated = avatarUpdateResponse.data;

          await updatePlayerProfile(playerUpdated);

          Toast.show({
            type: 'success',
            text2: 'Foto atualizada',
            position: 'bottom',
          });
        }
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response) {
          Toast.show({
            type: 'error',
            position: 'bottom',
            text1: 'Equipe AMIP',
            text2: 'Não foi possível atualizar a foto!',
          });

          return;
        }
      }

      Toast.show({
        type: 'error',
        position: 'bottom',
        text1: 'Equipe AMIP',
        text2: 'Não foi possível atualizar a foto!',
      });
    } finally {
      setIsLoadingUpdatePhoto(false);
    }
  }, [handleToggleTakePhotoModal, player, updatePlayerProfile]);

  const handleTakePhotoGallery = useCallback(async () => {
    try {
      setIsLoadingUpdatePhoto(true);

      const photoSelected = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        quality: 1,
        allowsEditing: true,
      });

      if (photoSelected.canceled) {
        handleToggleTakePhotoModal();

        return;
      }

      if (photoSelected.assets[0].uri) {
        handleToggleTakePhotoModal();

        // Ver handleTakePhotoCamera acima pro porquê de "File" em vez de
        // "FileSystem.getInfoAsync".
        const photoFileInfo = new File(photoSelected.assets[0].uri);

        if (photoFileInfo.exists) {
          const photoSizeMegabyte = photoFileInfo.size / 1024 / 1024;

          if (photoSizeMegabyte > 5) {
            return Toast.show({
              type: 'error',
              text2: 'Essa imagem é muito grande. Escolha uma de até 5MB',
              position: 'bottom',
            });
          }
        }

        const fileExtension = photoSelected.assets[0].uri.split('.').pop();

        const photoFile = {
          name: `img_${sanitizeFilename(player.name)}.${fileExtension}`.toLowerCase(),
          uri: photoSelected.assets[0].uri,
          type: `${photoSelected.assets[0].type}/${fileExtension}`,
        } as any;

        const playerPhotoUploadForm = new FormData();

        playerPhotoUploadForm.append('avatar', photoFile);

        const avatarUpdateResponse = await api.patch(
          '/players/update/avatar',
          playerPhotoUploadForm,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          },
        );

        if (avatarUpdateResponse.status === 200) {
          const playerUpdated = avatarUpdateResponse.data;

          await updatePlayerProfile(playerUpdated);

          Toast.show({
            type: 'success',
            text2: 'Foto atualizada',
            position: 'bottom',
          });
        }
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response) {
          Toast.show({
            type: 'error',
            position: 'bottom',
            text1: 'Equipe AMIP',
            text2: 'Não foi possível atualizar a foto!',
          });

          return;
        }
      }

      Toast.show({
        type: 'error',
        position: 'bottom',
        text1: 'Equipe AMIP',
        text2: 'Não foi possível atualizar a foto!',
      });
    } finally {
      setIsLoadingUpdatePhoto(false);
    }
  }, [handleToggleTakePhotoModal, player, updatePlayerProfile]);
  // END UPDATE PHOTO

  // REMOVE ACCOUNT
  const handleRemoveAccount = useCallback(() => {
    navigation.navigate('deleteProfileScreen');
  }, [navigation]);
  // END REMOVE ACCOUNT

  // END FUNCTIONS

  return (
    <ProfileContainer>
      <ProfileHeader style={{ paddingTop }}>
        <ProfileHeaderTitleContainer>
          <ProfileHeaderTitle>Perfil</ProfileHeaderTitle>
        </ProfileHeaderTitleContainer>

        <ProfileHeaderLogoutContainer>
          <ProfileHeaderLogoutButton
            activeOpacity={0.7}
            onPress={handleSignOut}
          >
            <Feather
              name="log-out"
              size={25}
              color={theme.COLORS['white-color']}
            />
          </ProfileHeaderLogoutButton>
        </ProfileHeaderLogoutContainer>
      </ProfileHeader>

      <ScrollView style={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <ProfileContent>
          <ProfileAvatarImageNameContainer>
            <ProfileAvatarButton
              disabled={loadingUpdatePhoto}
              onPress={handleToggleTakePhotoModal}
            >
              {loadingUpdatePhoto ? (
                <Loading />
              ) : (
                <>
                  {/*
                    FallbackImage cobre tanto "sem avatar" quanto "avatar
                    falhou ao carregar" - passando "name", o fallback
                    mostra as iniciais do atleta (ex: "João Paulo" -> "JP")
                    em vez da logo da AMIP, já que aqui tem um nome pra
                    derivar delas (diferente de News/Championships/Museum,
                    que são imagem de conteúdo, não de pessoa).
                    initialsBackgroundColor/initialsTextColor: navy/branco
                    fixos, igual ao header - acento de marca que não muda
                    com o tema (ver FallbackImage/index.tsx).
                  */}
                  <ProfileAvatarImage
                    source={{ uri: player.avatar_url }}
                    name={player.name}
                    contentFit="cover"
                    initialsBackgroundColor={theme.COLORS['blue-dark-color']}
                    initialsTextColor={theme.COLORS['white-color']}
                  />

                  <ProfileAvatarCamera>
                    <Feather
                      name="camera"
                      size={24}
                      color={theme.COLORS['white-color']}
                    />
                  </ProfileAvatarCamera>
                </>
              )}
            </ProfileAvatarButton>

            <ProfileName>{player.name}</ProfileName>
          </ProfileAvatarImageNameContainer>

          <ProfileOptionsContent>
            <ProfileOptionsCard>
              <ProfileOptionButton
                onPress={() => {
                  navigation.navigate('editProfileInformationScreen');
                }}
              >
                <ProfileOptionButtonIcon
                  $tintColor={`${theme.COLORS['blue-dark-color']}1a`}
                >
                  <Feather
                    name="refresh-cw"
                    size={18}
                    color={theme.COLORS['blue-dark-color']}
                  />
                </ProfileOptionButtonIcon>

                <ProfileOptionButtonTitle>
                  Atualizar perfil
                </ProfileOptionButtonTitle>
              </ProfileOptionButton>

              <ProfileOptionButton
                onPress={() => {
                  navigation.navigate('myChargesScreen');
                }}
              >
                <ProfileOptionButtonIcon
                  $tintColor={`${theme.COLORS['green-color']}33`}
                >
                  <Feather
                    name="file-text"
                    size={18}
                    color={theme.COLORS['green-color']}
                  />
                </ProfileOptionButtonIcon>

                <ProfileOptionButtonTitle $bold>
                  Faturas
                </ProfileOptionButtonTitle>
              </ProfileOptionButton>

              {/*
                Conta vinculada a login via Google não tem senha de verdade
                pra trocar (o backend já rejeita a troca em
                UpdatePlayerPasswordUseCase/ResetPlayerPasswordUseCase/
                SendForgotPasswordEmailUseCase) - escondida aqui pra não
                oferecer uma opção que sempre daria erro.
              */}
              {!player.google_id && (
                <ProfileOptionButton
                  onPress={() => {
                    navigation.navigate('editPasswordScreen');
                  }}
                >
                  <ProfileOptionButtonIcon
                    $tintColor={`${theme.COLORS['blue-dark-color']}1a`}
                  >
                    <Feather
                      name="lock"
                      size={18}
                      color={theme.COLORS['blue-dark-color']}
                    />
                  </ProfileOptionButtonIcon>

                  <ProfileOptionButtonTitle>
                    Atualizar senha
                  </ProfileOptionButtonTitle>
                </ProfileOptionButton>
              )}

              <ProfileOptionButton
                onPress={() => {
                  navigation.navigate('contactScreen');
                }}
              >
                <ProfileOptionButtonIcon
                  $tintColor={`${theme.COLORS['blue-dark-color']}1a`}
                >
                  <Feather
                    name="phone-call"
                    size={18}
                    color={theme.COLORS['blue-dark-color']}
                  />
                </ProfileOptionButtonIcon>

                <ProfileOptionButtonTitle>Contato</ProfileOptionButtonTitle>
              </ProfileOptionButton>
            </ProfileOptionsCard>
          </ProfileOptionsContent>

          <ProfileRemoveAccountButton
            activeOpacity={0.7}
            onPress={handleRemoveAccount}
          >
            <ProfileRemoveAccountText>Remover conta</ProfileRemoveAccountText>
          </ProfileRemoveAccountButton>
        </ProfileContent>
      </ScrollView>

      {/* MODALS */}

      <ChooseTakePhotoModal
        isOpenModal={openTakePhotoModal}
        onCloseModal={handleToggleTakePhotoModal}
        onTakePhotoCamera={handleTakePhotoCamera}
        onTakePhotoGallery={handleTakePhotoGallery}
      />
    </ProfileContainer>
  );
}
