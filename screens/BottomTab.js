import React, {Component} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import HomeNavigator from '../stacks/HomeNavigator';
import SearchNavigator from '../stacks/SearchNavigator';
import ProfileNav from '../stacks/ProfileNav';
import SellStack from '../stacks/SellStack';

import Ionicons from 'react-native-vector-icons/Ionicons';

import {createStackNavigator} from '@react-navigation/stack';
const bottomTab = createBottomTabNavigator();
const StackNav = createStackNavigator();

export default class Tab extends Component{
  render(){
    return(
      //EACH TAB SHOULD NEST A STACK
        <bottomTab.Navigator 
          initialRouteName={'Home'}
          screenOptions={{
            
            headerShown:false, 
            tabBarActiveTintColor:'black',
            tabBarHideOnKeyboard:'true',
            tabBarActiveBackgroundColor: 'lightgray', 
            tabBarLabelStyle:{fontSize:16, color:'black'},
            tabBarStyle:{backgroundColor:'white'}
          }}
        >
            <bottomTab.Screen
              name="Home"
              component={HomeNavigator}
              options={ {tabBarIcon:()=>{return <Ionicons name="home"  size={20} color={'black'} /> ;}}}
            />
             <bottomTab.Screen
              name="Search"
              component={SearchNavigator}
              options={ {tabBarIcon:()=>{return <Ionicons name="search"  size={20} color={'black'} /> ;}}}
            />
             <bottomTab.Screen
              name="Sell"
              component={SellStack}
              options={ {tabBarIcon:()=>{return <Ionicons name="add-circle"  size={20} color={'black'} /> ;}}}
            /> 
            <bottomTab.Screen
              name="Profile"
              component={ProfileNav}
              options={{tabBarIcon:()=>{return <Ionicons name="person" size={20} color={'black'}/>}}}
            />
        </bottomTab.Navigator>
    );
  }
}