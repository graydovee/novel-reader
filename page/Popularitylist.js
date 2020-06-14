import React from 'react';
import {
  Image,
  View,
  Text,
  FlatList,
  Dimensions,
  StyleSheet,
  SafeAreaView,
  Platform,
  TouchableNativeFeedback,
} from 'react-native';
import http from '../request';
import {Novel, getCover, Version} from '../domain';

const {width} = Dimensions.get('window');

type Props1 = {};

type Props = {
  bookId: number,
  visit: number,
  index: number,
  skip: Function,
};

type State2 = {
  novel: Novel,
};

type State = {
  novels: Array<Novel>,
  ranks: Array,
};

class Item extends React.Component<Props, State2> {
  constructor(props) {
    super(props);
    this.state = {
      novel: {
        author: {},
      },
    };
    this.fetchData = this.fetchData.bind(this);
    this.fetchData();
  }
  fetchData() {
    http.get('/find', {id: this.props.bookId}).then(res => {
      this.setState({
        novel: res.data,
      });
    });
  }
  getURI(id) {
    let uri = getCover(id);
    if (uri) {
      return {uri: uri};
    } else {
      return require('../images/nopic.jpg');
    }
  }
  render() {
    return (
      <View>
        <TouchableNativeFeedback
          onPress={() => {
            if (this.state.novel) {
              this.props.skip(this.state.novel.id);
            }
          }}>
          <View>
            {this.state.novel ? (
              <View style={styles.container}>
                <Image
                  source={this.getURI(this.state.novel.id)}
                  style={styles.thumbnail}
                />
                <View style={styles.rightContainer}>
                  <Text style={styles.name}>{this.state.novel.name}</Text>
                  <Text style={styles.author}>
                    {this.state.novel.author.name}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.word,
                    bgColor(this.props.index + 1),
                    fontSize(this.props.index + 1),
                  ]}>
                  {this.props.index + 1}
                </Text>
              </View>
            ) : null}
          </View>
        </TouchableNativeFeedback>
      </View>
    );
  }
}

export default class SampleAppMovies extends React.Component<Props1, State> {
  constructor(props) {
    super(props);
    this.state = {
      novels: [],
      ranks: [],
    };

    this.fetchData = this.fetchData.bind(this);
    if (!Version.getChecked()) {
      http.post('/version').then(res => {
        if (!Version.check(res.data)) {
          this.props.navigation.navigate('Update');
        }
      });
    }

    this.fetchData();
  }
  fetchData() {
    http.get('/topBook').then(res => {
      this.setState({
        ranks: res.data,
      });
      this.load();
    });
  }

  load() {
    this.setState({
      novels: [...this.state.novels, ...this.state.ranks.slice(0, 10)],
      ranks: this.state.ranks.splice(10),
    });
  }

  navigate(id) {
    this.props.navigation.navigate('Detail', {novel: id});
  }

  renderNovel({item, index}) {
    return (
      <Item
        visit={item.visit}
        bookId={item.bookId}
        index={index}
        skip={this.navigate.bind(this)}
      />
    );
  }

  render() {
    return (
      <SafeAreaView style={styles.bodyContainer}>
        <View style={styles.title}>
          <Text style={styles.titleWord}>阅读量排行榜</Text>
        </View>

        <FlatList
          data={this.state.novels}
          renderItem={this.renderNovel.bind(this)}
          style={styles.list}
          keyExtractor={(item, index) => index.toString()}
          ListEmptyComponent={<Text style={styles.tip}>暂无数据</Text>}
          ListFooterComponent={
            <View>
              <Text style={styles.tip}>没有更多了！</Text>
            </View>
          }
          onEndReachedThreshold={0.3}
          onEndReached={() => {
            this.load();
          }}
        />
      </SafeAreaView>
    );
  }
}

function bgColor(index) {
  if (index === 1) {
    return {backgroundColor: '#DA4444'};
  } else if (index === 2) {
    return {backgroundColor: '#BC39E2'};
  } else if (index === 3) {
    return {backgroundColor: '#FF9036'};
  } else {
    return {backgroundColor: '#FFFFFF', color: 'black', borderWidth: 1};
  }
}

function fontSize(index) {
  if (index > 999) {
    return {fontSize: 10};
  } else if (index > 99) {
    return {fontSize: 12};
  } else {
    return {fontSize: 18};
  }
}

const styles = StyleSheet.create({
  word: {
    width: 30,
    height: 30,
    ...Platform.select({
      ios: {lineHeight: 30},
      android: {},
    }),
    textAlignVertical: 'center',
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
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    margin: 0.02 * width,
    paddingTop: 0.02 * width,
    paddingRight: 0.05 * width,
    paddingLeft: 0.05 * width,
    marginTop: 5,
  },
  thumbnail: {
    width: 53,
    height: 81,
  },
  rightContainer: {
    paddingLeft: 0.05 * width,
    flex: 1,
  },
  name: {
    fontSize: 20,
    marginBottom: 8,
    textAlign: 'left',
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
});
