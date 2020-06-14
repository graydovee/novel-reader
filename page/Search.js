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
import Loading from './commpent/Loading';

const {width} = Dimensions.get('window');

type TempNovel = {
  title: string,
  author: string,
  url: string,
};

type Props = {};

type State = {
  novels: Array<TempNovel>,
  loading: boolean,
};

export default class Search extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      novels: [],
      loading: false,
    };
  }

  search(name) {
    let data = {
      name: name,
    };
    this.setState({
      loading: true,
    });
    http
      .post('/spider/search', data)
      .then(res => {
        this.setState({
          novels: res.data,
          loading: false,
        });
      })
      .catch(res => {
        this.setState({
          loading: false,
        });
      });
  }
  renderNovel({item}) {
    return (
      <TouchableNativeFeedback
        onPress={() => {
          this.props.navigation.navigate('SearchDetail', {novel: item});
        }}>
        <View style={styles.container}>
          <Image source={{uri: item.coverUrl}} style={styles.thumbnail} />
          <View style={styles.rightContainer}>
            <Text style={styles.name}>{item.title}</Text>
            <Text style={styles.author}>{item.author}</Text>
          </View>
        </View>
      </TouchableNativeFeedback>
    );
  }
  render() {
    return (
      <View>
        <SearchTextInput fetchData={this.search.bind(this)} />
        <FlatList
          data={this.state.novels}
          renderItem={this.renderNovel.bind(this)}
          style={styles.list}
          keyExtractor={item => item.url}
          ListEmptyComponent={<Text style={styles.tip}>暂无数据</Text>}
        />
        {this.state.loading ? <Loading /> : null}
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
    flex: 0,
    marginTop: 0.05 * width,
    marginBottom: 0.05 * width,
    backgroundColor: 'white',
  },
  tip: {
    textAlign: 'center',
    marginTop: 50,
    paddingTop: 10,
    paddingBottom: 10,
    marginBottom: 50,
    color: 'gray',
  },
});
