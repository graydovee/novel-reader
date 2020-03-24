import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  LayoutAnimation,
  NativeModules,
  PanResponder,
  Platform,
} from 'react-native';
const {UIManager} = NativeModules;

if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

type State = {
  hidden: boolean,
};

type Props = {
  cover: string,
  name: string,
  author: string,
  introduce: string,
  buttonPress: Function,
  buttonText: string,
};

const {width} = Dimensions.get('window');

export default class Detail extends React.Component<Props, State> {
  static defaultProps: Props = {
    buttonPress: () => {},
    buttonText: '',
  };
  constructor(props) {
    super(props);
    this.state = {
      hidden: false,
    };
    this.hiddenIntro = this.hiddenIntro.bind(this);
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
  hiddenIntro() {
    LayoutAnimation.configureNext(
      LayoutAnimation.create(100, 'linear', 'opacity'),
    );
    this.setState({
      hidden: !this.state.hidden,
    });
  }
  render() {
    return (
      <View
        {...this._panResponder.panHandlers}
        collapsable={false}
        style={this.state.hidden ? {height: 0} : {opacity: 1}}
        ref={doc => (this.introDoc = doc)}>
        <View style={styles.info}>
          <Image source={this.props.cover} style={styles.thumbnail} />
          <View style={styles.rightContainer}>
            <Text style={styles.infoText}>{this.props.name}</Text>
            <Text style={styles.infoText}>作者：{this.props.author}</Text>
            {this.props.buttonText ? (
              <TouchableOpacity onPress={this.props.buttonPress}>
                <Text style={styles.continue}>{this.props.buttonText}</Text>
              </TouchableOpacity>
            ) : null}
          </View>
        </View>
        <View style={styles.introduce}>
          <Text style={styles.title}>简介：</Text>
          <Text>{this.props.introduce}</Text>
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
