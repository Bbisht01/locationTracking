/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-unstable-nested-components */
import {View, Text, FlatList, Button, StyleSheet} from 'react-native';
import React, {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {TouchableOpacity} from 'react-native-gesture-handler';

export default function PastLocations({navigation}) {
  const [firstRender, setFirstRender] = useState(true);
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{marginRight: 20}}>
          <Button
            onPress={() => {
              navigation.navigate('MapView');
            }}
            title="Map View"
          />
        </View>
      ),
    });
  }, [navigation]);

  const fetchLocationHistory = async () => {
    try {
      let locationData = await AsyncStorage.getItem('locationData');
      if (locationData) {
        locationData = JSON.parse(locationData);
        // for (let index = 0; index < locationData.length / 2; index++) {
        //   let temp = locationData[index];
        //   locationData[index] = locationData[locationData.length - 1 - index];
        //   locationData[locationData.length - 1 - index] = temp;
        // }
        locationData = locationData.reverse();
        setLocations(locationData);
      }
    } catch (error) {
      console.error('Error fetching location history:', error);
    }
  };

  useEffect(() => {
    if (firstRender) {
      fetchLocationHistory();
      setFirstRender(false);
    }
  }, [locations, setLocations, firstRender, setFirstRender]);

  return (
    <View
      style={{
        backgroundColor: '#fcfdff',
        flex: 1,
      }}>
      <FlatList
        data={locations}
        keyExtractor={item => item.timestamp}
        showsVerticalScrollIndicator={true}
        renderItem={({item, index}) => {
          if (!item.latitude && !item.longitude) {
            return (
              <TouchableOpacity
                key={index}
                style={{opacity: 10}}
                onPress={() =>
                  navigation.navigate('MapView', {markerItem: item})
                }>
                <View style={styles.mainContainer}>
                  <Text style={styles.heading}>
                    Place: {item?.metadata?.name || 'test'}
                  </Text>
                  <Text style={styles.subHeading}>
                    Latitude: {item?.coordinates?.latitude}
                  </Text>
                  <Text style={styles.subHeading}>
                    Longitude: {item?.coordinates?.longitude}
                  </Text>
                  <Text style={styles.subHeading}>
                    Timestamp:{' '}
                    {item?.timestamp
                      ? new Date(item?.timestamp).toLocaleString()
                      : new Date().toLocaleString()}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          }
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    marginBottom: 20,
    paddingLeft: 20,
    marginTop: 20,
    // backgroundColor: 'lightgrey',
    width: 340,
    justifyContent: 'center',
    display: 'flex',
    alignSelf: 'center',
    padding: 20,
    borderRadius: 10,
    backgroundColor: '#b7d0e3',
    borderTopColor: '#b7d0e3',
    borderTopWidth: 1,
  },
  heading: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#2f2c88',
  },
  subHeading: {color: '#2f2c88'},
});
