import React, {Component, useState, useEffect} from 'react';
import {Text, View, StyleSheet, TextInput, Image, Alert} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Slideshow from 'react-native-image-slider-show';
//store login state in async storage

let SQLite = require('react-native-sqlite-storage');

export default class BuyScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      productid: this.props.route.params.id, //this.props.route.params.productid
      userid: '',
      address: '',
      name: '',
      email: '',
      sessionToken: '',
      imageURL: '',
      position: 1,
      interval: null,
      dataSource: [{url: ''}],
      id: this.props.route.params.id,
    };

    this.db = SQLite.openDatabase(
      {
        name: 'data',
      },
      this.openCallback,
      this.errorCallback,
    );

    this.getData = this.getData.bind(this);
    this.confirmOrder = this.confirmOrder.bind(this);
    this.getToken = this.getToken.bind(this);

    this._query = this._query.bind(this);
    this._queryImage = this._queryImage.bind(this);
  }
  componentDidMount() {
    this.getData();
    this.getToken();

    this._query();
    this._queryImage();
  }

  //query item
  // query
  _query() {
    this.db.transaction(tx =>
      tx.executeSql(
        'SELECT * FROM item WHERE id = ?',
        [this.state.id],
        (tx, results) => {
          this.setState({items: results.rows.raw()});
        },
      ),
    );
  }

  // query
  _queryImage() {
    this.db.transaction(tx =>
      tx.executeSql(
        'SELECT image FROM item WHERE id = ?',
        [this.state.id],
        (tx, results) => {
          this.setState({imageURL: results.rows.item(0).image});
          console.log(results.rows.item(0).image);
        },
      ),
    );
  }

  async getToken() {
    try {
      //get name from async
      const value = await AsyncStorage.getItem('sessionToken');
      if (value != null) {
        //set current state name to the one in async
        this.setState({sessionToken: value});
        console.log('Current user id ' + this.state.sessionToken);
      }
    } catch (error) {
      console.log(error);
    }
  }
  //CREATE ORDER METHOD
  confirmOrder() {
    this.db.transaction(tx => {
      tx.executeSql(
        'INSERT INTO orders(product_id,buyer_id,delivery_address) VALUES(?,?,?)',
        [this.state.productid, this.state.sessionToken, this.state.address],
      );
      console.log(this.state.productid);
      //delete from product table
      tx.executeSql(
        'DELETE FROM item WHERE id=?',
        [this.state.productid],
      );
      //for reference
      tx.executeSql(
        'SELECT * FROM orders WHERE buyer_id=?',
        [this.state.sessionToken],
        (tx, results) => {
          console.log(results.rows.raw());
          Alert.alert('Order Confirmed: '+ results.rows.item(0).order_date);
          this.props.navigation.goBack();
          this.props.navigation.goBack();
        },
      );
    });
  }

  openCallback() {
    console.log('database open success');
  }
  errorCallback(err) {
    console.log('database open error: ' + err);
  }

  //just for reference
  getData() {
    this.db.transaction(tx => {
      tx.executeSql('SELECT * from orders', [], (tx, results) => {
        console.log('order table size: ' + results.rows.length);
        console.log(results.rows.raw());
      });
    });
  }

  /*   createTable() {
    this.db.transaction(tx => {
      tx.executeSql(
        'CREATE TABLE orders(order_id INTEGER PRIMARY KEY AUTOINCREMENT, product_id INTEGER NOT NULL,buyer_id INTEGER NOT NULL,delivery_address TEXT NOT NULL,order_date DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL)',
      );
    }, console.log('orders table created'));
  } */
  /* 
  //just in case need to clear shit
  deleteUser() {
    this.db.transaction(tx => {
      tx.executeSql(
        'DELETE FROM orders;',
        [],
        () => {
          console.log('success');
        },
        error => {
          console.log(error);
        },
      );
    });
  } */

  render() {
    return (
      
      
      <View style={styles.container}>
        <View>
              <Slideshow
                dataSource={[{url: this.state.imageURL}]}
                position={this.state.position}
                onPositionChanged={position => this.setState({position})}
              />
            </View>
        <View style={styles.wrapper}>
          <TextInput
            style={styles.input}
            value={this.state.address}
            placeholder="Enter Address"
            onChangeText={address => this.setState({address})}
          />
          <View style={styles.button}>
            <TouchableOpacity onPress={this.confirmOrder}>
              <Text style={styles.buttonText}>Confirm Order</Text>
            </TouchableOpacity>
          </View>

          <View style={{flexDirection: 'row', marginTop: 20}}>
            <Text>Return to home? </Text>
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate('HomeScreen')}>
              <Text style={styles.link}>Home</Text>
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
    marginTop: 20,
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
    marginTop: 20,
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
