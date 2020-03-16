import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Dimensions,
  TouchableNativeFeedback,
} from 'react-native';
import http from '../request';
import type {Novel} from '../domain';

const {width} = Dimensions.get('window');

type Props = {};

type TempChapter = {
  name: string,
  title: string,
  url: string,
};

type State = {
  novel: Novel,
  chapters: Array<TempChapter>,
  currentChapter: TempChapter,
  loading: boolean,
};

export default class SearchRead extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      chapters: [],
      currentChapter: props.route.params.chapter,
      novel: props.route.params.novel,
      loading: true,
    };
    this.fetchContent = this.fetchContent.bind(this);
    this.getNext = this.getNext.bind(this);
    this.fetchContent(props.route.params.chapter.url);
  }
  fetchContent(url: string) {
    let param = {
      url: url,
    };
    http
      .post('/spider/content', param)
      .then(res => {
        this.setState({
          chapters: [...this.state.chapters, res.data],
          currentChapter: res.data,
          loading: false,
        });
      })
      .catch(() => {
        this.setState({
          currentChapter: null,
          loading: false,
        });
      });
  }
  getNext() {
    let current: TempChapter = this.state.currentChapter;
    if (this.state.loading || !(current && current.url)) {
      return;
    }
    this.setState({
      loading: true,
    });
    this.fetchContent(current.url);
  }
  static renderContent({item}) {
    return (
      <View style={styles.chapter}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.content}>{item.content}</Text>
      </View>
    );
  }
  render() {
    return (
      <View style={styles.container}>
        <TouchableNativeFeedback
          onPress={() => {
            this.props.navigation.goBack();
          }}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>{this.state.novel.name}</Text>
            <Text style={styles.headerTitleRight}>
              {this.state.currentChapter.title}
            </Text>
          </View>
        </TouchableNativeFeedback>
        <FlatList
          data={this.state.chapters}
          renderItem={SearchRead.renderContent}
          keyExtractor={(item, index) => index.toString()}
          ListEmptyComponent={<Text style={styles.tip}>暂无数据</Text>}
          ListFooterComponent={
            <View>
              <Text style={styles.tip}>
                {this.state.currentChapter && this.state.currentChapter.url
                  ? '正在加载中...'
                  : '没有更多了！'}
              </Text>
            </View>
          }
          onEndReachedThreshold={0.1}
          onEndReached={() => {
            this.getNext();
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  tip: {
    textAlign: 'center',
    color: 'gray',
    backgroundColor: 'antiquewhite',
  },
  container: {
    backgroundColor: 'antiquewhite',
  },
  title: {
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 25,
  },
  chapter: {
    margin: 0.05 * width,
  },
  content: {
    fontSize: 20,
  },
  header: {
    flexDirection: 'row',
  },
  headerTitle: {
    fontSize: 16,
    padding: 0.02 * width,
  },
  headerTitleRight: {
    flex: 1,
    fontSize: 16,
    padding: 0.02 * width,
    textAlign: 'right',
  },
});
