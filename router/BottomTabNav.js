import React from 'react';
import Home from '../page/Home';
import Search from '../page/Search';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Foundation from 'react-native-vector-icons/Foundation';

const Tab = createBottomTabNavigator();

export default class BottomTabNav extends React.Component {
  render() {
    return (
      <Tab.Navigator initialRouteName="Home">
        <Tab.Screen
          name="Home"
          component={Home}
          options={{
            title: '阅读',
            tabBarIcon: param => {
              return (
                <Foundation
                  name={'book'}
                  size={param.size}
                  style={{color: param.color}}
                />
              );
            },
          }}
        />
        <Tab.Screen
          name="Search"
          component={Search}
          options={{
            title: '搜索',
            tabBarIcon: param => {
              return (
                <Foundation
                  name={'indent-more'}
                  size={param.size}
                  style={{color: param.color}}
                />
              );
            },
          }}
        />
      </Tab.Navigator>
    );
  }
}
