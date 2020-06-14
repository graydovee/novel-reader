import React from 'react';
import Home from '../page/Home';
import Search from '../page/Search';
import Booklist from '../page/Booklist';
import Popularitylist from '../page/Popularitylist';

import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
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
                  name={'magnifying-glass'}
                  size={param.size}
                  style={{color: param.color}}
                />
              );
            },
          }}
        />
        <Tab.Screen
          name="Popularitylist"
          component={Popularitylist}
          options={{
            title: '榜单',
            tabBarIcon: param => {
              return (
                <Foundation
                  name={'graph-bar'}
                  size={param.size}
                  style={{color: param.color}}
                />
              );
            },
          }}
        />
        <Tab.Screen
          name="Booklist"
          component={Booklist}
          options={{
            title: '书架',
            tabBarIcon: param => {
              return (
                <Foundation
                  name={'book-bookmark'}
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
