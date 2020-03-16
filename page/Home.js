import React from 'react';
import {
  Image,
  View,
  Text,
  FlatList,
  Dimensions,
  StyleSheet,
  TouchableNativeFeedback,
} from 'react-native';
import http from '../request';
import SearchTextInput from './commpent/SearchTextInput';
import {Novel, getCover, Version} from '../domain';

const {width} = Dimensions.get('window');

type Page = {
  name: string,
  index: number,
  size: number,
};

type Props = {};

type State = {
  novels: Array<Novel>,
  page: Page,
  totalPages: number,
};

export default class Home extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      novels: [],
      page: {
        name: '',
        index: 0,
        size: 10,
      },
      totalPages: 1,
    };

    this.renderNovel = this.renderNovel.bind(this);
    this.fetchData = this.fetchData.bind(this);
    this.search = this.search.bind(this);
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
    if (this.state.page.index >= this.state.totalPages) {
      return;
    }
    http.get('/book', this.state.page).then(res => {
      this.setState({
        novels: [...this.state.novels, ...res.data.content],
        totalPages: res.data.totalPages,
        page: {
          name: this.state.page.name,
          index: this.state.page.index + 1,
          size: 10,
        },
      });
    });
  }
  search(name) {
    let data = {
      name: name,
      index: 0,
      size: 10,
    };
    http.get('/book', data).then(res => {
      data.index = 1;
      this.setState({
        novels: [...res.data.content],
        totalPages: res.data.totalPages,
        page: data,
      });
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
            <Text style={styles.author}>{item.author.name}</Text>
          </View>
        </View>
      </TouchableNativeFeedback>
    );
  }
  render() {
    return (
      <View>
        <SearchTextInput fetchData={this.search} />
        <FlatList
          data={this.state.novels}
          renderItem={this.renderNovel}
          style={styles.list}
          keyExtractor={item => item.id.toString()}
          ListEmptyComponent={<Text style={styles.tip}>暂无数据</Text>}
          ListFooterComponent={
            <View>
              <Text style={styles.tip}>
                {this.state.page.index < this.state.totalPages
                  ? '正在加载更多...'
                  : '没有更多了！'}
              </Text>
            </View>
          }
          onEndReachedThreshold={0.3}
          onEndReached={() => {
            this.fetchData();
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
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
});
