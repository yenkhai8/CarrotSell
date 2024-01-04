import React, {Component} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import SearchScreen from './SearchScreen';
import ProductScreen from './ProductScreen';
import BuyScreen from './BuyScreen';

const Stack = createStackNavigator();

export default class SearchNavigator extends Component {
  render() {
    return (
      <Stack.Navigator
        intialRouteName="SearchScreen"
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen
          name="SearchScreen"
          component={SearchScreen}></Stack.Screen>

        <Stack.Screen
          name="ProductScreen"
          component={ProductScreen}></Stack.Screen>

        <Stack.Screen name="BuyScreen" component={BuyScreen}></Stack.Screen>
      </Stack.Navigator>
    );
  }
}
