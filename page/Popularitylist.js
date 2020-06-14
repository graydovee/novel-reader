import React from 'react';
import {
  Image,
  View,
  Text,
  FlatList,
  Dimensions,
  StyleSheet,
  SafeAreaView,
  TouchableNativeFeedback,
} from 'react-native';
import http from '../request';
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

export default class SampleAppMovies extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      novels: [],
    };

    this.renderNovel = this.renderNovel.bind(this);
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
    http.get('/topBook?size=20').then(res => {
      this.setState({
        novels: res.data,
      });
    });
  }

  renderNovel({item, index}) {
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
          <Text style={[styles.word, bgColor(index + 1)]}>{index + 1}</Text>
        </View>
      </TouchableNativeFeedback>
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
          renderItem={this.renderNovel}
          style={styles.list}
          keyExtractor={item => item.id.toString()}
          ListEmptyComponent={<Text style={styles.tip}>暂无数据</Text>}
          ListFooterComponent={
            <View>
              <Text style={styles.tip}>没有更多了！</Text>
            </View>
          }
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
