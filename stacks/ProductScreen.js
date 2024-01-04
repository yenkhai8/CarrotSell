import React, {Component} from 'react';
import {
  Text,
  View,
  ScrollView,
  Button,
  StyleSheet,
  Image,
  FlatList,
  TouchableHighlight,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import Slideshow from 'react-native-image-slider-show';

let SQLite = require('react-native-sqlite-storage');
let common = require('../CommonData');

export default class ProductScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      payment_logo: [
        require('../img/bullet.png'),
        require('../img/bullet.png'),
        require('../img/bullet.png'),
      ],
      imageURL: '',
      position: 1,
      interval: null,
      dataSource: [{url: ''}],
      id: this.props.route.params.id,
    };

    this.db = SQLite.openDatabase(
      {name: 'data'},
      this.openCallback,
      this.errorCallBack,
    );

    this._query = this._query.bind(this);
    this._queryImage = this._queryImage.bind(this);
  }

  componentDidMount() {
    this._query();
    this._queryImage();
  }
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

  openCallback() {
    console.log('database open successfully');
  }

  errorCallback(err) {
    console.log('database failed!!!!' + err);
  }

  // other component code ...

  render() {
    return (
      <View>
        {/* <Text>{this.state.imageURL}</Text> */}
        <ScrollView style={styles.container}>
          <View>
            <StatusBar backgroundColor="#eb9142" barStyle="light-content" />
            {/**************** Product Photo ******************/}
            <View>
              <Slideshow
                dataSource={[{url: this.state.imageURL}]}
                position={this.state.position}
                onPositionChanged={position => this.setState({position})}
              />
            </View>
            {/**************** Product Photo ******************/}
            <View style={styles.detailsContainer}>
              <FlatList
                data={this.state.items}
                showsVerticalScrollIndicator={true}
                renderItem={({item}) => (
                  <TouchableHighlight underlayColor={'#cccccc'}>
                    <View style={styles.individualProduct}>
                      <Image
                        style={styles.productImage}
                        source={{uri: item.image}}
                      />
                      <View>
                        <Image
                          style={{
                            width: 120,
                            height: 40,
                            marginTop: 10,
                            resizeMode: 'center',
                          }}
                          source={require('../img/certified.png')}
                        />
                        <Text style={styles.productName}>{item.name}</Text>
                        <Text style={styles.subtitle}>{item.price}</Text>
                        <Text style={styles.description}>
                          {item.date_posted} by Chlorine
                        </Text>
                        <View style={styles.fixToText}>
                          <Image
                            style={styles.producticon}
                            source={require('../img/bullet.png')}
                          />
                          <Text style={styles.description}> 8 likes </Text>
                        </View>
                        <View style={styles.fixToText}>
                          <Image
                            style={styles.producticon}
                            source={require('../img/bullet.png')}
                          />
                          <Text style={styles.description}>
                            {item.condition}{' '}
                          </Text>
                        </View>
                        <View style={styles.fixToText}>
                          <Image
                            style={styles.producticon}
                            source={require('../img/bullet.png')}
                          />
                          <Text style={styles.description}>
                            {' '}
                            {item.category}{' '}
                          </Text>
                        </View>
                        <View style={styles.fixToText}>
                          <Image
                            style={styles.producticon}
                            source={require('../img/bullet.png')}
                          />
                          <Text style={styles.description}>
                            {' '}
                            {item.description}{' '}
                          </Text>
                        </View>
                        <Text style={styles.description}>
                          {' '}
                          Brand: {item.brand}{' '}
                        </Text>
                      </View>
                      <View style={styles.descContainer}>
                        <Text style={styles.subtitle}> Getting This </Text>
                        <Text style={styles.description}>
                          {' '}
                          Ask your seller for delivery. Stay safe at home{' '}
                        </Text>
                        <Text style={styles.description}>
                          {' '}
                          Mailing: {item.delivery}{' '}
                        </Text>
                        <Text style={styles.description}>
                          {' '}
                          Meet up: {item.meetup}{' '}
                        </Text>
                      </View>
                      <View style={styles.descContainer}>
                        <Text style={styles.subtitle}>Payment methods</Text>
                        <View style={styles.fixToText}>
                          <Image
                            style={styles.payment}
                            source={require('../img/visa.png')}
                          />
                          <Image
                            style={styles.payment}
                            source={require('../img/mastercard.png')}
                          />
                          <Image
                            style={styles.payment}
                            source={require('../img/tng.png')}
                          />
                        </View>
                      </View>
                      <View style={styles.descContainer}>
                        <Text style={styles.subtitle}>Meet The Seller</Text>
                        <View style={styles.fixToText}>
                          <Image
                            style={styles.payment}
                            source={require('../img/profilepic.png')}
                          />
                          <Text style={styles.description}>Chlorine Loke</Text>
                        </View>
                      </View>

                      <View style={styles.descContainer}>
                        <Text style={styles.subtitle}>Reviews</Text>
                        <Text style={styles.description}>{item.review}</Text>
                      </View>
                    </View>
                  </TouchableHighlight>
                )}
                keyExtractor={item => {
                  item.id.toString();
                }}
                numColumns={2}
              />
              <View style={styles.descContainer}></View>
            </View>
          </View>
          <View style={styles.fixToEnd}>
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate('BuyScreen',{id:this.state.id})}
              style={styles.appButtonContainer}>
              <Text style={styles.appButtonText}>Buy</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: 'pink',
    marginHorizontal: 20,
  },
  productName: {
    fontSize: 26,
    fontWeight: 'bold',
    marginTop: 10,
  },
  subtitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 5,
    marginBottom: 5,
    color: '#494846',
  },
  detailsContainer: {
    marginLeft: 15,
  },
  description: {
    fontSize: 17,
    lineHeight: 25,
    marginTop: 3,
    marginLeft: 3,
  },
  payment: {
    width: 50,
    height: 50,
    resizeMode: 'center',
    paddingHorizontal: 30,
  },
  producticon: {
    marginLeft: 2,
    width: 18,
    height: 18,
    marginTop: 7,
  },
  fixToText: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  fixToEnd: {
    marginHorizontal: 30,
    marginBottom: 30,
  },

  descContainer: {
    marginTop: 10,
    marginBottom: 10,
  },
  appButtonContainer: {
    elevation: 8,
    backgroundColor: '#eb9142',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  appButtonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
    alignSelf: 'center',
    textTransform: 'uppercase',
  },
});
