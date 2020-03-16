import React from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Dimensions,
  Keyboard,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';

const {width} = Dimensions.get('window');

type Props = {
  fetchData: Function,
};

type State = {
  inputValue: string,
};

export default class Home extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      inputValue: '',
    };
    this._onChangeText = this._onChangeText.bind(this);
  }
  _onChangeText(text) {
    this.setState({inputValue: text});
  }
  render() {
    return (
      <View style={styles.searchContainer}>
        <View style={styles.searchBox}>
          <AntDesign name={'search1'} size={15} />
          <TextInput
            underlineColorAndroid="transparent"
            placeholder="小说名/作者"
            style={styles.searchInput}
            onChangeText={this._onChangeText.bind(this)}
            value={this.state.inputValue}
          />
          <TouchableOpacity
            onPress={() => {
              Keyboard.dismiss();
              this.props.fetchData(this.state.inputValue);
            }}
            style={styles.searchView}>
            <Text style={styles.searchText}>搜索</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  searchContainer: {
    paddingRight: width * 0.05,
    paddingLeft: width * 0.05,
    marginTop: 10,
  },
  searchBox: {
    height: 40,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingLeft: width * 0.05,
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchText: {
    color: '#0391ff',
    fontSize: 14,
  },
  searchInput: {
    marginLeft: width * 0.05,
    marginRight: width * 0.05,
    width: width * 0.55,
  },
  searchView: {
    textAlign: 'right',
  },
});
