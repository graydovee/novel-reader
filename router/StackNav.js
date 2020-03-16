import React from 'react';
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';
import BottomTabNav from '../router/BottomTabNav';
import Detail from '../page/Detail';
import SearchDetail from '../page/SearchDetail';
import Read from '../page/Read';
import SearchRead from '../page/SearchRead';

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
            header() {
              return null;
            },
          }}
        />
        <Stack.Screen
          name="Detail"
          component={Detail}
          options={{
            ...TransitionPresets.SlideFromRightIOS,
          }}
        />
        <Stack.Screen
          name="SearchDetail"
          component={SearchDetail}
          options={{
            ...TransitionPresets.SlideFromRightIOS,
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
        <Stack.Screen
          name="SearchRead"
          component={SearchRead}
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
