import React, { useCallback, useState } from 'react';

import { useNavigation } from '@react-navigation/native';

import { Alert, Keyboard, ScrollView } from 'react-native';

import { Feather } from '@expo/vector-icons';

import * as ImagePicker from 'expo-image-picker';

import * as FileSystem from 'expo-file-system';

import { useTheme } from 'styled-components/native';

import { AxiosError } from 'axios';

import Toast from 'react-native-toast-message';

import { api } from '@services/api';

import { useAuth } from '@hooks/auth';

import { noImage } from '@utils/no-image';

import { Header } from '@components/Header';
import { Loading } from '@components/Loading';
import { ChooseTakePhotoModal } from '@components/ChooseTakePhotoModal';

import {
  ProfileAvatarButton,
  ProfileAvatarCamera,
  ProfileAvatarImage,
  ProfileAvatarImageNameContainer,
  ProfileContainer,
  ProfileContent,
  ProfileName,
  ProfileOptionButton,
  ProfileOptionButtonIcon,
  ProfileOptionButtonTitle,
  ProfileOptionsContent,
} from './styles';

export function ProfileScreen() {
  const [openTakePhotoModal, setIsOpenTakePhotoModal] = useState(false);
  const [loadingUpdatePhoto, setIsLoadingUpdatePhoto] = useState(false);

  const { player, updatePlayerProfile, signOut } = useAuth();
  const theme = useTheme();
  const navigation = useNavigation();

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
          signOut();
          navigation.navigate('appBottomTabs');
          // navigation.reset({
          //   routes: [
          //     {
          //       name: 'appBottomTabs',
          //     },
          //   ],
          // });
        },
      },
    ]);
  }, [signOut, navigation]);

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

        const photoInfo = await FileSystem.getInfoAsync(
          photoSelected.assets[0].uri,
        );

        if (photoInfo.exists) {
          if (photoInfo.size) {
            const photoSizeMegabyte = photoInfo.size / 1024 / 1024;

            if (photoSizeMegabyte > 5) {
              return Toast.show({
                type: 'error',
                text2: 'Essa imagem é muito grande. Escolha uma de até 5MB',
                position: 'bottom',
              });
            }
          }
        }

        const fileExtension = photoSelected.assets[0].uri.split('.').pop();

        const photoFile = {
          name: `img_${player.name}.${fileExtension}`.toLowerCase(),
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

        const photoInfo = await FileSystem.getInfoAsync(
          photoSelected.assets[0].uri,
        );

        if (photoInfo.exists) {
          if (photoInfo.size) {
            const photoSizeMegabyte = photoInfo.size / 1024 / 1024;

            if (photoSizeMegabyte > 5) {
              return Toast.show({
                type: 'error',
                text2: 'Essa imagem é muito grande. Escolha uma de até 5MB',
                position: 'bottom',
              });
            }
          }
        }

        const fileExtension = photoSelected.assets[0].uri.split('.').pop();

        const photoFile = {
          name: `img_${player.name}.${fileExtension}`.toLowerCase(),
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

  // END FUNCTIONS

  return (
    <ProfileContainer>
      <Header title="Perfil" />

      <ScrollView style={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <ProfileContent>
          <ProfileAvatarImageNameContainer>
            {player && (
              <>
                <ProfileAvatarButton
                  disabled={loadingUpdatePhoto}
                  onPress={handleToggleTakePhotoModal}
                >
                  {loadingUpdatePhoto ? (
                    <Loading />
                  ) : (
                    <>
                      <ProfileAvatarImage
                        source={{
                          uri: player.avatar_url
                            ? player.avatar_url
                            : noImage(player.name),
                        }}
                        contentFit="cover"
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
              </>
            )}
          </ProfileAvatarImageNameContainer>

          <ProfileOptionsContent>
            {player && (
              <>
                <ProfileOptionButton
                  onPress={() => {
                    navigation.navigate('editProfileInformationScreen');
                  }}
                >
                  <ProfileOptionButtonIcon>
                    <Feather
                      name="refresh-cw"
                      size={27}
                      color={theme.COLORS['black-color']}
                    />
                  </ProfileOptionButtonIcon>

                  <ProfileOptionButtonTitle>
                    Atualizar perfil
                  </ProfileOptionButtonTitle>
                </ProfileOptionButton>

                <ProfileOptionButton
                  onPress={() => {
                    navigation.navigate('editPasswordScreen');
                  }}
                >
                  <ProfileOptionButtonIcon>
                    <Feather
                      name="lock"
                      size={27}
                      color={theme.COLORS['black-color']}
                    />
                  </ProfileOptionButtonIcon>

                  <ProfileOptionButtonTitle>
                    Atualizar senha
                  </ProfileOptionButtonTitle>
                </ProfileOptionButton>
              </>
            )}

            <ProfileOptionButton
              onPress={() => {
                navigation.navigate('contactScreen');
              }}
            >
              <ProfileOptionButtonIcon>
                <Feather
                  name="phone-call"
                  size={27}
                  color={theme.COLORS['black-color']}
                />
              </ProfileOptionButtonIcon>

              <ProfileOptionButtonTitle>Contato</ProfileOptionButtonTitle>
            </ProfileOptionButton>

            {player.id && (
              <ProfileOptionButton onPress={handleSignOut}>
                <ProfileOptionButtonIcon>
                  <Feather
                    name="log-out"
                    size={27}
                    color={theme.COLORS['black-color']}
                  />
                </ProfileOptionButtonIcon>

                <ProfileOptionButtonTitle>
                  Sair da conta
                </ProfileOptionButtonTitle>
              </ProfileOptionButton>
            )}
          </ProfileOptionsContent>
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
