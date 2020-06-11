import React, { Component } from "react";
import Popularitylist from './Popularitylist';
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';
import { Image, FlatList, StyleSheet, Text, View,Dimensions, Button } from "react-native";
const { width, height } = Dimensions.get('window');
import {NavigationContainer} from '@react-navigation/native';



// const Stack = createStackNavigator();




export default class SampleAppMovies extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data:[
         {name: '人气榜',},
         {name: '完结榜'},
         {name: '新书榜'},
         {name: '推荐榜'},
        ]
    };
   } 

  // static navigationOptions ={
  //   title:'榜单',
  // };

  render() {
    

    return (
      // <NavigationContainer>
      //   <Stack.Navigator>
      //     <Stack.Screen
      //       name="Popularitylist"
      //       component={Popularitylist}
      //       options={{
      //         title: '人气榜',
              
      //       }}
      //     />
      //   </Stack.Navigator>
      // </NavigationContainer>  

      <View>
          <View style={styles.title}>
            <Text style={styles.titleword}>榜单</Text> 
            
          </View>
          
          <FlatList
            data={this.state.data}
            renderItem={this.renderBook}
          />
          
          
        </View>
    
    );
    
  }

  renderBook({ item }) {
    return (
      
      <View style={styles.container}>
        
        
        <View style={styles.rightContainer}>
          <Button
              title={item.name}
              onPress={() => navigation.navigate('Popularitylist')}
          />
          {/* <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.id}>{item.id}</Text> */}
        </View>
      </View>
    );
  }

}



const styles = StyleSheet.create({
  title:{
    flex:1,
    
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',



    
    marginTop: 20,
    marginBottom:40,
    width:width,
    

  },
  titleword:{
    fontSize:40,
  },
  container: {
    flex:1,
    
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    margin: 0.04 * width,
    paddingTop: 0.04 * width,
    paddingRight: 0.1 * width,
    paddingLeft: 0.1 * width,
    paddingBottom: 0.04 * width,
    
    marginTop: 5,

  },
  rightContainer: {
    paddingLeft: 0.05 * width,
    
  },
});