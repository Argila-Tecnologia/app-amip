import AsyncStorage from '@react-native-async-storage/async-storage';

import { IPlayerDTO } from '@dtos/player-dto';

import { PLAYER_STORAGE } from './storage-config';

export async function playerAddStorage(player: IPlayerDTO): Promise<void> {
  await AsyncStorage.setItem(PLAYER_STORAGE, JSON.stringify(player));
}

export async function playerGetStorage(): Promise<IPlayerDTO> {
  const storage = await AsyncStorage.getItem(PLAYER_STORAGE);

  const player: IPlayerDTO = storage ? JSON.parse(storage) : {};

  return player;
}

export async function playerRemoveStorage(): Promise<void> {
  await AsyncStorage.removeItem(PLAYER_STORAGE);
}
