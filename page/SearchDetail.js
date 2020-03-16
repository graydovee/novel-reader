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
  PanResponder,
  Platform,
} from 'react-native';
import {Novel, Chapter, Content, Store} from '../domain';
import http from '../request';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Loading from './commpent/Loading';

const {UIManager} = NativeModules;

if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

type State = {
  chapters: Array<Chapter>,
  novel: Novel,
  hidden: boolean,
  coverUrl: string,
  loading: boolean,
};

type Props = {};

const {width} = Dimensions.get('window');

export default class Detail extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      chapters: [],
      novel: {
        author: {
          name: '',
        },
        name: '',
        introduce: '',
      },
      coverUrl: '',
      hidden: false,
      loading: true,
    };
    this.props.navigation.setOptions({
      title: props.route.params.novel.title,
    });
    this.renderChapter = this.renderChapter.bind(this);
    this.renderInfo = this.renderInfo.bind(this);
    this.hiddenIntro = this.hiddenIntro.bind(this);
    this.read = this.read.bind(this);

    let param = {
      url: props.route.params.novel.url,
    };

    http
      .post('/spider/index', param)
      .then(res => {
        if (res.code === 200) {
          let data = res.data;
          this.setState({
            novel: {
              name: data.bookName,
              author: {
                name: data.authorName,
              },
              introduce: data.introduce,
            },
            coverUrl: data.coverUrl,
            chapters: data.chapters,
            loading: false,
          });
        }
      })
      .catch(res => {
        this.setState({
          loading: false,
        });
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
  read(chapter: Chapter) {
    this.props.navigation.navigate('SearchRead', {
      chapter: chapter,
      novel: this.state.novel,
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
          this.read(item);
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
            source={
              this.state.coverUrl
                ? {uri: this.state.coverUrl}
                : require('../images/nopic.jpg')
            }
            style={styles.thumbnail}
          />
          <View style={styles.rightContainer}>
            <Text style={styles.infoText}>{this.state.novel.name}</Text>
            <Text style={styles.infoText}>
              作者：{this.state.novel.author.name}
            </Text>
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
          </View>

          <FlatList
            data={this.state.chapters}
            renderItem={this.renderChapter}
            keyExtractor={item => item.url}
            ListEmptyComponent={<Text style={styles.tip}>暂无数据</Text>}
          />
        </View>
        {this.state.coverUrl ? null : <Loading />}
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
