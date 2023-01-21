import * as React from 'react';
import {TouchableOpacity} from "react-native";
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import useStore from './Store';
import AsyncStorage from '@react-native-async-storage/async-storage';
// Screens
import HomeScreen from './Navigation/Home';
import HistoryScreen from './Navigation/History';
import SettingsScreen from './Navigation/Settings';
//import RNFS from 'react-native-fs';

//Screen names
const homeName = "Home";
const historyName = "History";
const settingsName = "Settings";

const Tab = createBottomTabNavigator();

function MainContainer() {
  const {sortType,setSortType,history,setHistory,setSortFlag,sortFlag,darkMode}=useStore(state=>state);
  React.useEffect(()=>{
    const data= async ()=>{
        try {
         // const internalStorageDirectory = RNFS.DocumentDirectoryPath
            const value = await AsyncStorage.getItem('readHistory');
            if (value !== null) {
              let data=await JSON.parse(value)
               setHistory(data);
//                if(data){
//                data.forEach(async item => {
//                 const filePath = `${internalStorageDirectory}/history/${item.name}`
//               const contents = await RNFS.readFile(filePath, 'utf8');debugger
// item.contents=contents;
//                });
             // }
              
           
            }
          }  catch (error) {
            // Error saving data
            console.log("from getdata",error);
          }
    }
    data();
},[]);
  React.useEffect(()=>{
    if(history){
setHistory(sortType==="down" ? history.sort((a,b) => Date.parse(b.date) - Date.parse(a.date)):history.sort((a,b) => Date.parse(a.date) - Date.parse(b.date)));
    }
  },[sortFlag]);
  const handleSort=()=>{
    setSortType(sortType === "down" ? 'up':"down");
setSortFlag();
  }
  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName={homeName}
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            let rn = route.name;

            if (rn === homeName) {
              iconName = focused ? 'home' : 'home-outline';

            } else if (rn === historyName) {
              iconName = focused ? 'time' : 'time-outline';

            } else if (rn === settingsName) {
              iconName = focused ? 'settings' : 'settings-outline';
            }

            // You can return any component that you like here!
            return <Ionicons name={iconName} size={size} color={darkMode?"tomato":color} />;
          },
          activeTintColor: 'tomato',
          inactiveTintColor: 'grey',
          labelStyle: { paddingBottom: 10, fontSize: 10 },
          style: { padding: 10, height: 70},
          headerStyle: {
            backgroundColor:darkMode?"black":"white",
           borderBottomColor:"#F5F5F5",borderBottomWidth:1
          },
          headerTintColor: darkMode? "white":"black",
          tabBarStyle: { backgroundColor:darkMode?"black":"white" ,borderTopColor:"#F5F5F5",borderTopWidth:1},
          tabBarLabelStyle:{color:darkMode?"tomato":null}
        })}
        
        >

        <Tab.Screen name={homeName} component={HomeScreen}  />
        <Tab.Screen name={historyName} component={HistoryScreen} options={({navigation}) => ({
            
            headerRight: () => (
              <TouchableOpacity onPress={handleSort} style={{marginRight:20}}>
                <Ionicons name={sortType === "down" ? 'arrow-down-outline':"arrow-up-outline"} size={24} color={darkMode?"white":"black"} />
              </TouchableOpacity>
            )
          })}/>
        <Tab.Screen name={settingsName} component={SettingsScreen} />

      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default MainContainer;