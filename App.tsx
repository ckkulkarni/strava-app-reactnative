import React from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import HomeScreen from './src/screens/HomeScreen';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import {
  DefaultTheme,
  PaperProvider,
  Provider as RNPProvider,
} from 'react-native-paper';
import {createStackNavigator} from '@react-navigation/stack';
import {Provider} from 'react-redux';
import {store} from './src/redux/store';
import Colors from './src/theme/theme';
import Details from './src/screens/Details';
import CreateActivity from './src/screens/CreateActivity';
import FlashMessage from 'react-native-flash-message';
const Stack = createStackNavigator();

const config = {
  screens: {
    Home: {
      path: 'Home',
      parse: {
        code: (code: string) => `${code}`,
      },
    },
    Activities: 'Activities',
    Redirect: {
      path: 'Redirect',
      parse: {
        code: (code: string) => `${code}`,
      },
    },
    Create: 'Create Activity',
  },
};

const linking = {
  prefixes: ['stravaapp://'],
  config,
};

function App(): React.JSX.Element {
  const theme = {
    ...DefaultTheme,
    roundness: 2,
    colors: {
      primary: Colors.primary,
      secondary: Colors.secondary,
      tertiary: Colors.tertiary,
    },
    accent: '#f1c40f',
  };
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <RNPProvider theme={theme}>
        <PaperProvider>
          <SafeAreaProvider>
            <Provider store={store}>
              <NavigationContainer linking={linking}>
                <Stack.Navigator
                  screenOptions={{
                    cardStyle: {
                      backgroundColor: Colors.background,
                    },
                  }}>
                  <Stack.Screen name="Home" component={HomeScreen} />
                  <Stack.Screen name="Activities" component={Details} />
                  <Stack.Screen name="Create" component={CreateActivity} />
                </Stack.Navigator>
              </NavigationContainer>
              <FlashMessage position="top" />
            </Provider>
          </SafeAreaProvider>
        </PaperProvider>
      </RNPProvider>
    </GestureHandlerRootView>
  );
}

export default App;
