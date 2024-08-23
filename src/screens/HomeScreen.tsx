import {StyleSheet, View} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useDispatch, useSelector} from 'react-redux';
import {ActivityIndicator, Button} from 'react-native-paper';
import {authorize} from 'react-native-app-auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const config = {
  clientId: '112167',
  clientSecret: '40439ca18199e95fd3ad4370d1e03599a593dc9e',
  redirectUrl: 'stravaapp://mystravaapp.com',
  serviceConfiguration: {
    authorizationEndpoint: 'https://www.strava.com/oauth/mobile/authorize',
    tokenEndpoint:
      'https://www.strava.com/oauth/token?client_id=112167&client_secret=40439ca18199e95fd3ad4370d1e03599a593dc9e',
  },
  scopes: ['activity:read_all,activity:write'],
};

const HomeScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const [loading, setLoading] = useState(true);

  const handleLoginClick = async () => {
    try {
      setLoading(true);
      const res: any = await authorize(config);
      const token = res?.accessToken;
      if (token) {
        await AsyncStorage.setItem('token', token);
        navigation.navigate('Activities');
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      const getAccessToken = async () => {
        try {
          const token = await AsyncStorage.getItem('token');
          if (token) {
            navigation.navigate('Activities');
          }
        } catch (err) {
          console.log(err);
        } finally {
          setLoading(false);
        }
      };
      getAccessToken();
      return () => {
        setLoading(true);
      };
    }, [navigation]),
  );
  // useEffect(() => {
  //   const getAccessToken = async () => {
  //     try {
  //       setLoading(true);
  //       const token = await AsyncStorage.getItem('token');
  //       if (token) {
  //         navigation.navigate('Activities');
  //       }
  //     } catch (err) {
  //       console.log(err);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   getAccessToken();
  // }, []);

  return !loading ? (
    <>
      <View style={styles.baseStyle}>
        <View style={styles.buttonStyle}>
          <Button
            testID="login-button"
            mode="contained"
            labelStyle={{color: 'white'}}
            onPress={handleLoginClick}
            disabled={loading}>
            Login With Strava
          </Button>
        </View>
      </View>
    </>
  ) : (
    <View style={styles.baseStyle}>
      <ActivityIndicator size={'large'} color="blue" />
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  baseStyle: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonStyle: {
    display: 'flex',
    flexDirection: 'row',
  },
});
