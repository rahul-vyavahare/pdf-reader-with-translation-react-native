/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

// import React from 'react';
// //import type {Node} from 'react';
// import {
//   SafeAreaView,
//   ScrollView,
//   StatusBar,
//   StyleSheet,
//   Text,
//   useColorScheme,
//   View,
// } from 'react-native';

// import {
//   Colors,
//   DebugInstructions,
//   Header,
//   LearnMoreLinks,
//   ReloadInstructions,
// } from 'react-native/Libraries/NewAppScreen';
// import FileUploader from './FileUploader';
// import Welcome from './Welcome';
// import useStore from './Store';
// /* $FlowFixMe[missing-local-annot] The type annotation(s) required by Flow's
//  * LTI update could not be added via codemod */


// const App = () => {
//   const isDarkMode = useColorScheme() === 'dark';
//   const start =useStore(state=>state.start);
//   const setStart=useStore(state=>state.setStart);
//   const backgroundStyle = {
//     backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
//   };

//   return (
//     <SafeAreaView style={backgroundStyle}>
      
      
        
        
//          <View style={styles.container}>
//       {start ?<FileUploader home={setStart}/>:<Welcome proceed={setStart}/>}
//       <StatusBar style="auto" />
//     </View>
       
     
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   sectionContainer: {
//     marginTop: 32,
//     paddingHorizontal: 24,
//   },
//   sectionTitle: {
//     fontSize: 24,
//     fontWeight: '600',
//   },
//   sectionDescription: {
//     marginTop: 8,
//     fontSize: 18,
//     fontWeight: '400',
//   },
//   highlight: {
//     fontWeight: '700',
//   },
//   container: {
    
//     backgroundColor: '#fff',
//     height:'100%',
//     paddingVertical:10,
//     paddingHorizontal:10 
//   },
//   welcome:{
//     fontSize:40,
//     position:'absolute',
//     top:'30%'
//   },
//   start:{
//     width:100,
//     backgroundColor:"#2196f3",
//     height:35,
//     textAlign:"center",
//     borderRadius:8,alignItems:"center",display:"flex",justifyContent:"center"
//   }
// });
import * as React from 'react';
import MainContainer from './MainContainer';

function App() {
  return (
    <MainContainer/>
  );
}

export default App;
