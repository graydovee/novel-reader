import React from 'react';
import {
  StyleSheet,
  Dimensions,
  Text,
  View,
  Modal,
  ActivityIndicator,
  Linking,
  TouchableOpacity,
} from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

export default class Update extends React.Component<Props, State> {
  open() {
    let url = 'https://admin.ndovel.com/download';
    return Linking.openURL(url);
  }
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>检测到更新版本</Text>
        <TouchableOpacity onPress={this.open}>
          <View style={styles.box}>
            <Text style={styles.text}>点击下载</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 25,
  },
  text: {
    fontSize: 20,
    color: '#0391ff',
  },
});
