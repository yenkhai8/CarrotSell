import React, {Component} from 'react';
import {
  Text,
  View,
  ScrollView,
  Button,
  StyleSheet,
  Image,
  TextInput,
  FlatList,
  TouchableHighlight,
  TouchableOpacity,
} from 'react-native';
import {SliderBox} from 'react-native-image-slider-box';

let SQLite = require('react-native-sqlite-storage');

export default class SearchScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      search: '',
    };

    this.db = SQLite.openDatabase(
      {name: 'data'},
      this.openCallback,
      this.errorCallback,
    );
    this._query = this._query.bind(this);
    this._queryByName = this._queryByName.bind(this);
  }

  componentDidMount() {
    this._query();
  }

  _query() {
    this.db.transaction(tx =>
      tx.executeSql('SELECT * FROM item ORDER BY id', [], (tx, results) => {
        this.setState({items: results.rows.raw()});
      }),
    );
  }

  setItemsToNull() {
    this.setState({items: null});
  }

  _queryByName() {
    this.db.transaction(tx =>
      tx.executeSql(
        'SELECT * FROM item WHERE name LIKE ?',
        [this.state.search],
        (tx, results) => {
          this.setState({items: results.rows.raw()});
          console.log(results.rows.raw());
        },
      ),
    );
  }

  openCallback() {
    console.log('database open successfully');
  }

  errorCallback(err) {
    console.log('database failed!!!!' + err);
  }

  // other component code ...

  render() {
    return (
      <View style={styles.container}>
        <View>
          <View style={styles.flexrow}>
            <TextInput
              style={styles.input}
              value={this.state.search}
              onChangeText={search => this.setState({search})}
              placeholder="Search Karotsell"
            />
            <View style={styles.fixToEnd}>
              <TouchableOpacity
                onPress={() => {
                  this.setItemsToNull();
                  this._queryByName();
                }}
                style={styles.appButtonContainer}>
                <Text style={styles.appButtonText}>Search</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.displayContainer}>
            <FlatList
              data={this.state.items}
              showsVerticalScrollIndicator={true}
              renderItem={({item}) => (
                <View style={styles.individualProduct}>
                  <TouchableHighlight
                    onPress={() => {
                      this.props.navigation.navigate('ProductScreen', {
                        id: item.id,
                      });
                    }}
                    underlayColor={'#cccccc'}>
                    <Image
                      style={styles.productImage}
                      source={{uri: item.image}}
                    />
                  </TouchableHighlight>
                  <View>
                    <Text style={styles.productName}>{item.name}</Text>
                    <Text style={styles.productPrice}>{item.price}</Text>
                    <Text style={styles.productCondition}>
                      {item.condition}
                    </Text>
                  </View>
                </View>
              )}
              keyExtractor={item => {
                item.id.toString();
              }}
              numColumns={2}
            />
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: 'pink',
    marginHorizontal: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  button: {
    backgroundColor: 'E68C3D',
    fontSize: 50,
    width: 40,
    height: 3,
  },
  description: {
    fontSize: 15,
    lineHeight: 25,
    marginLeft: 10,
  },
  payment: {
    width: 50,
    height: 50,
  },
  producticon: {
    width: 18,
    height: 18,
    marginLeft: 10,
  },
  fixToText: {
    flexDirection: 'row',
    marginLeft: 10,
    justifyContent: 'flex-start',
  },
  fixToEnd: {
    flexDirection: 'row',
    marginRight: 5,
    marginTop: 12,
    marginBottom: 12,
    justifyContent: 'flex-end',
  },

  descContainer: {
    marginTop: 10,
    marginBottom: 10,
  },

  flexrow: {
    flexDirection: 'row',
    marginRight: 15,
  },

  input: {
    height: 40,
    width: '70%',
    margin: 12,
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    borderColor: '#bebbb9',
  },
  displayContainer: {
    marginTop: 15,
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
  appButtonContainer: {
    elevation: 8,
    backgroundColor: '#eb9142',
    borderRadius: 10,
    paddingVertical: 5,
    paddingHorizontal: 12,
    height: 40,
  },
  appButtonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
    alignSelf: 'center',
    textTransform: 'uppercase',
  },
});
