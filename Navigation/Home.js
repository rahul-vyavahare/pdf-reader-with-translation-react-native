import * as React from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    PermissionsAndroid,
    Platform, Linking ,TextInput,Modal,Button
  } from "react-native";
import { useState, useEffect } from "react";
import useStore from "../Store";
import axios from "axios";
import Pdf from 'react-native-pdf';
import  DocumentPicker  from 'react-native-document-picker';
import { Popover, usePopover } from 'react-native-modal-popover';
import NetInfo from "@react-native-community/netinfo";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import RNFS from 'react-native-fs';

export default function Home({ navigation }) {
    const [r, setR] = useState(null);
    const [text, onChangeText] = useState("");
    const [er, setEr] = useState(null);
    const [net,setNet]=useState(false);
    const {
      readGrantted,
      setReadPermission,writeGrantted,setWritePermission,
      res,
      setRes,
      currentFile,
      setCurrentFile,transLanguage,setHistory,setSortFlag,darkMode
    } = useStore((state) => state);
    useEffect(() => {
      checkReadPermission();
    }, []);
   
   // const [open,setOpen]=useState(false);
    const {
      openPopover,
      closePopover,
      popoverVisible,
      touchableRef,
      popoverAnchorRect,
    } = usePopover();
    const [trans,setTrans]=useState(null);
    async function checkReadPermission() {
      try {
        const granted1 = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
        );
        if (granted1) {
          
          setReadPermission(true);
        } else {
          await requestReadPermission();
        }
        // const granted2 = await PermissionsAndroid.check(
        //   PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
        // );debugger
        // if (granted2) {
          
        //   setWritePermission(true);
        // } else {
        //   await requestWritePermission();
        // }
      } catch (err) {
        console.log(err);
      }
    }
    async function requestReadPermission() {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          {
            title: "Storage Permission",
            message: "App needs access to your storage to select a file.",
            buttonNeutral: "Ask Me Later",
            buttonNegative: "Cancel",
            buttonPositive: "OK",
          }
        );
        
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Storage read permission granted');
          setReadPermission(true);
  
          // selectFile();
        } else if (granted === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
          console.log('Storage read permission denied and "Don\'t ask again" checked');
          const url = 'app-settings:';
          const canOpen = await Linking.canOpenURL(url);
          if (canOpen) {
            console.log('Opening app settings');
            Linking.openURL(url);
          } else {
            console.log('Unable to open app settings');
          }
        } else {
          console.log('Storage read permission denied');
        }
        
      } catch (err) {
        setReadPermission(false);
        console.warn(err);
      }
    }
    // async function requestWritePermission() {
    //   try {
    //     const granted = await PermissionsAndroid.request(
    //       PermissionsAndroid.PERMISSIONS.WRIITE_EXTERNAL_STORAGE,
    //       {
    //         title: "Storage Permission",
    //         message: "App needs access to your storage to select a file.",
    //         buttonNeutral: "Ask Me Later",
    //         buttonNegative: "Cancel",
    //         buttonPositive: "OK",
    //       }
    //     );
        
    //     if (granted === PermissionsAndroid.RESULTS.GRANTED) {
    //       console.log('Storage write permission granted');
    //       setWritePermission(true);
  
           
    //     } else if (granted === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
    //       console.log('Storage write permission denied and "Don\'t ask again" checked');
    //       const url = 'app-settings:';
    //       const canOpen = await Linking.canOpenURL(url);
    //       if (canOpen) {
    //         console.log('Opening app settings');
    //         Linking.openURL(url);
    //       } else {
    //         console.log('Unable to open app settings');
    //       }
    //     } else {
    //       console.log('Storage write permission denied');
    //     }
        
    //   } catch (err) {
    //     setWritePermission(false);
    //     console.warn(err);
    //   }
    // }
    async function selectFile() {
        try {
            const res = await DocumentPicker.pick({
              type: [DocumentPicker.types.pdf],
            });
            await setRes({...res[0]});setR({...res[0]});
            return res[0];
          } catch (err) {
            if (DocumentPicker.isCancel(err)) {
              console.log('Cancelled');
              return null;
            } else {
              console.log(err);
            }
          }
      
    }
    const handlePicker=()=>{
      if(readGrantted){
        selectFile().then(uri => {setCurrentFile(uri); handleHistory(uri);});
      }
      else{
        requestReadPermission();
      }
    }
    const renderPdf=()=>{
    
    try{
      if(Platform.OS==="web"){
        return <iframe src={currentFile?.uri} height={'100%'} width={'100%'} />
      }
      else{return(<View style={{flex:1,backgroundColor:darkMode?"black":"white"}}><Pdf source={{uri:res["uri"]}}
      style={{flex: 1,height:600,backgroundColor:darkMode?"black":"white"}}
      onError={(error)=>{console.log(error);}}
      /></View>);
        
      }
    }catch(err){
      console.log(err);
    }
    }
    const handleTranslate=async()=>{
      if(text){setTrans("Fetching...");
      await axios.get(`https://od-api.oxforddictionaries.com/api/v2/translations/en/${transLanguage}/${text}?strictMatch=false`,
        {headers: {
          "Accept": "application/json",
          "app_id": app_id,
          "app_key": api_key
        }
    }).then(response => {
        setTrans(response.data.results[0].lexicalEntries[0].entries[0].senses[0].translations[0].text);
setEr(null);
        //console.log(response.data);
    }).catch(error => {
      setTrans("");
      if(error.response.status === 404)
      {
setEr(error.response.data.error);
console.log(error.response.data.error)
      }
        console.log(error);
    });
  }
    }
    
    
    const handlePopover=async()=>{
      openPopover();
       const unsubscribe = await NetInfo.fetch().then(state => {
       // console.log("Connection type", state.type);
       // console.log("Is connected?", state.isConnected);
        return state.isConnected;
      });
     setNet(unsubscribe);
    }
    const handleHistory = async newFile => {
      try {
        
        const value = await AsyncStorage.getItem('readHistory');
        const d = new Date();
       // const internalStorageDirectory = await RNFS.DocumentDirectoryPath;
        if (value !== null) {
          let jsondata = JSON.parse(value);
         
          let contnt = jsondata.findIndex(
            x => x.name === newFile.name 
          );
          
          if (contnt === -1) {
            jsondata.push({
              name: newFile.name,
              uri: newFile.uri,
              date: d,
              //copypath:`${internalStorageDirectory}/history`+newFile.name,
            });
            setHistory(jsondata);setSortFlag();
            jsondata = await JSON.stringify(jsondata);
            await AsyncStorage.setItem('readHistory', jsondata);
            // if(RNFS.exists(`${internalStorageDirectory}/history`)){
            //   const sourcePath = RNFS.PathForBundle(newFile.uri)
            //   const result = await RNFS.copyFile(sourcePath, `${internalStorageDirectory}/history`);
            //   if(result){
            //     jsondata.push({
            //       name: newFile.name,
            //       uri: newFile.uri,
            //       date: d,
            //       copypath:`${internalStorageDirectory}/history`+newFile.name,
            //     });
            //     setHistory(jsondata);setSortFlag();
            //     jsondata = await JSON.stringify(jsondata);
                
            //     //console.log(jsondata);
            //     await AsyncStorage.setItem('readHistory', jsondata);
            // }
            //}
            
          } else {jsondata[contnt].date = d;
            
                setHistory(jsondata);setSortFlag();
            jsondata = await JSON.stringify(jsondata);
            
            //console.log(jsondata);
            await AsyncStorage.setItem('readHistory', jsondata);
            
            
            
            
          }
          // We have data!!
          //console.log(value);
        } else {
          //const destPath = await RNFS.mkdir(`${internalStorageDirectory}/history`);debugger
          
          
          let data = await JSON.stringify([
            {name: newFile.name, uri: newFile.uri, date: d
              
              //copypath:`${internalStorageDirectory}/history`+newFile.name
            }
          ]);
          setHistory([
          {name: newFile.name, uri: newFile.uri, date: d
           // copypath:`${internalStorageDirectory}/history`+newFile.name
          }
        ]);setSortFlag();
        await AsyncStorage.setItem('readHistory', data);
          // if(RNFS.exists(`${internalStorageDirectory}/history`)){
          //   const sourcePath = RNFS.PathForBundle(newFile.uri)
          //   const result = await RNFS.copyFile(sourcePath, `${internalStorageDirectory}/history`);
          //   if(result){
          //     let data = await JSON.stringify([
          //       {name: newFile.name, uri: newFile.uri, date: d,copypath:`${internalStorageDirectory}/history`+newFile.name}
          //     ]);
          //     setHistory([
          //     {name: newFile.name, uri: newFile.uri, date: d,copypath:`${internalStorageDirectory}/history`+newFile.name}
          //   ]);setSortFlag();
          //   await AsyncStorage.setItem('readHistory', data);
          // }
          // }
         
        }
      } catch (error) {
        // Error retrieving data
        console.log(error);
      }
    };
  //   const copyFile = async (sourceURI, destinationPath) => {
  //     try {
  //         const sourcePath = RNFS.PathForBundle(sourceURI)
  //         const result = await RNFS.copyFile(sourcePath, destinationPath);
  //         return result;
  //     } catch (error) {
  //         console.log(error);
  //     }
  // };
    return (
        <View style={{ flex: 1,backgroundColor:darkMode?"black":"white" }}>
            {currentFile !== null ?renderPdf() :<View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}><Text
                
                style={{ fontSize: 22, fontWeight: 'bold',color:darkMode?"white":"#479AEA" ,fontFamily:"NunitoSans-SemiBold"}}>Select file to read</Text>
                
                
                <TouchableOpacity style={{}} uppercase={false} onPress={handlePicker}>
                <Text
                
                style={{ fontSize: 22, fontWeight: 'bold',color:darkMode?"white":"#479AEA",fontFamily:"NunitoSans-SemiBold",textAlign:"center",marginTop:30  }}>Click here</Text>
                <Image source={require('../img/filepick.png')} style={{width:100,height:100,alignSelf:"center",marginTop:10}}/>
          </TouchableOpacity>
            </View>}
            {currentFile !== null ?<><TouchableOpacity style={styles.selectBtn} uppercase={false} onPress={handlePicker}>
            <Ionicons name='add-outline' size={20} color={'white'} />
    </TouchableOpacity><TouchableOpacity ref={touchableRef} style={{width:60,height:60,backgroundColor:"transparent",zIndex:100,borderRadius:30,position:"absolute",bottom:50,right:5}} onPress={handlePopover}><Image source={require('../img/translate.png')} style={{width:50,height:50,alignSelf:"center",marginTop:10}}/></TouchableOpacity></>:null}
            <Popover
        contentStyle={darkMode?styles.contentDark:styles.contentLight}
        arrowStyle={darkMode?styles.arrowDark:styles.arrowLight}
        backgroundStyle={styles.background}
        visible={popoverVisible}
        onClose={closePopover}
        fromRect={popoverAnchorRect} placement="top"
        supportedOrientations={['portrait', 'landscape']}>
        
        {net?<><View style={{display:"flex",flexDirection: "row",height:"20%"}}><TextInput
        style={darkMode?styles.inputDark:styles.inputLight}
        onChangeText={txt=>onChangeText(txt)}
        value={text}
      /><TouchableOpacity  onPress={handleTranslate} style={styles.fetch} ><Text style={{ textAlign: "center", fontSize: 18, color: "white" }}>Translate</Text></TouchableOpacity>
      
      </View>
      <View style={{width:"100%",height:"70%"}}><Text style={{fontSize:30,margin:10,color:darkMode?"white":"black"}}>{trans}</Text></View>
      <View style={{width:"100%",height:"10%"}}><Text style={{fontSize:20,color:"red",marginLeft:10}}>{er?"Error: Only one word can translate":null}</Text></View></>:<View style={{flex:1,justifyContent:"center",alignItems:"center"}}><Text style={{fontSize:24}}>No internet</Text>
      <Image source={require('../img/networkerror.png')} style={{width:150,height:150,alignSelf:"center",marginTop:10}}/>
      </View>}
      </Popover>
        </View>
        
    );
}
const styles = StyleSheet.create({
  app: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#c2ffd2',
  },
  contentLight: {
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 8,height:300,width:350
  },
  contentDark: {
    padding: 16,
    backgroundColor: '#36454F',
    borderRadius: 8,height:300,width:350
  },
  arrowLight: {
    borderTopColor: 'white',
  },
  arrowDark: {
    borderTopColor: '#36454F',
  },
  background: {
    backgroundColor: ' rgba(100, 100, 100, 0.5)',
  },
  inputLight:{
    height: 45,
    margin: 3,
    borderWidth: 1,borderColor:"black",
    padding: 10,
    borderRadius:12,width:"70%"
  },
  inputDark:{
    height: 45,
    margin: 3,
    borderWidth: 1,borderColor:"white",color:"white",
    padding: 10,
    borderRadius:12,width:"70%"
  },
  fetch:{
    width:85,
    backgroundColor:"#2196f3",
    height:35,
    textAlign:"center",
    alignSelf:"center",
    borderRadius:8,alignItems:"center",display:"flex",justifyContent:"center",marginLeft:3
  },
  selectBtn:{
    width:30,
    backgroundColor:"tomato",
    height:30,
    textAlign:"center",
    position:"absolute",
    borderRadius:15,alignItems:"center",display:"flex",justifyContent:"center",bottom:120,right:10
  }
});
