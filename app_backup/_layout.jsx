import React from 'react';
import { Tabs } from 'expo-router';
import { StatusBar, Text, View, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AlarmsProvider } from '../components/AlarmsContext';
import { COLORS } from '../constants/theme';
const items = {
 index: { title: 'Inicio', icon: '⌂' },
 reloj: { title: 'Reloj', icon: '◷' },
 alarmas: { title: 'Alarmas', icon: '◴' },
 cronometro: { title: 'Cronómetro', icon: '◉' },
};
export default function RootLayout() {
 return <SafeAreaProvider><AlarmsProvider>
  <StatusBar barStyle="dark-content" backgroundColor={COLORS.bg}/>
  <Tabs screenOptions={({route})=>({
    headerShown:false,
    tabBarActiveTintColor:'#007AFF',tabBarInactiveTintColor:'#9299A5',
    tabBarLabelStyle:{fontSize:10,fontWeight:'700',marginTop:2},
    tabBarStyle:{paddingTop:7,paddingBottom:7,backgroundColor:'#FFFFFF',borderTopColor:'#E5E9F0',borderTopWidth:1},
    tabBarIcon:({focused,color})=><View style={[styles.icon,focused&&styles.selected]}><Text style={{fontSize:25,color,fontWeight:'700'}}>{items[route.name]?.icon||'◷'}</Text></View>,
    sceneStyle:{backgroundColor:COLORS.bg}
  })}>
    <Tabs.Screen name="index" options={{title:'Inicio'}}/>
    <Tabs.Screen name="reloj" options={{title:'Reloj'}}/>
    <Tabs.Screen name="alarmas" options={{title:'Alarmas'}}/>
    <Tabs.Screen name="cronometro" options={{title:'Cronómetro'}}/>
  </Tabs>
 </AlarmsProvider></SafeAreaProvider>
}
const styles=StyleSheet.create({icon:{width:48,height:32,alignItems:'center',justifyContent:'center',borderRadius:14},selected:{backgroundColor:'#EAF2FF'}});
