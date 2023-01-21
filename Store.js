import create from 'zustand';
import {devtools} from 'zustand/middleware';
const bookStore=(set)=>({
    start:false,
    setStart:()=>
        set(state=>({start: !state.start})),
    readGrantted:false,
    setReadPermission:(val)=>set(state=>({readGrantted:val})),
    writeGrantted:false,
    setWritePermission:(val)=>set(state=>({writeGrantted:val})),
    res:null,
    setRes:(val)=>set(state=>({res:val})),
    currentFile:null,
    setCurrentFile:(val)=>set(state=>({currentFile:val})),
    transLanguage:"hi",
    setTranslanguage:(val)=>set(state=>({transLanguage:val})),
    history:null,
    setHistory:(val)=>set(state => ({history:val})),
    sortType:"down",
    setSortType:(val)=>set(state=>({sortType:val})),
    sortFlag:true,
    setSortFlag:()=>set(state=>({sortFlag:!state.sortFlag})),
    darkMode:false,
    setDarkMode:(val)=>set(state=>({darkMode:!state.darkMode}))

    
});
const useStore=create(devtools(bookStore,{ serialize: true }));

export default useStore;