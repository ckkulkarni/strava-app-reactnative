import React from 'react';
import {render, fireEvent, waitFor, act} from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import Details from '../src/screens/Details';
import http from '../src/api/http';
import {AxiosResponse} from 'axios';
import CreateActivity from '../src/screens/CreateActivity';
import {PaperProvider} from 'react-native-paper';
jest.useFakeTimers();

const navigation = useNavigation<NativeStackNavigationProp<any>>();
jest.mock('../src/api/http', () => {
  return {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
  };
});
jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn().mockReturnValue({
    navigate: jest.fn(),
  }),
}));

describe('Activities Screen', () => {
  let screen: any;
  beforeEach(async () => {
    (AsyncStorage.setItem as jest.Mock).mockResolvedValueOnce(null);
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue('token');
    screen = render(
      <PaperProvider>
        <CreateActivity />
      </PaperProvider>,
    );
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Create Activity page renders correctly', () => {
    expect(screen).toBeDefined();
  });
  it('changes name input', () => {
    const nameInput = screen.getByTestId('activity-name');
    act(() => {
      fireEvent.changeText(nameInput, 'New Activity');
    });
    expect(nameInput.props.value).toBe('New Activity');
  });

  it('changes type dropdown', async () => {
    const typeDropdown = screen.getByTestId('activity-type');
    act(() => {
      fireEvent.press(typeDropdown);
    });
    const option = await waitFor(() => screen.findByText('Run'));
    act(() => {
      fireEvent.press(option);
    });
  });

  it('changes start date input', () => {
    const startDateInput = screen.getByTestId('activity-start-date');
    act(() => {
      fireEvent.changeText(startDateInput, '2022-01-01');
    });
    expect(startDateInput.props.value).toBe('2022-01-01');
  });

  it('changes elapsed time input', () => {
    const elapsedTimeInput = screen.getByTestId('activity-elapsed-time');
    act(() => {
      fireEvent.changeText(elapsedTimeInput, '2');
    });
    expect(elapsedTimeInput.props.value).toBe('2');
  });

  it('changes description input', () => {
    const descriptionInput = screen.getByTestId('activity-description');
    act(() => {
      fireEvent.changeText(descriptionInput, 'This is a new activity');
    });
    expect(descriptionInput.props.value).toBe('This is a new activity');
  });

  it('changes distance input', () => {
    const distanceInput = screen.getByTestId('activity-distance');
    act(() => {
      fireEvent.changeText(distanceInput, '10');
    });
    expect(distanceInput.props.value).toBe('10');
  });

  it('toggles trainer switch', () => {
    const trainerSwitch = screen.getByTestId('activity-trainer');
    act(() => {
      fireEvent(trainerSwitch, 'onValueChange', true);
    });
    expect(trainerSwitch.props.value).toBe(true);
  });

  it('toggles commute switch', () => {
    const commuteSwitch = screen.getByTestId('activity-commute');
    act(() => {
      fireEvent(commuteSwitch, 'onValueChange', true);
    });
    expect(commuteSwitch.props.value).toBe(true);
  });

  it('submits form', async () => {
    const nameInput = screen.getByTestId('activity-name');
    const typeDropdown = screen.getByTestId('activity-type');
    const startDateInput = screen.getByTestId('activity-start-date');
    const elapsedTimeInput = screen.getByTestId('activity-elapsed-time');
    const descriptionInput = screen.getByTestId('activity-description');
    const distanceInput = screen.getByTestId('activity-distance');
    const trainerSwitch = screen.getByTestId('activity-trainer');
    const commuteSwitch = screen.getByTestId('activity-commute');
    const submitButton = screen.getByTestId('submit-button');

    act(() => {
      fireEvent.changeText(nameInput, 'New Activity');
      fireEvent.press(typeDropdown);
    });
    const option = await waitFor(() => screen.findByText('Run'));
    act(() => {
      fireEvent.press(option);
    });
    act(() => {
      fireEvent.changeText(startDateInput, '2022-01-01');
      fireEvent.changeText(elapsedTimeInput, '2');
      fireEvent.changeText(descriptionInput, 'This is a new activity');
      fireEvent.changeText(distanceInput, '10');
      fireEvent(trainerSwitch, 'onValueChange', true);
      fireEvent(commuteSwitch, 'onValueChange', true);
    });
    await act(() => {
      fireEvent.press(submitButton);
    });
    await waitFor(() => {
      expect(http.post).toHaveBeenCalledWith(
        '/activities',
        {
          commute: true,
          description: 'This is a new activity',
          distance: '10',
          elapsed_time: '2',
          name: 'New Activity',
          start_date_local: '2022-01-01',
          trainer: true,
          type: 'Run',
        },
        {
          headers: {Authorization: 'Bearer token'},
        },
      );
    });
  });
});
