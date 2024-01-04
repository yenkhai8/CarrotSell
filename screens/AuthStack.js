import LoginScreen from './login';
import RegisterScreen from './register';
import React, {Component} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
const bottomTab = createBottomTabNavigator();
const Stack = createStackNavigator();

export default class AuthStack extends Component {

  render() {
    return (
        <Stack.Navigator>
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{headerShown: false}}
            />
          <Stack.Screen
            name="Register"
            component={RegisterScreen}
            options={{headerShown: false}}
          />
        </Stack.Navigator>
    );
  }
}
