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
  PanResponder,
} from 'react-native';
import {Novel, Chapter} from '../domain';
import NovelDetail from './commpent/NovelDetail';
import http from '../request';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Loading from './commpent/Loading';

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
  }
  read(chapter: Chapter) {
    this.props.navigation.navigate('SearchRead', {
      chapter: chapter,
      novel: this.state.novel,
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
  render() {
    return (
      <View style={styles.container}>
        <NovelDetail
          cover={
            this.state.coverUrl
              ? {uri: this.state.coverUrl}
              : require('../images/nopic.jpg')
          }
          name={this.state.novel.name}
          author={this.state.novel.author.name}
          introduce={this.state.novel.introduce}
          ref={ref => {
            this.novelDetail = ref;
          }}
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
          </View>

          <FlatList
            data={this.state.chapters}
            renderItem={this.renderChapter}
            keyExtractor={(item, index) => item.url + index}
            ListEmptyComponent={<Text style={styles.tip}>暂无数据</Text>}
          />
        </View>
        {this.state.loading ? <Loading /> : null}
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
