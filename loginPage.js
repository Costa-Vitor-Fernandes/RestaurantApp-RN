import React, { useState } from 'react';
import {
 StyleSheet,
 Text,
 View,
 TextInput,
 Image,
 Dimensions,
 TouchableOpacity,
 TouchableWithoutFeedback,
 Keyboard,
} from 'react-native';
import axios from 'axios';
 
 const ip = '192.168.0.17'
 
export default function LoginScreen({navigation}) {
 
const [user,setUser] = useState("")
const [password,setPassword] = useState("")

let token = ""
 
const loginButton = () =>{
   console.warn(user,password)
 
/*
const options = {
    url: 'http://localhost/test.htm',
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json;charset=UTF-8'
    },
    data: {
      a: 10,
      b: 20
    }
  };
  axios(options)
    .then(response => {
      console.log(response.status);
    });
*/


// as vezes o ip muda
    axios.post(`http://${ip}:3001/login`, {
        username:user,
        password:password
    })
    .then(function (response) {
        if (response.data.auth){
            token = response.data.token
            navigation.navigate("Home")
            // redirect to main page / home page whatever
        }
        // console.warn(response.data.token);
      })
      .catch(function (error) {
      alert("Login inválido")
        // console.error(error);
  });
}
 
 
 
   return (
   <TouchableWithoutFeedback 
  //  onPress={() => Keyboard.dismiss()}
  // i think this is triggering the bug in web
   >
     <View style={styles.container}>
       <View style={styles.bigCircle}></View>
       <View style={styles.smallCircle}></View>
       <View style={styles.centerizedView}>
         <View style={styles.authBox}>
           <View style={styles.logoBox}>
         <Image  style={styles.logoStyle}
       source={require('./assets/90676d1b-3687-4947-a6df-45e99b36f6a61.jpg')}></Image>
           </View>
           <Text style={styles.loginTitleText}>Login</Text>
           <View style={styles.hr}></View>
           <View style={styles.inputBox}>
             <Text style={styles.inputLabel}>Usuário</Text>
 
             


             <TextInput
               style={styles.input}
               autoCapitalize={'none'}
               onChangeText={setUser}
               value={user}
               />
               
            
           </View>
           <View style={styles.inputBox}>
             <Text style={styles.inputLabel}>Senha</Text>
             <TextInput
               style={styles.input}
               autoCapitalize={'none'}
               secureTextEntry={true}
               textContentType='password'
               onChangeText={setPassword}
               value={password}
             />
           </View>
           <TouchableOpacity style={styles.loginButton} onPress={loginButton}>
             <Text style={styles.loginButtonText}>Login</Text>
           </TouchableOpacity>
           <TouchableOpacity>
             <Text style={styles.registerText} >
               Criar Nova Conta
             </Text>
           </TouchableOpacity>
         </View>
       </View>
     </View>
   </TouchableWithoutFeedback>
 );
}
 
const styles = StyleSheet.create({
 container: {
   flex: 1,
   position: 'relative',
   marginTop: 100,
 },
 bigCircle: {
   width: Dimensions.get('window').height * 0.7,
   height: Dimensions.get('window').height * 0.7,
   backgroundColor: '#056252',
   borderRadius: 1000,
   position: 'absolute',
   right: Dimensions.get('window').width * 0.25,
   top: -50,
 },
 smallCircle: {
   width: Dimensions.get('window').height * 0.4,
   height: Dimensions.get('window').height * 0.4,
   backgroundColor: '#4B7C6F',
   borderRadius: 1000,
   position: 'absolute',
   bottom: Dimensions.get('window').width * -0.2,
   right: Dimensions.get('window').width * -0.3,
 },
 centerizedView: {
   width: '100%',
   top: '15%',
 },
 authBox: {
   width: '80%',
   backgroundColor: '#fafafa',
   borderRadius: 20,
   alignSelf: 'center',
   paddingHorizontal: 14,
   paddingBottom: 30,
   shadowColor: '#000',
   shadowOffset: {
     width: 0,
     height: 2,
   },
   shadowOpacity: 0.25,
   shadowRadius: 3.84,
   elevation: 5,
 },
 logoBox: {
   width: 120,
   height: 120,
   backgroundColor: '#4B7C6F',
   borderRadius: 1000,
   alignSelf: 'center',
   display: 'flex',
   alignItems: 'center',
   justifyContent: 'center',
   top: -50,
   marginBottom: -50,
   shadowColor: '#000',
   shadowOffset: {
     width: 0,
     height: 1,
   },
   shadowOpacity: 0.2,
   shadowRadius: 1.41,
   elevation: 2,
 },
 loginTitleText: {
   fontSize: 26,
   fontWeight: 'bold',
   marginTop: 10,
 },
 hr: {
   width: '100%',
   height: 0.5,
   backgroundColor: '#444',
   marginTop: 6,
 },
 inputBox: {
   marginTop: 10,
 },
 inputLabel: {
   fontSize: 18,
   marginBottom: 6,
 },
 input: {
   width: '100%',
   height: 40,
   backgroundColor: '#dfe4ea',
   borderRadius: 4,
   paddingHorizontal: 10,
 },
 loginButton: {
   backgroundColor: '#4B7C6F',
   marginTop: 10,
   paddingVertical: 10,
   borderRadius: 4,
 },
 loginButtonText: {
   color: '#fff',
   textAlign: 'center',
   fontSize: 20,
   fontWeight: 'bold',
 },
 registerText: {
   textAlign: 'center',
   marginTop: 20,
   fontSize: 16,
 },
 forgotPasswordText: {
   textAlign: 'center',
   marginTop: 12,
   fontSize: 16,
 },
 logoStyle:{
     flex:1,
     width:120,
     borderRadius: 70,
     opacity:0.8,
    
    
    
    
 }
});
