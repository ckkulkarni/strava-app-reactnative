import React from 'react';
import {render, fireEvent, waitFor, act} from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import Details from '../src/screens/Details';
import http from '../src/api/http';
import {AxiosResponse} from 'axios';
const navigation = useNavigation<NativeStackNavigationProp<any>>();
jest.mock('../src/api/http');
jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn().mockReturnValue({
    navigate: jest.fn(),
  }),
  useFocusEffect: jest.fn().mockImplementation(callback => {
    callback();
  }),
  useIsFocused: jest.fn().mockImplementation(() => true),
}));
jest.mock('react-native-app-auth', () => ({
  authorize: jest.fn(),
}));

describe('Activities Screen', () => {
  let screen: any;
  const data = [
    {
      id: 1,
      name: 'Activity 1',
      distance: 10,
      average_speed: 5,
      type: 'run',
      max_speed: 12,
      hasHeartRate: true,
      heart_rate: 120,
    },
    {
      id: 2,
      name: 'Activity 2',
      distance: 20,
      average_speed: 15,
      type: 'bike',
      max_speed: 23,
      hasHeartRate: false,
    },
  ];

  beforeEach(async () => {
    (http.get as jest.Mock).mockResolvedValue({
      data: data,
    } as AxiosResponse);
    (AsyncStorage.setItem as jest.Mock).mockResolvedValueOnce(null);
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue('mock-token');
    screen = render(<Details />);
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Activities page renders correctly', async () => {
    expect(screen).toBeDefined();
  });
  it('Data is fetched from API', async () => {
    await waitFor(() => {
      expect(http.get).toHaveBeenCalled();
      screen.debug();
    });
  });
  it('List is rendered correctly', async () => {
    await waitFor(() => {
      const list = screen.getByTestId('activity-list');
      expect(list).toBeDefined();
    });
  });
  it('Activity 1 details are rendered correctly', async () => {
    await waitFor(() => {
      const activityName = screen.getByText('Activity 1');
      expect(activityName).toBeDefined();
      const distanceLabel = screen.getAllByText('Distance:')[0];

      expect(distanceLabel).toBeDefined();
      const distanceValue = screen.getByText('10 miles');
      expect(distanceValue).toBeDefined();

      const averageSpeedLabel = screen.getAllByText('Average Speed:')[0];
      expect(averageSpeedLabel).toBeDefined();
      const averageSpeedValue = screen.getByText('5 mph');
      expect(averageSpeedValue).toBeDefined();
      const activityTypeLabel = screen.getAllByText('Activity Type:')[0];

      expect(activityTypeLabel).toBeDefined();
      const activityTypeValue = screen.getByText('run');
      expect(activityTypeValue).toBeDefined();

      const maxSpeedLabel = screen.getAllByText('Max Speed:')[0];
      expect(maxSpeedLabel).toBeDefined();
      const maxSpeedValue = screen.getByText('12 mph');
      expect(maxSpeedValue).toBeDefined();

      const heartRateLabel = screen.getAllByText('Heart Rate:')[0];
      expect(heartRateLabel).toBeDefined();
      const heartRateValue = screen.getByText('120 bpm');
      expect(heartRateValue).toBeDefined();
    });
  });

  it('Activity 2 details are rendered correctly', async () => {
    await waitFor(() => {
      const activityName = screen.getByText('Activity 2');
      expect(activityName).toBeDefined();
      const distanceLabel = screen.getAllByText('Distance:')[1];
      expect(distanceLabel).toBeDefined();
      const distanceValue = screen.getByText('20 miles');
      expect(distanceValue).toBeDefined();
      const averageSpeedLabel = screen.getAllByText('Average Speed:')[1];
      expect(averageSpeedLabel).toBeDefined();
      const averageSpeedValue = screen.getByText('15 mph');
      expect(averageSpeedValue).toBeDefined();
      const activityTypeLabel = screen.getAllByText('Activity Type:')[1];
      expect(activityTypeLabel).toBeDefined();
      const activityTypeValue = screen.getByText('bike');
      expect(activityTypeValue).toBeDefined();
      const maxSpeedLabel = screen.getAllByText('Max Speed:')[1];
      expect(maxSpeedLabel).toBeDefined();
      const maxSpeedValue = screen.getByText('23 mph');
      expect(maxSpeedValue).toBeDefined();
      const heartRateLabel = screen.getAllByText('Heart Rate:')[1];
      expect(heartRateLabel).toBeDefined();
      const heartRateValue = screen.getByText('Not Logged');
      expect(heartRateValue).toBeDefined();
    });
  });
  it('Clicking on logout button logs the user out of the app', async () => {
    const logoutButton = screen.getByTestId('logout-button');
    act(() => {
      fireEvent.press(logoutButton);
    });
    await waitFor(() => {
      expect(AsyncStorage.removeItem).toHaveBeenCalledWith('token');
    });
    await waitFor(() => {
      expect(navigation.navigate).toHaveBeenCalledWith('Home');
    });
  });
  it('Clicking on Create Activity button takes the user to the activity creation screen', async () => {
    const createButton = screen.getByTestId('create-button');
    act(() => {
      fireEvent.press(createButton);
    });
    await waitFor(() => {
      expect(navigation.navigate).toHaveBeenCalledWith('Create');
    });
  });
});
