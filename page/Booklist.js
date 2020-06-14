import React from 'react';
import {
  Image,
  View,
  Text,
  FlatList,
  Dimensions,
  StyleSheet,
  TouchableNativeFeedback,
  SafeAreaView,
} from 'react-native';
import http from '../request';
import {Novel, getCover, Version} from '../domain';
import AsyncStorage from '@react-native-community/async-storage';

const {width, height} = Dimensions.get('window');

type Props = {};

type State = {
  novels: Array<Novel>,
  refresh: boolean,
};

export default class Home extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      novels: [],
      refresh: false,
    };

    this.renderNovel = this.renderNovel.bind(this);
    this.loadData = this.loadData.bind(this);
    if (!Version.getChecked()) {
      http.post('/version').then(res => {
        if (!Version.check(res.data)) {
          this.props.navigation.navigate('Update');
        }
      });
    }
    this.loadData();
  }
  loadData() {
    this.setState({
      novels: [],
      refresh: true,
    });
    this.getMessage();
  }
  async getMessage() {
    let ret = [];
    let keyArray = await AsyncStorage.getAllKeys();
    for (let key of keyArray) {
      let date = JSON.parse(await AsyncStorage.getItem(key)).date;
      ret.push({id: key, date: date});
    }
    ret = ret.sort((a, b) => {
      return a.date < b.date;
    });
    for (let e of ret) {
      let res = await http.get('/find', {id: e.id});
      this.setState({
        novels: [...this.state.novels, res.data],
      });
    }
    this.setState({
      refresh: false,
    });
  }
  renderNovel({item}) {
    return (
      <TouchableNativeFeedback
        onPress={() => {
          this.props.navigation.navigate('Detail', {novel: item});
        }}>
        <View style={styles.container}>
          <Image source={{uri: getCover(item.id)}} style={styles.thumbnail} />
          <View style={styles.rightContainer}>
            <Text style={styles.name}>{item.name}</Text>
          </View>
        </View>
      </TouchableNativeFeedback>
    );
  }
  render() {
    return (
      <SafeAreaView style={styles.bodyContainer}>
        <View style={styles.title}>
          <Text style={styles.titleWord}>我的书架</Text>
        </View>
        <FlatList
          data={this.state.novels}
          renderItem={this.renderNovel}
          style={styles.list}
          keyExtractor={item => item.id.toString()}
          numColumns={3}
          columnWrapperStyle={styles.warp}
          ListEmptyComponent={<Text style={styles.tip}>暂无数据</Text>}
          ListFooterComponent={
            <View>
              <Text style={styles.tip}>没有更多了！</Text>
            </View>
          }
          refreshing={this.state.refresh}
          onRefresh={this.loadData}
        />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  word: {
    fontSize: 20,
    width: 30,
    height: 30,
    textAlign: 'center',
    borderRadius: 15,
    backgroundColor: '#DA4444',
    color: 'white',
  },
  titleWord: {
    fontSize: 20,
    marginTop: 40,
    textAlign: 'left',
    paddingLeft: 0.1 * width,
    color: '#888888',
    borderBottomWidth: 1,
  },
  container: {
    alignItems: 'center',
    backgroundColor: 'white',
    margin: 0.02 * width,
    paddingTop: 0.02 * width,
    paddingRight: 0.05 * width,
    marginTop: 5,
    width: 0.3 * width,
    height: 0.2 * height,
  },
  thumbnail: {
    width: 53,
    height: 80,
  },
  rightContainer: {
    flex: 1,
    textAlign: 'left',
  },
  name: {
    fontSize: 14,
    marginBottom: 5,
    textAlign: 'center',
  },
  author: {
    textAlign: 'left',
  },
  list: {
    marginTop: 0.05 * width,
    marginBottom: 0.05 * width,
    backgroundColor: 'white',
  },
  tip: {
    textAlign: 'center',
    marginTop: 10,
    paddingTop: 10,
    paddingBottom: 10,
    marginBottom: 50,
    color: 'gray',
  },
  bodyContainer: {
    backgroundColor: 'white',
  },
  warp: {
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
});
