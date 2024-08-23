import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View, Switch} from 'react-native';
import {Formik} from 'formik';
import * as yup from 'yup';
import {Button, TextInput, Menu, PaperProvider} from 'react-native-paper';
import {Dropdown} from 'react-native-paper-dropdown';
import http from '../api/http';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {showMessage} from 'react-native-flash-message';

const schema = yup.object().shape({
  name: yup.string().required('Name is required'),
  type: yup.string().required('Activity type is required'),
  start_date_local: yup.string().required('Start date is required'),
  elapsed_time: yup
    .number()
    .required('Elapsed time is required')
    .positive('Elapsed time must be positive'),
  description: yup.string().optional(),
  distance: yup
    .number()
    .required('Distance is required')
    .positive('Distance must be positive'),
  trainer: yup.boolean().optional(),
  commute: yup.boolean().optional(),
});

const activityTypes = [
  {label: 'Run', value: 'Run'},
  {label: 'Ride', value: 'Ride'},
  {label: 'Swim', value: 'Swim'},
  {label: 'Walk', value: 'Walk'},
  {label: 'Hike', value: 'Hike'},
  {label: 'AlpineSki', value: 'AlpineSki'},
  {label: 'BackcountrySki', value: 'BackcountrySki'},
  {label: 'Canoeing', value: 'Canoeing'},
  {label: 'Crossfit', value: 'Crossfit'},
  {label: 'EBikeRide', value: 'EBikeRide'},
  {label: 'Elliptical', value: 'Elliptical'},
  {label: 'IceSkate', value: 'IceSkate'},
  {label: 'InlineSkate', value: 'InlineSkate'},
  {label: 'Kayaking', value: 'Kayaking'},
  {label: 'Kitesurf', value: 'Kitesurf'},
  {label: 'NordicSki', value: 'NordicSki'},
  {label: 'RockClimbing', value: 'RockClimbing'},
  {label: 'RollerSki', value: 'RollerSki'},
  {label: 'Rowing', value: 'Rowing'},
  {label: 'Sail', value: 'Sail'},
  {label: 'Skateboard', value: 'Skateboard'},
  {label: 'Snowboard', value: 'Snowboard'},
  {label: 'Snowshoe', value: 'Snowshoe'},
  {label: 'Soccer', value: 'Soccer'},
  {label: 'StairStepper', value: 'StairStepper'},
  {label: 'StandUpPaddling', value: 'StandUpPaddling'},
  {label: 'Surfing', value: 'Surfing'},
  {label: 'VirtualRide', value: 'VirtualRide'},
  {label: 'WeightTraining', value: 'WeightTraining'},
  {label: 'Windsurf', value: 'Windsurf'},
  {label: 'Workout', value: 'Workout'},
  {label: 'Yoga', value: 'Yoga'},
];

const CreateActivity = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const [accessToken, setAccessToken] = useState<string | null>(null);
  useEffect(() => {
    const getAccessToken = async () => {
      try {
        setLoading(true);
        const token = await AsyncStorage.getItem('token');
        if (token) {
          setAccessToken(token);
        } else {
          navigation.navigate('Home');
        }
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    getAccessToken();
  }, []);
  const handleSubmit = async (values: any) => {
    try {
      setLoading(true);
      const headers = {Authorization: `Bearer ${accessToken}`};
      const response: any = await http.post('/activities', values, {
        headers,
      });
      showMessage({
        message: 'Activity Added Successfully',
        type: 'success',
      });
      navigation.navigate('Activities');
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };
  return (
    <View style={styles.baseStyle}>
      <Text style={styles.header}>Create Activity</Text>
      <View style={styles.formBaseStyle}>
        <Formik
          initialValues={{
            name: '',
            type: activityTypes[0]?.value,
            start_date_local: '',
            elapsed_time: '',
            description: '',
            distance: '',
            trainer: false,
            commute: false,
          }}
          validationSchema={schema}
          onSubmit={values => {
            handleSubmit(values);
          }}>
          {({
            errors,
            touched,
            values,
            setFieldValue,
            handleChange,
            handleBlur,
            handleSubmit,
          }) => (
            <View>
              <TextInput
                label="Name"
                testID="activity-name"
                value={values.name}
                onChangeText={handleChange('name')}
                onBlur={handleBlur('name')}
                style={styles.input}
                error={touched?.name && errors?.name ? true : false}
              />
              {touched.name && errors.name && (
                <Text style={styles.error}>{errors.name}</Text>
              )}
              <Dropdown
                value={values.type}
                testID="activity-type"
                options={activityTypes}
                onSelect={value => setFieldValue('type', value)}
                error={touched.type && errors.type ? true : false}
              />
              {touched.type && errors.type && (
                <Text style={styles.error}>{errors.type}</Text>
              )}

              <TextInput
                label="Start Date"
                testID="activity-start-date"
                value={values.start_date_local}
                onChangeText={handleChange('start_date_local')}
                onBlur={handleBlur('start_date_local')}
                style={{...styles.input, marginTop: 10}}
                error={
                  touched.start_date_local && errors.start_date_local
                    ? true
                    : false
                }
              />
              {touched.start_date_local && errors.start_date_local && (
                <Text style={styles.error}>{errors.start_date_local}</Text>
              )}

              <TextInput
                label="Elapsed Time (in hours)"
                testID="activity-elapsed-time"
                value={values.elapsed_time}
                onChangeText={handleChange('elapsed_time')}
                onBlur={handleBlur('elapsed_time')}
                style={styles.input}
                keyboardType="numeric"
                error={
                  touched.elapsed_time && errors.elapsed_time ? true : false
                }
              />
              {touched.elapsed_time && errors.elapsed_time && (
                <Text style={styles.error}>{errors.elapsed_time}</Text>
              )}

              <TextInput
                label="Description"
                testID="activity-description"
                value={values.description}
                onChangeText={handleChange('description')}
                onBlur={handleBlur('description')}
                style={styles.input}
              />

              <TextInput
                label="Distance (in miles)"
                testID="activity-distance"
                value={values.distance}
                onChangeText={handleChange('distance')}
                onBlur={handleBlur('distance')}
                style={styles.input}
                keyboardType="numeric"
                error={touched.distance && errors.distance ? true : false}
              />
              {touched.distance && errors.distance && (
                <Text style={styles.error}>{errors.distance}</Text>
              )}
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  gap: 90,
                }}>
                <View style={styles.switchContainer}>
                  <Text>Trainer</Text>
                  <Switch
                    testID="activity-trainer"
                    value={values.trainer}
                    onValueChange={async (value: boolean) => {
                      await setFieldValue('trainer', value);
                    }}
                  />
                </View>

                <View style={styles.switchContainer}>
                  <Text>Commute</Text>
                  <Switch
                    testID="activity-commute"
                    value={values.commute}
                    onValueChange={async (value: boolean) => {
                      await setFieldValue('commute', value);
                    }}
                  />
                </View>
              </View>

              <Button
                testID="submit-button"
                mode="contained"
                onPress={() => handleSubmit()}
                loading={loading}
                style={styles.button}>
                Submit
              </Button>
            </View>
          )}
        </Formik>
      </View>
    </View>
  );
};

export default CreateActivity;

const styles = StyleSheet.create({
  baseStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F5F5F5',
  },
  header: {
    fontSize: 24,
    marginBottom: 16,
    fontWeight: 'bold',
  },
  formBaseStyle: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 8,
    shadowColor: '#000000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  input: {
    marginBottom: 12,
  },
  picker: {
    height: 50,
    marginBottom: 12,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  button: {
    marginTop: 16,
  },
  error: {
    color: 'red',
    marginBottom: 8,
  },
});
