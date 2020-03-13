import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  FlatList,
  TouchableOpacity,
  TouchableNativeFeedback,
  LayoutAnimation,
  NativeModules,
  TextInput,
} from 'react-native';
import {getCover, Novel, Chapter} from '../domain';
import http from '../request';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import AsyncStorage from '@react-native-community/async-storage';

const {UIManager} = NativeModules;

UIManager.setLayoutAnimationEnabledExperimental &&
  UIManager.setLayoutAnimationEnabledExperimental(true);

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
  timeId: number,
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
        size: 10,
      },
      totalPages: 1,
      hidden: false,
      timeId: 0,
      skipText: '',
      record: null,
    };
    this.props.navigation.setOptions({
      title: props.route.params.novel.name,
    });
    this.renderChapter = this.renderChapter.bind(this);
    this.getPage = this.getPage.bind(this);
    this.renderInfo = this.renderInfo.bind(this);
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
          record: JSON.parse(str),
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

  getPage(): Page {
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
      param = this.getPage();
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
    index = parseInt(text, 10) - 1;
    if (text) {
      if (index >= 0 || index < this.state.totalPages) {
        let param: Page = {
          bookId: this.state.novel.id,
          index: this.state.page.index,
          size: this.state.page.size,
        };
        param.index = index;
        this.setState({
          index: param.index + 1,
          size: param.size,
        });
        http.get('/chapter', param).then(res => {
          param.index = param.index + 1;
          this.setState({
            chapters: res.data.content,
            totalPages: res.data.totalPages,
            skipText: this.state.page.index.toString(),
          });
        });
        return;
      }
    }
    this.setState({
      skipText: this.state.page.index,
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
  renderInfo() {
    if (this.state.hidden) {
      return <View />;
    } else {
      return (
        <View>
          <View style={styles.info}>
            <Image
              source={{uri: getCover(this.state.novel.id)}}
              style={styles.thumbnail}
            />
            <View style={styles.rightContainer}>
              <Text style={styles.infoText}>{this.state.novel.name}</Text>
              <Text style={styles.infoText}>
                作者：{this.state.novel.author.name}
              </Text>
              {this.state.record ? (
                <TouchableOpacity
                  onPress={() => {
                    this.props.navigation.navigate('Read', {
                      chapter: this.state.record,
                      novel: this.state.novel,
                    });
                  }}>
                  <Text style={styles.continue}>继续阅读</Text>
                </TouchableOpacity>
              ) : null}
            </View>
          </View>
          <View style={styles.introduce}>
            <Text style={styles.title}>简介：</Text>
            <Text>{this.state.novel.introduce}</Text>
          </View>
        </View>
      );
    }
  }
  render() {
    return (
      <View style={styles.container}>
        {this.renderInfo()}
        <View style={styles.chapterContainer}>
          <View style={styles.ChapterListBox}>
            <TouchableNativeFeedback
              onPress={() => {
                LayoutAnimation.linear();
                LayoutAnimation.configureNext({
                  duration: 100,
                  update: {
                    type: 'linear',
                    property: 'opacity',
                  },
                });
                this.setState({
                  hidden: !this.state.hidden,
                });
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
                onChangeText={text => {
                  clearTimeout(this.state.timeId);
                  let timeId = setTimeout(() => {
                    this.searchChapter(text);
                  }, 500);

                  this.setState({
                    timeId: timeId,
                    skipText: text,
                  });
                }}
              />
              <Text style={styles.pageText}>页</Text>
            </View>
          </View>

          <FlatList
            data={this.state.chapters}
            renderItem={this.renderChapter}
            keyExtractor={item => item.id.toString()}
            onEndReachedThreshold={0.1}
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

const coverWidth = 0.3 * width;
const coverHeight = (coverWidth * 81) / 53;

const styles = StyleSheet.create({
  thumbnail: {
    width: coverWidth,
    height: coverHeight,
  },
  container: {
    flex: 1,
    margin: 0.05 * width,
  },
  info: {
    flexDirection: 'row',
    backgroundColor: 'white',
    height: coverHeight + 0.1 * width,
    padding: 0.05 * width,
  },
  rightContainer: {
    marginLeft: 0.05 * width,
  },
  infoText: {
    fontSize: 20,
    width: width * 0.5,
    paddingTop: 0.05 * width,
    paddingBottom: 0.05 * width,
  },
  introduce: {
    padding: 0.05 * width,
    backgroundColor: 'white',
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
  },
  continue: {
    fontSize: 15,
    width: width * 0.2,
    paddingTop: 0.01 * width,
    paddingBottom: 0.01 * width,
    marginTop: 0.03 * width,
    marginBottom: 0.03 * width,
    marginLeft: 0.1 * width,
    textAlign: 'center',
    backgroundColor: 'orange',
    color: 'white',
  },
});
