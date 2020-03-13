import React from 'react';
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';
import BottomTabNav from '../router/BottomTabNav';
import Detail from '../page/Detail';
import Read from '../page/Read';

const Stack = createStackNavigator();

export default class StackNav extends React.Component {
  render() {
    return (
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={BottomTabNav}
          options={{
            ...TransitionPresets.SlideFromRightIOS,
            title: '主页',
          }}
        />
        <Stack.Screen
          name="Detail"
          component={Detail}
          options={{
            ...TransitionPresets.SlideFromRightIOS,
            title: '详情',
          }}
        />
        <Stack.Screen
          name="Read"
          component={Read}
          options={{
            ...TransitionPresets.SlideFromRightIOS,
            header() {
              return null;
            },
          }}
        />
      </Stack.Navigator>
    );
  }
}
