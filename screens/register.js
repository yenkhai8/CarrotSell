import React, {Component, useState, useEffect} from 'react';
import {Text, View, StyleSheet, TextInput, Image, Alert} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
//import AsyncStorage from '@react-native-async-storage/async-storage';
let config = require('../Config');

export default class RegisterScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      email: '',
      password: '',
      passwordConfirm: '',
      phoneNum: '',
    };
    /* this.getData = this.getData.bind(this); */
    this.registerFunction = this.registerFunction.bind(this);
  }

  registerFunction() {
    if (
      this.state.name == '' ||
      this.state.email == '' ||
      this.state.password == '' ||
      this.state.passwordConfirm == '' ||
      this.state.phoneNum == ''
    ) {
      Alert.alert('Please fill in all fields');
    } else if (this.state.password != this.state.passwordConfirm) {
      Alert.alert('Passwords do not match');
    } else {
      let url = config.settings.serverPath + '/api/register';
      fetch(url, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: this.state.name,
          email: this.state.email,
          password: this.state.password,
          phone_num: this.state.phoneNum,
        }),
      })
        .then(response => {
          console.log(response);
          if (!response.ok) {
            Alert.alert('Accunt already exists!');
            throw Error('Error ' + response.status);
          } else console.log(response.status);
          Alert.alert('Account Registered Successfully!');
          this.props.navigation.navigate('Login');
          return response.json();
        })
        .catch(error => {
          console.log(error);
        });
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Image style={{ alignSelf:'center', justifyContent:'center'}} source={require('../img/logo.png')}></Image>
        <View style={styles.wrapper}>
          <TextInput
            style={styles.input}
            placeholder="Enter Name"
            value={this.state.name}
            onChangeText={name => this.setState({name})}
          />

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
          <TextInput
            style={styles.input}
            value={this.state.passwordConfirm}
            placeholder="Confirm Password"
            onChangeText={passwordConfirm => this.setState({passwordConfirm})}
            secureTextEntry
          />

          <TextInput
            style={styles.input}
            value={this.state.phoneNum}
            placeholder="Enter Phone Number"
            onChangeText={phoneNum => this.setState({phoneNum})}
          />

          <View style={styles.button}>
            <TouchableOpacity onPress={this.registerFunction}>
              <Text style={styles.buttonText}>Register</Text>
            </TouchableOpacity>
          </View>

          <View style={{flexDirection: 'row', marginTop: 20}}>
            <Text>Already have an account? </Text>
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate('Login')}>
              <Text style={styles.link}>Login here</Text>
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
