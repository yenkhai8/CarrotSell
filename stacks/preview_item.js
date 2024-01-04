import React, {Component, useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import SQLite from 'react-native-sqlite-storage';
import AsyncStorage from '@react-native-async-storage/async-storage';


const db = SQLite.openDatabase(
  {
    name: 'data',
  },
  () => {},
  error => {
    console.log(error);
  },
);

const PreviewItem = ({route, navigation}) => {
  const [token, setToken] = useState('');

  const getToken = async () => {
    try {
      const value = await AsyncStorage.getItem('sessionToken');
      if (value !== null) {
        setToken(value);
        console.log('SA PART: ' + value);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getToken();
  }, []);

  const _query = () => {
    db.transaction(tx =>
      tx.executeSql('SELECT * FROM item WHERE sellerID=?', [token], (tx, results) => {
        console.log(results.rows.raw());

      }),
    );
  };

  //REMOVE MEETUP COLUMN, USE "DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL" FOR TIME, ALLOW IMAGE TO BE NULL IDGAF

  const addItem = () => {
    db.transaction(tx => {
      tx.executeSql(
        
        'INSERT INTO item(sellerID, name, condition, category, price, brand, description, delivery, image) VALUES (?,?,?,?,?,?,?,?,?)',
        [
          //token passes properly
          token,
          route.params.name_Key,
          route.params.condition_Key,
          route.params.category_Key,
          route.params.price_Key,
          route.params.brand_Key,
          route.params.desc_Key,
          route.params.delivery_method_Key,
          route.params.image_Key,
        ],
        () => {
          _query();
          Alert.alert('Item Listed Successfully!');
          navigation.navigate('Sell Screen');
        },
      );
    });
  };

  return (

    <ScrollView>
      <View style={styles.container}>
        <Image
          source={{uri: route.params.image_Key}}
          style={styles.imageStyle}
        />
        <Text style={styles.textStyle}>Name: {route.params.name_Key}</Text>
        <Text style={styles.textStyle}>Brand: {route.params.brand_Key}</Text>
        <Text style={styles.textStyle}>
          Description:
          {'\n'}
          {route.params.desc_Key}
        </Text>
        <Text style={styles.textStyle}>Price: {route.params.price_Key}</Text>
        <Text style={styles.textStyle}>
          Category: {route.params.category_Key}
        </Text>
        <Text style={styles.textStyle}>
          Condition: {route.params.condition_Key}
        </Text>
        <Text style={styles.textStyle}>
          Delivery method: {route.params.delivery_method_Key}
        </Text>
      </View>
      <TouchableOpacity
        activeOpacity={0.5}
        style={styles.buttonStyle}
        onPress={addItem}>
        <Text style={styles.textStyle}>Sell your item</Text>
      </TouchableOpacity>
    </ScrollView>
    // <ScrollView>
    //   <View style={styles.container}>
    //     <Image
    //       source={{uri: route.params.image_Key}}
    //       style={styles.imageStyle}
    //     />
    //     <Text style={styles.textStyle}>SellerID: {token}</Text>

    //     <Text style={styles.textStyle}>Name: {route.params.name_Key}</Text>
        
    //     <Text style={styles.textStyle}>Brand: {route.params.brand_Key}</Text>
       
    //     <Text style={styles.textStyle}>Description: {route.params.desc_Key}</Text>
 
    //     <Text style={styles.textStyle}>Price: {route.params.price_Key}</Text>
       
    //     <Text style={styles.textStyle}>Category: {route.params.category_Key}</Text>
       
    //     <Text style={styles.textStyle}>Condition: {route.params.condition_Key}</Text>
        
    //     <Text style={styles.textStyle}>delivery method: {route.params.delivery_method_Key}</Text>
        
    //   </View>
    //   <TouchableOpacity
    //     activeOpacity={0.5}
    //     style={styles.buttonStyle}
    //     onPress={addItem}>
    //     <Text style={styles.textStyle}>Sell your item</Text>
    //   </TouchableOpacity>
    // </ScrollView>
  );
};

export default PreviewItem;

const styles = StyleSheet.create({
  textStyle: {
    fontSize: 18,
    marginVertical: 7,
    marginLeft: 10,
  },
  imageStyle: {
    width: 250,
    height: 250,
    alignSelf: 'center',
    alignItems: 'center',
  },
  buttonStyle: {
    backgroundColor: '#e68c3d',
    padding: 4,
    margin: 10,
    width: 190,
    alignSelf: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
});

// const styles = StyleSheet.create({
//   textStyle: {
//     fontSize: 16,
//     marginVertical: 10,
//   },
//   imageStyle: {
//     width: 100,
//     height: 100,
//   },
//   buttonStyle: {
//     backgroundColor: '#e68c3d',
//     padding: 5,
//     margin: 5,
//     width: 180,
//     alignSelf: 'center',
//     alignItems: 'center',
//     borderRadius: 10,
//   },
// });
