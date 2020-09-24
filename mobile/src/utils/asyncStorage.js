import AsyncStorage from '@react-native-community/async-storage';

const JWT_KEY = '@changeMeThanks';

export const getAsyncStorageJwt = async () => {
  try {
    const tokens = await AsyncStorage.getItem(JWT_KEY)
    console.log('here they are: ', tokens);
    return tokens != null ? JSON.parse(tokens) : null;
  } catch(e) {
    // error reading value
    console.log(e);
    return null
  }
}

export const setAsyncStorageJwt = async (tokens) => {
   try {
    const jsonValue = JSON.stringify(tokens)
    await AsyncStorage.setItem(JWT_KEY, jsonValue)
  } catch (e) {
    console.log(e)
    // saving error
  }
}

export const removeAsyncStorageJwt = async () => {
   try {
    await AsyncStorage.removeItem(JWT_KEY)
  } catch (e) {
    // saving error
  }
}