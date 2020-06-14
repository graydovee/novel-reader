import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  FlatList,
  TouchableOpacity,
  TouchableNativeFeedback,
  NativeModules,
  TextInput,
  Platform,
} from 'react-native';
import {getCover, Novel, Chapter} from '../domain';
import http from '../request';
import NovelDetail from './commpent/NovelDetail';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import AsyncStorage from '@react-native-community/async-storage';
const {UIManager} = NativeModules;

if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

type Page = {
  bookId: number,
  index: number,
  size: number,
};

type State = {
  chapters: Array<Chapter>,
  novel: Novel,
  page: Page,
  totalPages: 1,
  hidden: boolean,
  skipText: string,
  record: Chapter,
};

type Props = {};

const {width} = Dimensions.get('window');

export default class Detail extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      chapters: [],
      novel: props.route.params.novel,
      page: {
        index: 1,
        size: 50,
      },
      totalPages: 1,
      hidden: false,
      skipText: '',
      record: null,
    };
    props.navigation.setOptions({
      title: props.route.params.novel.name,
    });
    this.renderChapter = this.renderChapter.bind(this);
    this.getNextPage = this.getNextPage.bind(this);
    this.searchChapter = this.searchChapter.bind(this);
    this.fetchData = this.fetchData.bind(this);

    let data: Page = {
      bookId: this.state.novel.id,
      index: 0,
      size: this.state.page.size,
    };
    this.fetchData(data);
    AsyncStorage.getItem(this.state.novel.id.toString()).then(str => {
      if (str) {
        this.setState({
          record: JSON.parse(str).id,
        });
      }
    });
  }

  static getDerivedStateFromProps(props, state) {
    if (props.route.params.chapter) {
      return {
        record: props.route.params.chapter,
      };
    }
    return null;
  }

  getNextPage(): Page {
    let data: Page = {
      bookId: this.state.novel.id,
      index: this.state.page.index,
      size: this.state.page.size,
    };
    this.setState({
      page: {
        index: this.state.page.index + 1,
        size: this.state.page.size,
      },
    });
    return data;
  }
  fetchData(param) {
    if (!param) {
      if (this.state.page.index >= this.state.totalPages) {
        return;
      }
      param = this.getNextPage();
    }
    http.get('/chapter', param).then(res => {
      this.setState({
        chapters: [...this.state.chapters, ...res.data.content],
        totalPages: res.data.totalPages,
        skipText: this.state.page.index.toString(),
      });
    });
  }
  searchChapter(text: string) {
    let index: number;
    index = text ? parseInt(text, 10) - 1 : 0;
    if (index < 0) {
      index = 0;
    } else if (index >= this.state.totalPages) {
      index = this.state.totalPages - 1;
    }
    let param: Page = {
      bookId: this.state.novel.id,
      index: index,
      size: this.state.page.size,
    };
    this.setState({
      page: {
        index: index + 1,
        size: this.state.page.size,
      },
    });
    http.get('/chapter', param).then(res => {
      this.setState({
        chapters: res.data.content,
        totalPages: res.data.totalPages,
        skipText: this.state.page.index.toString(),
      });
    });
  }
  renderChapter({item}) {
    return (
      <TouchableOpacity
        onPress={() => {
          this.props.navigation.navigate('Read', {
            chapter: item,
            novel: this.state.novel,
          });
        }}>
        <Text style={styles.chapter}>{item.title}</Text>
      </TouchableOpacity>
    );
  }
  render() {
    return (
      <View style={styles.container}>
        <NovelDetail
          cover={{uri: getCover(this.state.novel.id)}}
          name={this.state.novel.name}
          author={this.state.novel.author.name}
          introduce={this.state.novel.introduce}
          ref={detail => {
            this.novelDetail = detail;
          }}
          buttonPress={() => {
            this.props.navigation.navigate('Read', {
              chapter: this.state.record
                ? this.state.record
                : this.state.chapters[0],
              novel: this.state.novel,
            });
          }}
          buttonText={
            this.state.chapters && this.state.chapters.length
              ? this.state.record
                ? '继续阅读'
                : '开始阅读'
              : ''
          }
        />
        <View style={styles.chapterContainer}>
          <View style={styles.ChapterListBox}>
            <TouchableNativeFeedback
              onPress={() => {
                this.novelDetail.hiddenIntro();
              }}>
              <View style={styles.chapterListTitle}>
                <Text style={styles.title}>
                  <EvilIcons name={'navicon'} size={18} />
                  章节列表：
                </Text>
              </View>
            </TouchableNativeFeedback>
            <View style={styles.pager}>
              <Text style={styles.pageText}>第</Text>
              <TextInput
                style={styles.input}
                value={this.state.skipText}
                blurOnSubmit={false}
                caretHidden={true}
                clearTextOnFocus={true}
                keyboardType={'number-pad'}
                ref={e => (this.textInput = e)}
                onChangeText={text => {
                  this.setState({
                    skipText: text,
                  });
                }}
                onFocus={() => {
                  this.setState({
                    skipText: '',
                  });
                }}
              />
              <Text style={styles.pageText}>
                /&nbsp;{this.state.totalPages}页
              </Text>
              <TouchableOpacity
                onPress={() => {
                  this.textInput.blur();
                  this.searchChapter(this.state.skipText);
                }}>
                <Text style={styles.skip}>跳转</Text>
              </TouchableOpacity>
            </View>
          </View>

          <FlatList
            data={this.state.chapters}
            renderItem={this.renderChapter}
            keyExtractor={item => item.id.toString()}
            onEndReachedThreshold={0.3}
            onEndReached={() => {
              this.fetchData();
            }}
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
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 0.05 * width,
  },
  title: {
    fontSize: 18,
  },
  chapterContainer: {
    flex: 1,
    backgroundColor: 'white',
    marginTop: 10,
  },
  tip: {
    textAlign: 'center',
    color: 'gray',
  },
  chapterListTitle: {
    padding: 0.05 * width,
    shadowOffset: {
      width: 1,
      height: -1,
    },
  },
  chapter: {
    paddingLeft: 0.05 * width,
    paddingRight: 0.05 * width,
    paddingTop: 0.01 * width,
    paddingBottom: 0.01 * width,
  },
  ChapterListBox: {
    flexDirection: 'row',
  },
  pager: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginRight: 0.05 * width,
  },
  pageText: {
    paddingTop: 0.05 * width,
    paddingBottom: 0.05 * width,
    fontSize: 14,
  },
  input: {
    padding: 0,
    marginTop: 0.05 * width,
    height: 20,
    textAlign: 'center',
    textAlignVertical: 'center',
    color: '#409EFF',
  },
  skip: {
    paddingTop: 0.05 * width,
    paddingBottom: 0.05 * width,
    fontSize: 14,
    marginLeft: 0.02 * width,
    color: '#409EFF',
  },
});
