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
  PanResponder,
  Platform,
} from 'react-native';
import {getCover, Novel, Chapter} from '../domain';
import http from '../request';
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
    this.props.navigation.setOptions({
      title: props.route.params.novel.name,
    });
    this.renderChapter = this.renderChapter.bind(this);
    this.getNextPage = this.getNextPage.bind(this);
    this.renderInfo = this.renderInfo.bind(this);
    this.searchChapter = this.searchChapter.bind(this);
    this.fetchData = this.fetchData.bind(this);
    this.hiddenIntro = this.hiddenIntro.bind(this);

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

    this._panResponder = PanResponder.create({
      // Ask to be the responder:
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onStartShouldSetPanResponderCapture: (evt, gestureState) => {
        let {dx, dy} = gestureState;
        return Math.abs(dx) > 5 || Math.abs(dy) > 5;
      },
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,

      onPanResponderGrant: (evt, gestureState) => {
        // The gesture has started. Show visual feedback so the user knows
        // what is happening!
        // gestureState.d{x,y} will be set to zero now UIManager
        if (!this.introHeight) {
          this.introDoc.measure((x, y, widths, heights, pageX, pageY) => {
            this.introHeight = heights;
          });
        }
      },
      onPanResponderMove: (evt, gestureState) => {
        // The most recent move distance is gestureState.move{X,Y}
        // The accumulated gesture distance since becoming responder is
        // gestureState.d{x,y}
        let dy = gestureState.dy;
        if (dy < 0 && this.introHeight) {
          this.nowHeight =
            this.introHeight + dy < 1 ? 1 : this.introHeight + dy;
          this.introDoc.setNativeProps({
            height: this.nowHeight,
          });
        }
      },
      onPanResponderTerminationRequest: (evt, gestureState) => true,
      onPanResponderRelease: (evt, gestureState) => {
        // The user has released all touches while this view is the
        // responder. This typically means a gesture has succeeded
        this.introDoc.setNativeProps({
          height: 'auto',
        });
        if (gestureState.dy < -50 && !this.state.hidden) {
          this.hiddenIntro();
        }
      },
      onPanResponderTerminate: (evt, gestureState) => {
        // Another component has become the responder, so this gesture
        // should be cancelled
      },
      onShouldBlockNativeResponder: (evt, gestureState) => {
        // Returns whether this component should block native components from becoming the JS
        // responder. Returns true by default. Is currently only supported on android.
        return true;
      },
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
  hiddenIntro() {
    LayoutAnimation.configureNext(
      LayoutAnimation.create(100, 'linear', 'opacity'),
    );
    this.setState({
      hidden: !this.state.hidden,
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
    return (
      <View
        {...this._panResponder.panHandlers}
        collapsable={false}
        style={this.state.hidden ? {height: 0} : {opacity: 1}}
        ref={doc => (this.introDoc = doc)}>
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
            ) : this.state.chapters.length > 0 ? (
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.navigate('Read', {
                    chapter: this.state.chapters[0],
                    novel: this.state.novel,
                  });
                }}>
                <Text style={styles.continue}>开始阅读</Text>
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
  render() {
    return (
      <View style={styles.container}>
        {this.renderInfo()}
        <View style={styles.chapterContainer}>
          <View style={styles.ChapterListBox}>
            <TouchableNativeFeedback
              onPress={() => {
                this.hiddenIntro();
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
    color: '#409EFF',
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
  skip: {
    paddingTop: 0.05 * width,
    paddingBottom: 0.05 * width,
    fontSize: 14,
    marginLeft: 0.02 * width,
    color: '#409EFF',
  },
});
