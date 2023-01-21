import { StyleSheet, Text, View ,Button,TouchableOpacity} from 'react-native';
const Welcome=(props)=>{
  return (
    <>
      <View style={styles.container2}>
        <Text style={styles.welcome}>Welcome</Text>
        <TouchableOpacity style={styles.start} uppercase={false} onPress={props.proceed}>
          <Text style={{ textAlign: "center", fontSize: 16, color: "white" }}>
            Get started
          </Text>
        </TouchableOpacity>
      </View>
    </>
  );
}


const styles = StyleSheet.create({
    container1: {
      flex:1,
      marginTop:10
    },container2: {
      flex:1,
      justifyContent:"center",
      alignItems:"center",
      height:"100%"
    },
    welcome:{
      fontSize:40,
      position:'absolute',
      top:'30%'
    },
    start:{
        top:"20%",
      width:100,
      backgroundColor:"#2196f3",
      height:35,
      textAlign:"center",
      borderRadius:8,alignItems:"center",display:"flex",justifyContent:"center"
    }
  });
  
export default Welcome;