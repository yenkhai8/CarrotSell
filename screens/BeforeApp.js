import React, {Component} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
//screens
import Tab from './BottomTab';
import AuthStack from './AuthStack';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
const Stack = createStackNavigator();

export default class BeforeApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: '',
      name: '',
      email: '',
      password: '',
      phoneNum: '',
      sessionToken: 'NONE',
      isLoggedIn: false,
    };
    this.getToken = this.getToken.bind(this);
  }

  componentDidMount() {
    this.getToken();
  }

  async getToken() {
    try {
      const value = await AsyncStorage.getItem('sessionToken');
      if (value != null) {
        this.setState({sessionToken: value});
        console.log('Session token is ' + this.state.sessionToken);
      }
    } catch (error) {
      console.log(error);
    }
    if (this.state.sessionToken !== 'NONE') {
      this.setState({isLoggedIn: true});
    }
    console.log('login state: ' + this.state.isLoggedIn);
  }

  render() {
    return (
      
      <NavigationContainer>
        <Stack.Navigator>
        {this.state.isLoggedIn ? (
            <Stack.Screen
              name="Tab"
              component={Tab}
              options={{headerShown: false}}
            />
          ) : (
            <Stack.Screen
              name="Authenticate"
              component={AuthStack}
              options={{headerShown: false}}
            />
          )}
        </Stack.Navigator>
        
      </NavigationContainer>
    );
  }
}
