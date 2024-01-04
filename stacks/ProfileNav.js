import React, {Component} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import ProfileScreen from './ProfileScreen';
import EditProfile from './EditProfile';
import MyProductScreen from './MyProductScreen';

const Stack = createStackNavigator();

export default class ProfileNav extends Component {
  render() {
    return (
      <Stack.Navigator
        intialRouteName="ProfileScreen"
        screenOptions={{
          headerTitleAlign: 'center',
          headerStyle: {
            backgroundColor: '#e68c3d'
          },
          headerTintColor: '#ffffff',
          headerTitleStyle: {
            fontSize: 25,
            fontWeight: 'bold'
          }
        }}>
        <Stack.Screen
          name="ProfileScreen"
          component={ProfileScreen}options={{
            headerShown: false,
          }}></Stack.Screen>

        <Stack.Screen name="EditProfile" component={EditProfile}></Stack.Screen>

        <Stack.Screen name="MyProduct" component={MyProductScreen} 
        options={{
            headerShown: true,
          }}>
        </Stack.Screen>
      </Stack.Navigator>
    );
  }
}
