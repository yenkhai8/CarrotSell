import React, {Component, useState, useEffect} from 'react';
import {Text, View, StyleSheet, TextInput, Image, Alert} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {StackNavigator} from 'react-navigation';

import RNRestart from 'react-native-restart';
//store login state in async storage
let config = require('../Config');

export default class LoginScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userid: '',
      name: '',
      email: '',
      password: '',
      phoneNum: '',
      sessionToken: 'NONE',
    };

    this.storeToken = this.storeToken.bind(this);
    this.getToken = this.getToken.bind(this);
    this.getData = this.getData.bind(this);
    this.loginSuccess = this.loginSuccess.bind(this);
    this.loginFunction = this.loginFunction.bind(this);
  }

  async storeToken() {
    try {
      await AsyncStorage.setItem('sessionToken', this.state.sessionToken);
      await AsyncStorage.setItem('name', this.state.name);
      await AsyncStorage.setItem('email', this.state.email);
      await AsyncStorage.setItem('password', this.state.password);
      await AsyncStorage.setItem('phoneNum', this.state.phoneNum);
    } catch (error) {
      console.log('error' + error);
    }
  }

  async getToken() {
    try {
      const value = await AsyncStorage.getItem('sessionToken');
      if (value !== null) {
        this.setState({sessionToken: value});
        console.log('Session token is ' + this.state.sessionToken);
      }
    } catch (error) {
      console.log(error);
    }
  }

  componentDidMount() {
    this.getData();
    this.getToken();
  }

  loginFunction() {
    let url = config.settings.serverPath + '/api/login';
    fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: this.state.email,
        password: this.state.password,
      }),
    })
      .then(response => {
        console.log(response);
        if (!response.ok) {
          //if 400, password wrong blabla
          Alert.alert('Error: Login Failed');
          throw Error('Error ' + response.status);
        } else console.log(response.headers);
        Alert.alert('Login Success!');

        this.loginSuccess();
        
        //this.props.navigation.navigate('Home');
       RNRestart.Restart();
        //this.props.navigation.popToTop();
        return response.json();
      })
      .catch(error => {
        console.log(error);
      });
  }

  loginSuccess() {
    let url =
      config.settings.serverPath + '/api/loginsuccess/' + this.state.email;
    console.log(url);
    fetch(url)
      .then(response => {
        if (!response.ok) {
          Alert.alert('Error:', response.status.toString());
          throw Error('Error ' + response.status);
        }
        return response.json();
      })
      .then(users => {
        this.setState({
          userid: users.user_id,
          name: users.name,
          email: users.email,
          password: users.password,
          phoneNum: users.phone_num,
          sessionToken: JSON.stringify(users.user_id),
        });
        console.log(users);
        this.storeToken();
        //this.getToken();
      })
      .catch(error => {
        console.error(error);
      });
  }

  getData() {
    let url = config.settings.serverPath + '/api/userdata';
    console.log(url);
    fetch(url)
      .then(response => {
        if (!response.ok) {
          Alert.alert('Error:', response.status.toString());
          throw Error('Error ' + response.status);
        }
        return response.json();
      })
      .then(users => {
        this.setState({
          userid: users.user_id,
          name: users.name,
          email: users.email,
          password: users.password,
          phoneNum: users.phoneNum,
        });
        console.log(users);
      })
      .catch(error => {
        console.error(error);
      });
  }

  render() {
    return (
      <View style={styles.container}>
        <Image style={{ alignSelf:'center', justifyContent:'center'}} source={require('../img/logo.png')}></Image>
        <View style={styles.wrapper}>
          <TextInput
            style={styles.input}
            value={this.state.email}
            placeholder="Enter Email"
            onChangeText={email => this.setState({email})}
          />
          <TextInput
            style={styles.input}
            value={this.state.password}
            placeholder="Enter Password"
            onChangeText={password => this.setState({password})}
            secureTextEntry
          />
          <View style={styles.button}>
            <TouchableOpacity onPress={this.loginFunction}>
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
          </View>

          <View style={{flexDirection: 'row', marginTop: 20}}>
            <Text>Don't have an account? </Text>
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate('Register')}>
              <Text style={styles.link}>Register here</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wrapper: {
    width: '80%',
  },
  input: {
    marginBottom: 1,
    borderWidth: 1,
    borderColor: '#bbb',
    borderRadius: 0.5,
    paddingHorizontal: 14,
  },
  link: {
    color: 'red',
  },
  button: {
    borderRadius: 0.5,
    paddingHorizontal: 14,
    backgroundColor: '#E68C3D',
  },
  buttonText: {
    margin: 10,
    textAlign: 'center',
    color: 'white',
  },
});
