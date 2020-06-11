// import React from 'react';
// import {
//   Image,
//   View,
//   Text,
//   FlatList,
//   Dimensions,
//   StyleSheet,
//   TouchableNativeFeedback,
// } from 'react-native';
// import http from '../request';
// import SearchTextInput from './commpent/SearchTextInput';
// import Loading from './commpent/Loading';

// const {width,height} = Dimensions.get('window');

// type TempNovel = {
//   title: string,
//   author: string,
//   url: string,
// };

// type Props = {};

// type State = {
//   novels: Array<TempNovel>,
//   loading: boolean,
// };

// export default class Search extends React.Component<Props, State> {
//   constructor(props) {
//     super(props);
//     this.state = {
//       novels: [],
//       loading: false,
//       data:[
//         {name: 'Devin',id:'1'},
//         {name: 'Dan',id:'2'},
//         {name: 'Dominic',id:'3'},
//         {name: 'Jackson',id:'4'},
//         {name: 'James',id:'5'},
//         {name: 'Joel',id:'6'},
//         {name: 'John',id:'7'},
//         {name: 'Jillian',id:'8'},
//         {name: 'Jimmy',id:'9'},
//         {name: 'Julie',id:'10'},
//        ]
//     };
//   }

//   search(name) {
//     let data = {
//       name: name,
//     };
//     this.setState({
//       loading: true,
//     });
//     http
//       .post('/spider/search', data)
//       .then(res => {
//         this.setState({
//           novels: res.data,
//           loading: false,
//         });
//       })
//       .catch(res => {
//         this.setState({
//           loading: false,
//         });
//       });
//   }

 
//   render() {
//     return (
//       <View >
//         <SearchTextInput fetchData={this.search.bind(this)} />
        
//         <FlatList
//         data={this.state.data}
//         renderItem={this.renderBook}
//         numColumns ={3}
//         />
        
        
//       </View>
//     );
//   }

//   renderBook({ item }) {
//     return (
      
//       <View style={styles.container}>
        
    
//         <View style={styles.rightContainer}>
//           <Image
//             style={styles.thumbnail}
//           />
//           <Text style={styles.name}>{item.name}</Text>
//           <Text style={styles.id}>{item.id}</Text>
//         </View>
//       </View>
//     );
//   }


// }

// const styles = StyleSheet.create({
  
//  container: {
//     flex:1,
    
//     flexDirection: 'row',
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'white',
//     margin: 0.02 * width,
//     paddingTop: 0.02 * width,
//     paddingRight: 0.05 * width,
//     paddingLeft: 0.05 * width,

    
//     marginTop: 5,
//     width:0.1*width,
//     height:0.1*height,
//   },
//   rightContainer: {
//     paddingLeft: 0.05 * width,
    
//   },
  
 
  
// });
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

const {width,height} = Dimensions.get('window');

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
          numColumns ={3}
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
    flex:1,
    
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    margin: 0.02 * width,
    paddingTop: 0.02 * width,
    paddingRight: 0.05 * width,
    // paddingLeft: 0.05 * width,
    marginTop: 5,
    
  
    width:0.1*width,
    height:0.2*height,
  },

  // container: {
  //   flex: 1,
  //   flexDirection: 'row',
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   backgroundColor: 'white',
  //   margin: 0.02 * width,
  //   paddingTop: 0.02 * width,
  //   paddingRight: 0.05 * width,
  //   paddingLeft: 0.05 * width,
  //   marginTop: 5,
  // },
  thumbnail: {
    width: 53,
    height: 80,
    
  },
  rightContainer: {
    // paddingLeft: 0.05 * width,
    flex: 1,
    textAlign: 'left',
  },
  name: {
    fontSize: 14,
    marginBottom: 5,
    textAlign: 'center',
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
