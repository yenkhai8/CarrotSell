import React, {Component} from 'react';
import {
  Text,
  View,
  Image,
  TouchableHighlight,
  StyleSheet,
  actions,
  Button,
  Alert,
} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
let SQLite = require('react-native-sqlite-storage');

export default class MyProductScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      products: [],
      sessionToken: '',
      productid: '',
    };

    this.db = SQLite.openDatabase(
      {name: 'data'},
      this.openCallback,
      this.errorCallback,
    );

    this._query = this._query.bind(this);
    this._delete = this._delete.bind(this);
    this.getToken = this.getToken.bind(this);
  }
  componentDidMount() {
    this.getToken();
  }

  async getToken() {
    try {
      //get name from async
      const value = await AsyncStorage.getItem('sessionToken');
      if (value != null) {
        //set current state name to the one in async
        this.setState({sessionToken: value});
        console.log('Current user id ' + this.state.sessionToken);
        this._query();
      }
    } catch (error) {
      console.log(error);
    }
  }

  _query() {
    this.db.transaction(tx =>
      // this is userid
      tx.executeSql(
        'SELECT * FROM item  WHERE sellerID=?',
        [this.state.sessionToken],
        (tx, results) => this.setState({products: results.rows.raw()}),
      ),
    );
  }

  openCallback() {
    console.log('database open success');
  }

  errorCallback(err) {
    console.log('Error in opening in database: ' + err);
  }

  _delete(id) {
    this.db.transaction(tx => {
      tx.executeSql(
        'DELETE FROM item WHERE id=?',
        [id],
        () => {
          console.log('success');
        },
        error => {
          console.log(error);
        },
      );
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <FlatList
          data={this.state.products}
          showsVerticalScrollIndicator={true}
          renderItem={({item}) => (
            
            <TouchableHighlight underlayColor={'#cccccc'}>
              <View style={styles.individualProduct}>
                <Image style={styles.productImage} source={{uri: item.image}} />
                <Text style={styles.productName}>{item.name}</Text>
                <Text style={styles.productPrice}>{item.price}</Text>
                <Text style={styles.productCondition}>{item.condition}</Text>
                <Button
                  onPress={() => {
                    console.log('product id:' + item.id);
                    this._delete(item.id);
                    Alert.alert('Item: '+item.name+ ' deleted successfully.');
                    this._query();
                  }}
                  title="delete"
                />
              </View>
            </TouchableHighlight>
          )}
          keyExtractor={item => {
            item.id.toString();
          }}
          numColumns={2}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  initialContainer: {
    backgroundColor: '#E68C3D',
  },
  logoContainer: {
    height: 50,
    width: '100%',
    backgroundColor: 'white',
  },
  imageContainer: {
    marginTop: 15,
    height: 200,
  },
  categoryContainer: {
    marginTop: 15,
    height: 140,
  },
  category: {
    flexDirection: 'row',
    backgroundColor: 'white',
    height: 145,
    padding: 15,
  },
  categoryImages: {
    marginLeft: 15,
    height: 55,
    width: 55,
    borderRadius: 25,
    borderColor: '#f59745',
    borderWidth: 3,
    resizeMode: 'stretch',
  },
  categoryText: {
    fontWeight: 'bold',
    width: 92,
    textAlign: 'center',
  },
  displayContainer: {
    marginTop: 15,
    height: 250,
    backgroundColor: 'white',
  },
  individualProduct: {
    width: 160,
    margin: 15,
    height: 250,
    borderRadius: 5,
    borderWidth: 1,
    shadowColor: 'grey',
    borderColor: '#e5e2e0',
  },
  productImage: {
    resizeMode: 'stretch',
    width: 156,
    height: 156,
  },
  productName: {
    marginLeft: 5,
    width: 156,
    fontWeight: 'bold',
    textAlign: 'left',
    color: '#3b3a3a',
    fontSize: 15,
  },
  productPrice: {
    marginLeft: 5,
    textAlign: 'left',
    color: '#3b3a3a',
    fontSize: 15,
    fontWeight: 'bold',
  },
  productCondition: {
    marginLeft: 5,
    color: '#848281',
    textAlign: 'left',
  },
});
