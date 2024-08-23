import {Image, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {ActivityIndicator} from 'react-native-paper';
import Colors from '../theme/theme';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useDispatch} from 'react-redux';
import {selectPokemon} from '../redux/stravaSlice';
type Props = {
  loading: boolean;
  data: any;
};

const InfoCard = ({loading, data}: Props) => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const dispatch = useDispatch();
  const handleNavigationPress = () => {
    dispatch(selectPokemon(data));
    navigation.navigate('Details');
  };
  return (
    <View style={styles.container}>
      {!loading ? (
        <>
          {data?.sprites?.front_default && data?.sprites?.back_default ? (
            <View style={styles.spriteContainer}>
              <Image
                source={{uri: data?.sprites?.front_default}}
                style={styles.imageStyle}
              />
              <Image
                source={{uri: data?.sprites?.back_default}}
                style={styles.imageStyle}
              />
            </View>
          ) : (
            <ActivityIndicator size={'large'} color="blue" />
          )}
          <TouchableOpacity onPress={handleNavigationPress}>
            <View style={styles.infoStyle}>
              <Text style={styles.textStyle}>Species Name: {data?.name}</Text>
              <Text style={styles.textStyle}>Dex ID: {data?.id}</Text>
            </View>
          </TouchableOpacity>
        </>
      ) : (
        <View style={styles.infoStyle}>
          <ActivityIndicator size={'large'} color="blue" />
        </View>
      )}
    </View>
  );
};

export default InfoCard;

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageStyle: {
    height: 170,
    width: 170,
  },
  spriteContainer: {
    display: 'flex',
    flexDirection: 'row',
  },
  textStyle: {
    color: Colors.gray,
    textTransform: 'capitalize',
    fontSize: 20,
    fontFamily: 'Times New Roman',
  },
  infoStyle: {
    display: 'flex',
    justifyContent: 'flex-start',
    marginBottom: 16,
    borderWidth: 1,
    padding: 16,
    borderRadius: 16,
    borderColor: '#e0e3eb',
  },
});
