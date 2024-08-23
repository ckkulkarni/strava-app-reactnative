import React from 'react';
import {render, fireEvent, waitFor, act} from '@testing-library/react-native';
import {authorize} from 'react-native-app-auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import HomeScreen from '../src/screens/HomeScreen';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
const navigation = useNavigation<NativeStackNavigationProp<any>>();
jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn().mockReturnValue({
    navigate: jest.fn(),
  }),
  useFocusEffect: jest.fn().mockImplementation(callback => callback()),
}));
jest.mock('react-native-app-auth', () => ({
  authorize: jest.fn(),
}));

describe('HomeScreen', () => {
  let screen: any;
  beforeEach(async () => {
    screen = render(<HomeScreen />);
    await waitFor(() => screen);
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Home page renders correctly', () => {
    expect(screen).toBeDefined();
  });
  it("If there is no token in the async storage, then we see the 'Login with Strava' Button", async () => {
    jest.mock('@react-native-async-storage/async-storage', () => ({
      setItem: jest.fn(),
      getItem: jest.fn().mockResolvedValue(null),
    }));
    await AsyncStorage.getItem('token');
    await waitFor(() => {
      const loginButton = screen.getByTestId('login-button');
      expect(loginButton).toBeDefined();
    });
  });
  it('Clicking on the login with strava button should redirect us to the login page', async () => {
    const loginButton = screen.getByTestId('login-button');
    fireEvent.press(loginButton);
    await waitFor(() => {
      expect(authorize).toHaveBeenCalled();
    });
  });
  it('If there is a token in the async storage, then we navigate to the Activities screen', async () => {
    (AsyncStorage.setItem as jest.Mock).mockResolvedValueOnce(null);
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue('mock-token');

    await waitFor(async () => {
      expect(AsyncStorage.getItem).toHaveBeenCalledWith('token');
      const token = await AsyncStorage.getItem('token');
    });
    await act(async () => {
      screen.rerender(<HomeScreen />);
    });
    await waitFor(() => {
      expect(navigation.navigate).toHaveBeenCalledWith('Activities');
    });
  });
});
