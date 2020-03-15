import React from 'react';

import {
  Text,
  View,
  StyleSheet,
  PanResponder,
  Dimensions,
  Image,
} from 'react-native';

const img = require('../temp/shi.jpg');
const {width, height} = Dimensions.get('window');

export default class Search extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      textIn: true,
      textOut: false,
    };
    this._panResponder = {};
    this._previousHeight = 0;
    this.circle = (null: ?{setNativeProps(props: Object): void});
    this.show = false;

    this._previousHeight = 0;
    this._circleStyles = {
      style: {
        height: this._previousHeight,
        backgroundColor: 'green',
      },
    };

    this._panResponder = PanResponder.create({
      // Ask to be the responder:
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,

      onPanResponderGrant: (evt, gestureState) => {
        // The gesture has started. Show visual feedback so the user knows
        // what is happening!
        // gestureState.d{x,y} will be set to zero now
        this._highlight();
        this.setState({
          textIn: false,
          textOut: false,
        });
      },
      onPanResponderMove: (evt, gestureState) => {
        // The most recent move distance is gestureState.move{X,Y}
        // The accumulated gesture distance since becoming responder is
        // gestureState.d{x,y}
        if (
          (this.show && gestureState.dy < 0) ||
          (!this.show && gestureState.dy > 0)
        ) {
          this._circleStyles.style.height =
            this._previousHeight + gestureState.dy;
          this._updateNativeStyles();
        }
      },
      onPanResponderTerminationRequest: (evt, gestureState) => true,
      onPanResponderRelease: (evt, gestureState) => {
        // The user has released all touches while this view is the
        // responder. This typically means a gesture has succeeded

        this._unHighlight();

        if (gestureState.dy <= -50 && this.show) {
          this._circleStyles.style.height = 0;
          this.show = false;
          this._updateNativeStyles();
        } else if (gestureState.dy >= 50 && !this.show) {
          this._circleStyles.style.height = height;
          this.show = true;
          this._updateNativeStyles();
        } else {
          this._circleStyles.style.height = this.show ? height : 0;
          this._updateNativeStyles();
        }
        this.setState({
          textIn: !this.show,
          textOut: this.show,
        });
        this._previousHeight = this._circleStyles.style.height;
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

  componentDidMount() {
    this._updateNativeStyles();
  }

  renderTextOut() {
    if (this.state.textOut) {
      return (
        <Text
          style={{
            textAlign: 'center',
            fontSize: 30,
          }}
          ref={textOut => {
            this.textOut = textOut;
          }}>
          真的什么都没有！
        </Text>
      );
    }
    return <View />;
  }
  renderTextIn() {
    if (this.state.textIn) {
      return (
        <View>
          <Text
            style={{
              textAlign: 'center',
              fontSize: 26,
              marginTop: 0.5 * height,
            }}
            ref={textIn => {
              this.textIn = textIn;
            }}>
            这里什么都没有...
          </Text>
        </View>
      );
    }
    return <View />;
  }
  render() {
    return (
      <View style={styles.container} {...this._panResponder.panHandlers}>
        <View
          style={styles.circle}
          ref={circle => {
            this.circle = circle;
          }}>
          <Image
            source={img}
            style={{width: 200, height: 200, borderRadius: 100}}
          />
          {this.renderTextOut()}
        </View>
        {this.renderTextIn()}
      </View>
    );
  }

  _highlight() {
    this._circleStyles.style.backgroundColor = 'rgba(255,0,0,0.05)';
    this._updateNativeStyles();
  }

  _unHighlight() {
    this._circleStyles.style.backgroundColor = 'rgba(255,0,0,0.03)';
    this._updateNativeStyles();
  }

  _updateNativeStyles() {
    this.circle && this.circle.setNativeProps(this._circleStyles);
  }
}

var styles = StyleSheet.create({
  circle: {
    justifyContent: 'center',
    width: width,
    height: height,
    position: 'absolute',
    top: 0,
    left: 0,
    elevation: 10,
    alignItems: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'stretch',
    flexDirection: 'column',
    elevation: 1,
  },
});
