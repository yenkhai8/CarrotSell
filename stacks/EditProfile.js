import React, {Component, useState, useEffect} from 'react';
import {Text, View, StyleSheet, TextInput, Button, Alert} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
let config = require('../Config');

export default class EditProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userid: '',
      name: '',
      email: '',
      password: '',
      passwordConfirm: '',
      phoneNum: '',
      sessionToken: 'NONE',
    };
    this.getData = this.getData.bind(this);
    this.updateProfile = this.updateProfile.bind(this);
    this.getToken = this.getToken.bind(this);
  }

  componentDidMount() {
    this.getData();
    this.getToken();
  }

  async getToken() {
    try {
      const value = await AsyncStorage.getItem('sessionToken');
      if (value !== null) {
        this.setState({sessionToken: value, userid: value});
        console.log('Session token is ' + this.state.sessionToken);
      }
    } catch (error) {
      console.log(error);
    }
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

  //UPDATE PROFILE METHOD
  updateProfile() {
    let url = config.settings.serverPath + '/api/update';
    fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: this.state.name,
        email: this.state.email,
        phone_num: this.state.phoneNum,
        user_id: this.state.sessionToken,
      }),
    })
      .then(response => {
        console.log(response);
        if (!response.ok) {
          Alert.alert('Failed to update account');
          throw Error('Error ' + response.status);
        } else {
          Alert.alert('Account updated successfully!');
          this.props.route.params.refresh();
          this.props.navigation.goBack();
          return response.json();
        }
      })
      .catch(error => {
        console.log(error);
      });
  }

  render() {
    return (
      <View style={styles.container}>
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
            value={this.state.phoneNum}
            placeholder="Enter Phone Number"
            onChangeText={phoneNum => this.setState({phoneNum})}
          />

          <View style={styles.button}>
            <TouchableOpacity onPress={this.updateProfile}>
              <Text style={styles.buttonText}>Update Profile</Text>
            </TouchableOpacity>
          </View>

          <View style={{flexDirection: 'row', marginTop: 20}}>
            <Text>Changes already made? </Text>
            <TouchableOpacity
              onPress={() => this.props.navigation.goBack()}>
              <Text style={styles.link}>Go back</Text>
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
