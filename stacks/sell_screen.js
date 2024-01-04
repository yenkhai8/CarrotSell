import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Platform,
  PermissionsAndroid,
  ScrollView,
  TextInput,
  number,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';

import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {Button} from 'react-native-paper';
import SQLite from 'react-native-sqlite-storage';

const db = SQLite.openDatabase(
  {
    name: 'data',
  },
  () => {},
  error => {
    console.log(error);
  },
);

const SellScreen = ({navigation}) => {
  const [image_uri, setUri] = useState(' ');
  const [filePath, setFilePath] = useState({});
  const [title, setTitle] = useState('');
  const [brand, setBrand] = useState('');
  const [desc, setDesc] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('Apparel');
  const [condition, setCondition] = useState('Well Used');
  const [delivery_method, setDelivery_method] = useState('Poslaju');

  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Camera Permission',
            message: 'App needs camera permission',
          },
        );
        // If CAMERA Permission is granted
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    } else return true;
  };

  const requestExternalWritePermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'External Storage Write Permission',
            message: 'App needs write permission',
          },
        );
        // If WRITE_EXTERNAL_STORAGE Permission is granted
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        alert('Write permission err', err);
      }
      return false;
    } else return true;
  };

  const captureImage = async type => {
    let options = {
      mediaType: type,
      maxWidth: 300,
      maxHeight: 550,
      quality: 1,
      saveToPhotos: true,
    };
    let isCameraPermitted = await requestCameraPermission();
    let isStoragePermitted = await requestExternalWritePermission();
    if (isCameraPermitted && isStoragePermitted) {
      launchCamera(options, response => {
        console.log('Response = ', response);

        if (response.didCancel) {
          alert('User cancelled camera picker');
          return;
        } else if (response.errorCode == 'camera_unavailable') {
          alert('Camera not available on device');
          return;
        } else if (response.errorCode == 'permission') {
          alert('Permission not satisfied');
          return;
        } else if (response.errorCode == 'others') {
          alert(response.errorMessage);
          return;
        }
        console.log('file_name', response.assets[0].uri);
        setFilePath(response);
        setUri(response.assets[0].uri);
      });
    }
  };

  // const chooseFile = type => {
  //   let options = {
  //     mediaType: type,
  //     maxWidth: 300,
  //     maxHeight: 550,
  //     quality: 1,
  //   };
  //   launchImageLibrary(options, response => {
  //     console.log('Response = ', response);
  //     var res = response.assets[0].uri;

  //     if (response.didCancel) {
  //       alert('User cancelled camera picker');
  //       return;
  //     } else if (response.errorCode == 'camera_unavailable') {
  //       alert('Camera not available on device');
  //       return;
  //     } else if (response.errorCode == 'permission') {
  //       alert('Permission not satisfied');
  //       return;
  //     } else if (response.errorCode == 'others') {
  //       alert(response.errorMessage);
  //       return;
  //     }
  //     console.log('file_name', response.assets[0].uri);
  //     setFilePath(response);
  //     setUri(response.assets[0].uri);
  //   });
  // };

  return (
    <ScrollView>
      <View style={styles.container}>
        <Image source={{uri: image_uri}} style={styles.imageStyle} />
        <View style={styles.button}>
          <TouchableOpacity
            activeOpacity={0.5}
            style={styles.buttonStyle}
            onPress={() => captureImage('photo')}>
            <Text style={styles.textStyle}>Launch Camera for Image</Text>
          </TouchableOpacity>
          {/* <TouchableOpacity
            activeOpacity={0.5}
            style={styles.buttonStyle}
            onPress={() => chooseFile('photo')}>
            <Text style={styles.textStyle}>Choose Image</Text>
          </TouchableOpacity> */}
        </View>
      </View>
      <Text style={styles.text}>Category</Text>
      <Picker
        style={styles.picker}
        selectedValue={category}
        mode={'dialog'}
        prompt={'Select item category'}
        onValueChange={(itemValue, itemIndex) => setCategory(itemValue)}>
        <Picker.Item label="Apparel" value="Apparel" />
        <Picker.Item
          label="Computer & Accessory"
          value="Computer & Accessory"
        />
        <Picker.Item label="Home & Living" value="Home & Living" />
        <Picker.Item label="Mobile & Accessory" value="Mobile & Accessory" />
        <Picker.Item label="Health & Beauty" value="Health & Beauty" />
        <Picker.Item label="Car & Accessory" value="Car & Accessory" />
        <Picker.Item label="Misc" value="Misc" />
        <Picker.Item label="Decoration" value="Decoration" />
      </Picker>
      <Text style={styles.text}> Title</Text>
      <TextInput
        style={styles.input}
        placeholder="Item name"
        onChangeText={value => setTitle(value)}
      />
      <Text style={styles.text}> Description</Text>
      <TextInput
        style={styles.input}
        multiline
        placeholder="Item description"
        onChangeText={value => setDesc(value)}
      />
      <Text style={styles.text}> Prices</Text>
      <TextInput
        style={styles.input}
        multiline
        placeholder="Price"
        value={number}
        keyboardType="numeric"
        onChangeText={value => setPrice(value)}
      />
      <Text style={styles.text}> Brand</Text>
      <TextInput
        style={styles.input}
        placeholder="Brand"
        onChangeText={value => setBrand(value)}
      />
      <Text style={styles.text}>Conditions</Text>
      <Picker
        style={styles.picker}
        selectedValue={condition}
        mode={'dialog'}
        onValueChange={(itemValue, itemIndex) => setCondition(itemValue)}
        prompt={'Item condition'}>
        <Picker.Item label="Well Used" value="Well Used" />
        <Picker.Item label="New" value="New" />
        <Picker.Item label="Worn out" value="Worn out" />
        <Picker.Item label="Good condition" value="Good condition" />
      </Picker>
      <Text style={styles.text}>Delivery method</Text>
      <Picker
        style={styles.picker}
        selectedValue={delivery_method}
        mode={'dialog'}
        prompt={'Select delivery method'}
        onValueChange={(itemValue, itemIndex) => setDelivery_method(itemValue)}>
        <Picker.Item label="Poslaju" value="Poslaju" />
        <Picker.Item label="Lalamove" value="Lalamove" />
        <Picker.Item label="Self Pickup" value="Self Pickup" />
      </Picker>
      <TouchableOpacity
        activeOpacity={0.5}
        style={styles.buttonStyle}
        onPress={() =>
          navigation.navigate('Preview Item', {
            name_Key: title,
            brand_Key: brand,
            desc_Key: desc,
            price_Key: price,
            category_Key: category,
            condition_Key: condition,
            delivery_method_Key: delivery_method,
            image_Key: image_uri,
          })
        }>
        <Text style={styles.textStyle}>Preview item</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default SellScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  titleText: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingVertical: 20,
  },
  textStyle: {
    padding: 10,
    color: 'black',
    textAlign: 'center',
  },
  buttonStyle: {
    backgroundColor: '#e68c3d',
    padding: 5,
    margin: 15,
    width: 185,
    alignSelf: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  imageStyle: {
    width: 170,
    height: 170,
  },
  button: {
    flexDirection: 'row',
  },
  picker: {
    color: '#000000',
    margin: 10,
  },
  text: {
    color: '#000000',
    fontSize: 20,
    margin: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#555',
    borderRadius: 10,
    fontSize: 15,
    margin: 10,
  },
});

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 10,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//   },
//   titleText: {
//     fontSize: 22,
//     fontWeight: 'bold',
//     textAlign: 'center',
//     paddingVertical: 20,
//   },
//   textStyle: {
//     padding: 10,
//     color: 'black',
//     textAlign: 'center',
//   },
//   buttonStyle: {
//     backgroundColor: '#DDDDDD',
//     padding: 5,
//     margin: 5,
//   },
//   imageStyle: {
//     width: 100,
//     height: 100,
//   },
//   button: {
//     flexDirection: 'row',
//   },
//   picker: {
//     color: 'maroon',
//     margin: 10,
//   },
//   text: {
//     color: '#000000',
//     fontSize: 20,
//     margin: 5,
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: '#555',
//     borderRadius: 5,
//     fontSize: 15,
//     margin: 5,
//   },
// });
