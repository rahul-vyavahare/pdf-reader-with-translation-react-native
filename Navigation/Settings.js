import React, {useState} from 'react';
import { View, Text,Switch } from 'react-native';
import SelectDropdown from 'react-native-select-dropdown'
import useStore from "../Store";
const languages=[
    {lan:"Arabic",code:"ar"},
    {lan:"Chinese",code:"zh"},
    {lan:"Farsi",code:"fa"},
    {lan:"Georgian",code:"ka"},
    {lan:"German",code:"de"},
    {lan:"Greek",code:"el"},
    {lan:"Hausa",code:"ha"},
    {lan:"Hindi",code:"hi"},
    {lan:"Igbo",code:"ig"},
    {lan:"Indonesian",code:"id"},
    {lan:"Italian",code:"it"},
    {lan:"Malay",code:"ms"},
    {lan:"Portuguese",code:"pt"},
    {lan:"Romanian",code:"ro"},
    {lan:"Russian",code:"ru"},
    {lan:"Spanish",code:"es"}
    
]

export default function HomeScreen({ navigation }) {
    const [isEnabled, setIsEnabled] = useState(false);
    const {setTranslanguage,darkMode,setDarkMode}=useStore((state) => state);
 // const toggleSwitch = () => setIsEnabled(previousState => !previousState);
    return (
        <View style={{ flex: 1,backgroundColor:darkMode?"black":"white"}}>
            <View style={{display:"flex",flexDirection: "row",justifyContent:"space-between",borderBottomColor:"#F5F5F5",borderBottomWidth:1,paddingRight:10}}><Text style={{fontSize:18,fontWeight:"500",margin:10,color:darkMode?"white":"black"}}>Dark Mode</Text><Switch
        trackColor={{false: '#767577', true: '#81b0ff'}}
        thumbColor={darkMode ? '#1976d2' : '#c8c8c8'}
        ios_backgroundColor="#3e3e3e"
        onValueChange={setDarkMode}
        value={darkMode}
      /></View>
      <View style={{display:"flex",flexDirection: "row",justifyContent:"space-between",borderBottomColor:"#F5F5F5",borderBottomWidth:1}}><Text style={{fontSize:18,fontWeight:"500",margin:10,color:darkMode?"white":"black"}}>Translation language</Text>
      <SelectDropdown
	data={languages}
	onSelect={(selectedItem, index) => {
        setTranslanguage(selectedItem.code);
		//console.log(selectedItem, index)
	}}
	buttonTextAfterSelection={(selectedItem, index) => {
		// text represented after item is selected
		// if data array is an array of objects then return selectedItem.property to render after item is selected
		return selectedItem.lan
	}}
	rowTextForSelection={(item, index) => {
		// text represented for each item in dropdown
		// if data array is an array of objects then return item.property to represent item in dropdown
		return item.lan
	}}
    buttonTextStyle={{color:darkMode?"white":"black"}}
    buttonStyle={{backgroundColor:darkMode?"black":"white",borderWidth:1,width:130,borderRadius:30,height:35,margin:5,borderColor:darkMode?"white":"black"}}
/></View>
        </View>
    );
}