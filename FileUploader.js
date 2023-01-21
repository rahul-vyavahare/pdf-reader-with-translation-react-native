  import {
    StyleSheet,
    Text,
    View,
    
    TouchableOpacity,
    PermissionsAndroid,
    Platform, Linking ,TextInput
  } from "react-native";
  import { useState, useEffect } from "react";
  import useStore from "./Store";
  
import axios from "axios";
  import Pdf from 'react-native-pdf';
  
  
  import  DocumentPicker  from 'react-native-document-picker';
  const FileUploader = (props) => {
    const [r, setR] = useState(null);
    const [text, onChangeText] = useState("");
    const [er, setEr] = useState(null);
    const {
      permissionGrantted,
      setPermission,
      res,
      setRes,
      currentFile,
      setCurrentFile,
    } = useStore((state) => state);
    useEffect(() => {
      checkStoragePermission();
    }, []);
    useEffect(()=>{
      console.log("callback",r)
    },[r]);
    async function checkStoragePermission() {
      try {
        const granted = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
        );
        if (granted) {
          //PermissionsAndroid.RESULTS.GRANTED
          //selectFile();
          setPermission(true);
        } else {
          requestStoragePermission();
        }
      } catch (err) {
        console.log(err);
      }
    }
    async function requestStoragePermission() {
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
          console.log('Storage permission granted');
          setPermission(true);
  
           selectFile();
        } else if (granted === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
          console.log('Storage permission denied and "Don\'t ask again" checked');
          const url = 'app-settings:';
          const canOpen = await Linking.canOpenURL(url);
          if (canOpen) {
            console.log('Opening app settings');
            Linking.openURL(url);
          } else {
            console.log('Unable to open app settings');
          }
        } else {
          console.log('Storage permission denied');
        }
        // if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        //   setPermission(true);
  
        //   selectFile();
        // } else {
        //   setPermission(false);
        //   console.log("Storage permission denied");
        // }
      } catch (err) {
        setPermission(false);
        console.warn(err);
      }
    }
    async function selectFile() {
        try {
            const res = await DocumentPicker.pick({
              type: [DocumentPicker.types.pdf],
            });
            setRes({...res[0]});setR({...res[0]});
            return res.uri;
          } catch (err) {
            if (DocumentPicker.isCancel(err)) {
              console.log('Cancelled');
            } else {
              console.log(err);
            }
          }
      
    }
    const handlePicker=()=>{
      if(permissionGrantted){
        selectFile().then(uri => setCurrentFile(uri));
      }
      else{
        requestStoragePermission();
      }
    }
    const renderPdf=()=>{
     
      if(Platform.OS==="web"){
        return <iframe src={currentFile?.uri} height={'100%'} width={'100%'} />
      }
      else{return(<Pdf source={{uri:res["uri"]}}
      style={{flex: 1,height:500}}
      onError={(error)=>{console.log(error);}}
      />);
        // return(<View style={{ flex: 1 }}>
        // <WebView 
        // source={{uri:`https://mozilla.github.io/pdf.js/web/viewer.html?file=${r["uri"]}`}}
        //  style={{flex: 1}}
        //  /></View>);
        // return (<Pdf 
        // source={currentFile?.uri}
        // style={{flex: 1}}
        // onError={(error)=>{console.log(error);}}
        // />
        //   // <WebView
        //   //   source={{ uri: currentFile?.uri }}
        //   //   style={{ flex: 1 }}
        //   // />
        // );
      }
    }
    const handleTranslate=async()=>{console.log("from handler",text);
      if(text){
      await axios.get(`https://od-api.oxforddictionaries.com/api/v2/translations/en/hi/${text}?strictMatch=false`,
        {headers: {
          "Accept": "application/json",
          "app_id": "aab68e2e",
          "app_key": "3403970b25b78f2e8b577980ffa5fd93"
        }
    }).then(response => {
        console.log(response.data.results[0].lexicalEntries[0].entries[0].senses[0].translations[0].text);
        console.log(response.data);
    }).catch(error => {
      if(error.response.status === 404)
      {
setEr(error.response.data.error);
console.log(error.response.data.error)
      }
        console.log(error);
    });
  }
    }
    return (
      <>
        <View style={styles.fileContainer}>
        <TouchableOpacity  onPress={props.home} style={styles.home} ><Text style={{ textAlign: "center", fontSize: 16, color: "white" }}>Home</Text></TouchableOpacity>
          {/* <Text style={styles.fileText}>
            File Upload Status :{permissionGrantted}
          </Text>
          <Text>Response :- {res?.name}</Text>
          <Text>URI :- {res?.uri}</Text> */}
          {/* <View style={styles.pdfContainer}> */}
          <View style={{display:"flex",flexDirection: "row"}}><TextInput
        style={styles.input}
        onChangeText={txt=>onChangeText(txt)}
        value={text}
      /><TouchableOpacity  onPress={handleTranslate} style={styles.fetch} ><Text style={{ textAlign: "center", fontSize: 16, color: "white" }}>Fetch</Text></TouchableOpacity>
      </View>
          {currentFile !== null ?renderPdf() :<TouchableOpacity style={styles.selectBtn} uppercase={false} onPress={handlePicker}>
            <Text style={{ textAlign: "center", fontSize: 16, color: "white" }}>
              Select file
            </Text>
          </TouchableOpacity>}
          {/* </View> */}
          
        </View>
      </>
    );
  };
  const styles = StyleSheet.create({
    container1: {
      flex: 1,
      marginTop: 50,
    },
    container2: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    fileText: {
      fontSize: 20,
    },
    home: {
      width:100,
      backgroundColor:"#2196f3",
      height:35,
      textAlign:"center",
      alignSelf:"center",
      borderRadius:8,alignItems:"center",display:"flex",justifyContent:"center",
      
    
    },
    pdfContainer:{
      height:'90%',
      backgroundColor:'#DDD',
  width:'100%',
  justifyContent:'center',
      alignItems:'center',display:'flex'
    },
    selectBtn:{
      width:100,
      backgroundColor:"#2196f3",
      height:35,
      textAlign:"center",
      
      borderRadius:8,alignItems:"center",display:"flex",justifyContent:"center"
    },fileContainer:{
      height:"100%",
     
    },
    input:{
      height: 40,
      margin: 12,
      borderWidth: 1,
      padding: 10,
      borderRadius:12,width:"70%"
    },
    fetch:{
      width:50,
      backgroundColor:"#2196f3",
      height:35,
      textAlign:"center",
      alignSelf:"center",
      borderRadius:8,alignItems:"center",display:"flex",justifyContent:"center",
    }
  });
  
  export default FileUploader;
  