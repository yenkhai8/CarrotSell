import React, {Component} from 'react';
import {
  View,
  ScrollView,
  TouchableHighlight,
  TouchableOpacity,
  Image,
  Text,
  Alert,
} from 'react-native';
import RNRestart from 'react-native-restart';
import AsyncStorage from '@react-native-async-storage/async-storage';

let config = require('../Config');
export default class ProfileScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userid: '',
      name: '',
      email: '',
      phoneNum: '',
      sessionToken: 'NONE',
    };
    this.getToken = this.getToken.bind(this);
    this.retrieveUser = this.retrieveUser.bind(this);
    this.logOut = this.logOut.bind(this);
  }
  componentDidMount() {
    this.getToken();
  }

  async getToken() {
    try {
      const value = await AsyncStorage.getItem('sessionToken');
      const name = await AsyncStorage.getItem('name');
      if (value !== null) {
        this.setState({
          sessionToken: value,
          userid: value,
          name:name
        });
        this.retrieveUser();
        console.log('Session token is ' + this.state.sessionToken);
      }
    } catch (error) {
      console.log(error);
    }
  }

  //testing pull data from api
  retrieveUser() {
    let url =
      config.settings.serverPath + '/api/retrieveuser/' + this.state.sessionToken;
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
          phoneNum: users.phone_num,
          sessionToken: JSON.stringify(users.user_id),
        });
        console.log(users);
        //this.getToken();
      })
      .catch(error => {
        console.error(error);
      });
  }

  async logOut() {
    try {
      await AsyncStorage.setItem('sessionToken', 'NONE');
      this.setState({sessionToken: 'NONE'});
      console.log(this.state.sessionToken);
      RNRestart.Restart();
      //this.props.navigation.navigate('Login');
    } catch (error) {
      console.log('error');
    }
  }

  render() {
    
    return (
      <View>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* For black background */}
          <View
            style={{
              padding: 10,
              width: '100%',
              backgroundColor: '#000',
              height: 150,
            }}></View>

          {/* Profile Picture */}
          <View style={{alignItems: 'center'}}>
            <Image
              source={require('../img/profilepic.png')}
              style={{
                width: 140,
                height: 140,
                borderRadius: 100,
                marginTop: -70,
              }}></Image>
            <Text
              style={{
                fontSize: 25,
                fontWeight: 'bold',
                padding: 10,
                color: 'black',
              }}>
              {this.state.name}
            </Text>
            <Text style={{fontSize: 15, fontWeight: 'bold', color: 'grey '}}>
              {this.state.email}
            </Text>
            <Text style={{fontSize: 15, fontWeight: 'bold', color: 'grey '}}>
              {this.state.phoneNum}
            </Text>
          </View>
          <TouchableOpacity
            style={{
              alignSelf: 'center',
              flexDirection: 'row',
              justifyContent: 'center',
              backgroundColor: '#fff',
              width: '90%',
              padding: 20,
              paddingBottom: 22,
              borderRadius: 10,
              shadowOpacity: 80,
              elevation: 15,
              marginTop: 20,
            }} onPress={() => this.props.navigation.navigate('MyProduct')}>
            <Image
              source={require('../img/product.png')}
              style={{width: 20, height: 20}}></Image>
            <Text style={{color: 'black', marginLeft: 10}}>My Products</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              alignSelf: 'center',
              flexDirection: 'row',
              justifyContent: 'center',
              backgroundColor: '#fff',
              width: '90%',
              padding: 20,
              paddingBottom: 22,
              borderRadius: 10,
              shadowOpacity: 80,
              elevation: 15,
              marginTop: 20,
            }}
            onPress={() => this.props.navigation.navigate('EditProfile',{refresh: this.retrieveUser})}>
            <Image
              source={require('../img/user.png')}
              style={{width: 20, height: 20}}></Image>
            <Text style={{color: 'black', marginLeft: 10}}>Edit Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              alignSelf: 'center',
              flexDirection: 'row',
              justifyContent: 'center',
              backgroundColor: '#fff',
              width: '90%',
              padding: 20,
              paddingBottom: 22,
              borderRadius: 10,
              shadowOpacity: 80,
              elevation: 15,
              marginTop: 20,
              marginBottom: 40,
              backgroundColor: '#e68c3d',
            }}
            onPress={this.logOut}>
            <Text style={{color: '#fff', marginLeft: 10}}>Log Out</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }
}


//onPress={()=>{this.props.navigation.navigate('Profile', {id:this.state.id})}}