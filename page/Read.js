import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Dimensions,
  TouchableNativeFeedback,
} from 'react-native';
import {Chapter} from '../domain';
import http from '../request';
import type {Novel} from '../domain';
import AsyncStorage from '@react-native-community/async-storage';

const {width} = Dimensions.get('window');

type Props = {};

type State = {
  novel: Novel,
  chapters: Array<Chapter>,
  currentChapter: Chapter,
  loading: boolean,
};

async function nextChapter(chapterId: number, novelId: number) {
  let param = {
    chapterId: chapterId,
  };
  let res = await http.post('/chapter', param);
  if (!res.data) {
    return Promise.reject(res);
  }
  let chapter: Chapter = res.data;
  AsyncStorage.setItem(novelId.toString(), JSON.stringify(chapter));
  param = {
    id: chapter.contentId,
  };
  res = await http.get('/content', param);
  if (!res.data) {
    return Promise.reject(res);
  }
  chapter.content = res.data;
  return Promise.resolve(chapter);
}

export default class Read extends React.Component<Props, State> {
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
    this.fetchContent(props.route.params.chapter);
  }
  fetchContent(chapter: Chapter) {
    let param = {
      id: chapter.contentId,
    };
    http.get('/content', param).then(res => {
      chapter.content = res.data;
      this.setState({
        chapters: [...this.state.chapters, chapter],
        loading: false,
      });
    });
  }
  getNext() {
    let current: Chapter = this.state.currentChapter;

    if (this.state.loading || !(current && current.nextChapterId)) {
      return;
    }
    this.setState({
      loading: true,
    });
    nextChapter(current.nextChapterId, this.state.novel.id).then(chapter => {
      this.setState({
        chapters: [...this.state.chapters, chapter],
        currentChapter: chapter,
        loading: false,
      });
    });
  }
  static renderContent({item}) {
    return (
      <View style={styles.chapter}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.content}>{item.content.info}</Text>
      </View>
    );
  }
  render() {
    return (
      <View style={styles.container}>
        <TouchableNativeFeedback
          onPress={() => {
            this.props.navigation.navigate('Detail', {
              novel: this.state.novel,
              chapter: this.state.currentChapter,
            });
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
          renderItem={Read.renderContent}
          keyExtractor={item => item.id.toString()}
          ListEmptyComponent={<Text style={styles.tip}>暂无数据</Text>}
          ListFooterComponent={
            <View>
              <Text style={styles.tip}>
                {this.state.currentChapter.nextChapterId
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
