import React, {Component} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import HomeScreen from './HomeScreen';
import ProductScreen from './ProductScreen';
import BuyScreen from './BuyScreen';

const Stack = createStackNavigator();

export default class HomeNavigator extends Component {
  render() {
    return (
      <Stack.Navigator
        intialRouteName="HomeScreen"
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name="HomeScreen" component={HomeScreen}></Stack.Screen>

        <Stack.Screen
          name="ProductScreen"
          component={ProductScreen}></Stack.Screen>

        <Stack.Screen name="BuyScreen" component={BuyScreen}></Stack.Screen>
      </Stack.Navigator>
    );
  }
}
