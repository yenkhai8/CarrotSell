
import React,{Component} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SellScreen from './sell_screen';
import PreviewItem from './preview_item';

const Stack = createStackNavigator();

function SellStack() {
  return (

      <Stack.Navigator
        initialRouteName="sell_screen"
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
        }}
      >
        <Stack.Screen
          name="Sell Screen"
          component={SellScreen}
          options={{
            headerShown: true,
          }}
        />
        <Stack.Screen
          name="Preview Item"
          component={PreviewItem}
          options={{
            headerShown: true,
          }}
        />
      </Stack.Navigator>
 
  )
}

export default SellStack;