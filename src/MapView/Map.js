/* eslint-disable no-extra-boolean-cast */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-unstable-nested-components */
import {View, StyleSheet, Button} from 'react-native';
import React, {useEffect, useState} from 'react';
import MapView, {Marker} from 'react-native-maps';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Geolocation from '@react-native-community/geolocation';
import {Notifications} from 'react-native-notifications';

// const window = Dimensions.get('window');
// const {width, height} = window;
const latitudeDelta = 0.0922 * 0.5;
const longitudeDelta = 0.0421 * 0.5; // latitudeDelta + width / height

const Map = ({route, navigation}) => {
  // AsyncStorage.removeItem('locationData');
  const [mapRegion, setMapRegion] = useState({
    latitude: 12.971599,
    longitude: 77.594566,
    latitudeDelta: latitudeDelta,
    longitudeDelta: longitudeDelta,
  });

  const [markerItem, setMarkerItem] = useState(null);
  // const [isEnabled, setIsEnabled] = useState(false)
  // const markerItem = false

  useEffect(() => {
    if (route?.params?.markerItem) {
      setMarkerItem(route.params.markerItem);
      setMapRegion({
        latitude: route.params.markerItem.coordinates.latitude,
        longitude: route.params.markerItem.coordinates.longitude,
        latitudeDelta: latitudeDelta,
        longitudeDelta: longitudeDelta,
      });
    }
  }, [route.params]);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{marginRight: 20}}>
          <Button
            onPress={() => {
              navigation.navigate('PastLocations');
            }}
            title="Past Locations"
          />
        </View>
      ),
    });
  }, [navigation]);

  useEffect(() => {
    // let watchId = null;
    Geolocation.watchPosition(
      position => {
        // Create the object to update mapRegion through the onRegionChange function
        // console.log('position', position)
        let region = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          latitudeDelta: 0.00922 * 1.5,
          longitudeDelta: 0.00421 * 1.5,
        };
        onRegionChange(region, region.latitude, region.longitude);
      },
      error => console.log('error', error),
      {enableHighAccuracy: true},
    );
  }, []);

  const onRegionChange = (region, lastLat, lastLong) => {
    if (lastLat && lastLong) {
      // console.log('changing region', lastLat, lastLong)
      try {
        setMapRegion(region);
      } catch (err) {
        // console.log('error while updating region', err)
      }
    }
  };

  /*function for location data store */
  const storeLocationData = async locationData => {
    try {
      const existingLocationData = await AsyncStorage.getItem('locationData');
      let locations = existingLocationData
        ? JSON.parse(existingLocationData)
        : [];

      // Add the new location data to the array.
      if (!Array.isArray(locations)) {
        locations = [locations];
      }
      locations.push(locationData);
      // Store the updated location data back in AsyncStorage.
      AsyncStorage.setItem('locationData', JSON.stringify(locations));
      Notifications.postLocalNotification({
        title: 'New Location',
        body: `You visited new location ${
          locationData?.metadata?.name
            ? `: ${locationData?.metadata?.name}`
            : ''
        }`,
      });
    } catch (error) {
      console.error('Error storing location data:', error);
    }
  };

  /*
  // Track location and store the data
  const trackLocation = () => {
    Geolocation.watchPosition(
      async position => {
        const {latitude, longitude} = position.coords;
        const timestamp = new Date().getTime();

        const locationData = {
          coordinates: {latitude, longitude},
          timestamp,
          metadata: {},
        };
        // Store the location data locally.
        await storeLocationData(locationData);
      },
      error => {
        console.error('Error getting location:', error);
      },
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},
    );
  };

  useEffect(() => {
    trackLocation();
  }, []);
  */

  return (
    <View style={styles.container}>
      <View>
        <Button
          title="Past locations"
          onPress={() => {
            navigation.navigate('LocationHistory');
          }}
          style={{height: 10, width: 10, flex: 1}}
        />
      </View>

      <MapView
        provider="google"
        style={styles.map}
        region={mapRegion}
        showsUserLocation={true}
        followUserLocation={true}
        zoomEnabled={true}
        scrollEnabled={true}
        showsScale={true}
        onPoiClick={async e => {
          const {latitude, longitude} = e.nativeEvent.coordinate;
          const timestamp = new Date().getTime();

          const locationData = {
            coordinates: {latitude, longitude},
            timestamp,
            metadata: {
              name: e.nativeEvent.name,
            },
          };

          await storeLocationData(locationData);
        }}>
        {!!markerItem ? (
          <Marker
            draggable
            coordinate={{
              latitude: markerItem.coordinates.latitude,
              longitude: markerItem.coordinates.longitude,
            }}
            tappable={false}
          />
        ) : null}
      </MapView>
    </View>
  );
};

export default Map;
const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    height: '80vh',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});
