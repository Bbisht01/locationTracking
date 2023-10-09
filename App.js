/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable no-alert */
import {View, Button, Switch} from 'react-native';
import React, {useEffect, useState} from 'react';
import Map from './src/MapView';
import {PermissionsAndroid} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import PastLocations from './src/PastLocations';
// import Geolocation from '@react-native-community/geolocation';

// import AsyncStorage from '@react-native-async-storage/async-storage'

const Stack = createStackNavigator();
export default function App() {
  // console.log('locationEnabled', AsyncStorage.getItem('locationEnabled'))
  const [isEnabled, setIsEnabled] = useState(false);

  // AsyncStorage.getItem('locationEnabled') == 'false' ||
  // AsyncStorage.getItem('locationEnabled') == ''
  // ? false
  // : true,
  // Geolocation.setRNConfiguration({
  // authorizationLevel: 'always', // Request "always" location permission
  // skipPermissionRequests: false, // Prompt for permission if not granted
  // })

  useEffect(() => {
    if (isEnabled) {
      // console.log('isEnabled', isEnabled)
      requestLocationPermission();
    } else {
      alert('Stopped sharing your location');
    }
  }, [isEnabled]);

  const requestLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'locationFinder App',
          message: 'locationFinder App access to your location ',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can use the location');
        alert('Now using your location in background');
      } else {
        // getting;
        console.log('location permission denied');
        alert('Location permission denied');
      }
    } catch (err) {
      console.log(err);
    }
  };

  const toggleSwitch = () => {
    setIsEnabled(previousState => !previousState);
    // console.log('isEnabled', !isEnabled, isEnabled)
    // AsyncStorage.setItem('locationEnabled', !isEnabled ? 'true' : 'false')
  };

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="MapView">
        <Stack.Screen
          name="MapView"
          component={Map}
          options={{
            // title: 'Map View',
            title: '',
            headerLeft: () => (
              <Switch
                trackColor={{false: '#767577', true: '#81b0ff'}}
                thumbColor={isEnabled ? '#f5dd4b' : '#f4f3f4'}
                onValueChange={toggleSwitch}
                value={isEnabled}
                title="Enable Location"
                style={{marginLeft: 20}}
              />
            ),
            headerRight: () => (
              <View
                style={{
                  marginRight: 20,
                }}>
                <Button title="Past Locations" />
              </View>
            ),
          }}
        />
        <Stack.Screen
          name="PastLocations"
          component={PastLocations}
          options={{
            title: 'Past Locations',
            headerRight: () => (
              <View style={{marginRight: 20}}>
                <Button title="Map View" />
              </View>
            ),
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
