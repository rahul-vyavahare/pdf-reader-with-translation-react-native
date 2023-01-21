import {useState,useEffect} from 'react';
import { View, Text,SafeAreaView,FlatList,TouchableHighlight ,StyleSheet,Alert} from 'react-native';
import useStore from "../Store";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function History({ navigation }) {
const {history,setHistory,darkMode,setRes,setCurrentFile,writeGrantted,readGrantted}=useStore(state=>state);
const handleRemove=(title)=>{
  let his=[...history].filter(x=> x.name!==title);
  setHistory(his);
  AsyncStorage.setItem('readHistory', JSON.stringify(his));
}
const handleOpen=(name,uri)=>{;
setRes({name,uri});setCurrentFile({name,uri});
}
const Item = ({title,date,uri}) => (
  <View style={{display:"flex",flexDirection:"row",borderBottomColor:"#F5F5F5",borderBottomWidth:1}}>
    <TouchableHighlight onPress={()=>handleOpen(title,uri)} style={{width:"90%"}} underlayColor={darkMode?'#F5F5F5':"grey"}><View style={darkMode? styles.itemDark:styles.itemLight}>
    <Text style={darkMode? styles.titleDark:styles.titleLight}>{title}</Text>
    <Text style={styles.date}>{new Date(date).toDateString()}</Text>
  </View></TouchableHighlight>
  <View style={{display:"flex",justifyContent:"center",alignItems:"center"}}>
    <Ionicons name={"close-outline"} size={24} color={darkMode ? "white":"black"} onPress={()=>handleRemove(title)}/></View>
  </View>
);
const getData=async ()=>{
    try {
        const value = await AsyncStorage.getItem('readHistory');
        if (value !== null) {
            setHistory(JSON.parse(value));
          // We have data!!
          console.log(value);
        }
      }  catch (error) {
        // Error saving data
        console.log("from getdata",error);
      }
}
    return (
        <View style={{ flex: 1 ,backgroundColor:darkMode?"black":"white"}}>
             {readGrantted  ?<SafeAreaView style={styles.container}>
      <FlatList
        data={history}
        renderItem={({item}) => <Item title={item.name} date={item.date} uri={item.uri}/>}
        keyExtractor={item => item.name}
      />
    </SafeAreaView>:<View><Text style={{color:darkMode?"white":"black",fontSize:20}}>Storage Permission required</Text></View>}
        </View>
    );
}
  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    itemLight: {
      backgroundColor: 'white',
      padding: 5,width:"100%",
      paddingVertical: 8,
      paddingHorizontal: 13
    },
    itemDark: {
      backgroundColor: 'black',
      padding: 5,width:"100%",
      paddingVertical: 8,
      paddingHorizontal: 13
    },
    titleLight: {
     
      fontSize: 22,
      fontWeight:"500"
    },titleDark: {
      color:"white",
      fontSize: 22,
      fontWeight:"500"
    },
    date:{
      fontSize:16
    },btn:{
      color:"inherit"
    }
  });