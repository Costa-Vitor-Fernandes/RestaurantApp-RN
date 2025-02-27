import {Picker} from '@react-native-picker/picker';
import {View, Text,Button, StyleSheet, TouchableOpacity, Dimensions,Modal,TextInput, ScrollView} from 'react-native'
import { useState,useEffect,useContext } from 'react'
import { BottomTabBar } from '@react-navigation/bottom-tabs'
import { UserContext } from './UserContext';
import * as FileSystem from 'expo-file-system';
import axios from 'axios'
import Icon from 'react-native-vector-icons/FontAwesome';

// const ip = '127.0.0.1:3001'
// const ip ='192.168.0.17:3001'
const ip = "limitless-lowlands-68334.herokuapp.com"
const numColumns=3
const headerWidthSize = Dimensions.get('window').width*0.755

export default function Configuracao (props){



  const {token,setToken} = useContext(UserContext)


  const [exportModal,setExportModal]= useState(false)
  const [addProdutosModal,setAddProdutosModal]= useState(false)
  const [alterPrecoModal, setAlterPrecoModal]= useState(false)
  const [deleteProdutoModal,setDeleteProdutotModal]= useState(false)
  const [novoLoginModal,setNovoLoginModal]= useState(false)
  const [todosPedidosModal,setTodosPedidosModal]= useState(false)
  const [deleteOrderIdModal, setDeleteOrderIdModal]= useState(false)

  const [allProducts,setAllProducts] = useState('')
  const [selectedProduct,setSelectedProduct] = useState('')


  const styles = StyleSheet.create({
    mainContainer:{
      flex:1,
    },
    basicButton:{
      height:Dimensions.get('window').height/20,
      justifyContent:'center',
      alignItems:'center',
      backgroundColor:'#009dff',
      margin:10,
    },
    textButton:{
      color:'#fff'
    },
    
  })

useEffect(()=>{
  getAllProducts()
},[props.refresh])



const getAllProducts = () =>{
  const obj = []
  obj.push(<Picker.Item label="Escolha um produto" value="0" />)  
  axios.get(`https://${ip}/allProducts`).then(async function (res) {
    const arrAllProducts = res.data.nomeproduto
    // await arrAllProducts.forEach((e,i,res)=>{
    //   obj.push(<Picker.Item label={res[i]} value={res[i]}></Picker.Item>)
    // })
    obj.push(arrAllProducts.map((r)=>{
      return (<Picker.Item label={r} value={r}></Picker.Item>)
    }))
    }).catch(error => console.log(error));
    return setAllProducts(obj)
}
const deleteOrderId =(produto) =>{
  setDeleteOrderIdModal(produto)
}

  const exporter = (opt) =>{
    setExportModal(opt)
  }
  const addProdutos =(produto) =>{
    setAddProdutosModal(produto)
  }
  const alterPreco = (preco)=>{
    setAlterPrecoModal(preco)
  }
  const deleteProduto = (del) =>{
setDeleteProdutotModal(del)
  }
  const novoLogin = (login) =>{
    setNovoLoginModal(login)
  }
  const todosPedidosId= (pedidos) =>{
    setTodosPedidosModal(pedidos)
  }
  const exportFunc = (e) =>{
    setExportModal(e)
  }
    return(
      <View style={styles.mainContainer}>
   
          <TouchableOpacity style={styles.basicButton} onPress={()=>setAddProdutosModal(true)}>
          <Text style={styles.textButton}><Icon name="plus" size={20} color="#fff" />  Adicionar Produtos</Text></TouchableOpacity>
          

          <TouchableOpacity style={styles.basicButton} onPress={()=>setAlterPrecoModal(true)}>
          <Text style={styles.textButton}><Icon name="dollar" size={20} color="#fff" />  Alterar Preço</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.basicButton} onPress={()=>setDeleteProdutotModal(true)}>
          <Text style={styles.textButton}> <Icon name="trash" size={20} color="#fff" />  Excluir Produtos</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.basicButton} onPress={()=>setDeleteOrderIdModal(true)} >
          <Text style={styles.textButton}><Icon name="trash" size={20} color="#fff" />  Excluir Pedido Por id</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.basicButton} onPress={()=>setNovoLoginModal(true)}>
          <Text style={styles.textButton}> <Icon name="user" size={20} color="#fff" />  Cadastrar novo Login</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.basicButton} onPress={()=>setTodosPedidosModal(true)}>
          <Text style={styles.textButton}><Icon name="server" size={20} color="#fff" />  Todos Pedidos Abertos e Fechados / id</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.basicButton} onPress={()=>setExportModal(true)}>
          <Text style={styles.textButton}><Icon name="print" size={20} color="#fff" /> Exportar p/ planilha</Text>
          </TouchableOpacity>


          {/* MODAL */}
          {addProdutosModal? <AddProductModal state={addProdutosModal} setState={addProdutos} token={token} /> : null}
          {alterPrecoModal? <AlterPrecoModal state={alterPrecoModal} setState={alterPreco} allProducts={allProducts} selectedProduct={selectedProduct} setSelectedProduct={setSelectedProduct} token={token} />  : null}
          {deleteProdutoModal? <DeleteModal state={deleteProdutoModal} setState={deleteProduto} allProducts={allProducts} selectedProduct={selectedProduct} setSelectedProduct={setSelectedProduct} token={token} /> : null}
          {novoLoginModal? <NovoLoginModal state={novoLoginModal} setState={novoLogin} token={token} /> : null}
          {todosPedidosModal? <TodosPedidosModal state={todosPedidosModal} setState={todosPedidosId} /> : null}
          {exportModal? <ExportModal state={exportModal} setState={exportFunc} token={token} /> : null}
          {deleteOrderIdModal? <DeleteOrderIdModal state={deleteOrderIdModal} setState={deleteOrderId} token={token}/> : null}
         
          {/* EXPORT MODAL */}
      </View>
    )
  }

 







function AddProductModal (props) {

    const [aplicarColor,setAplicarColor]=useState("#ddd")
    const [todosProdutos, setTodosProdutos] =useState('')
    const [novoProduto, setNovoProduto] = useState("")
    const [preco, setPreco] = useState('')

    useEffect(()=>{
      getProdutos()
    },[])

    const getProdutos =() =>{
      axios.get(`https://${ip}/allProducts`, {
      }).then((res) => {
        const obj = []
          const arrAllProducts = res.data.nomeproduto
          arrAllProducts.forEach((e, i, arr)=>{
            obj.push(arr[i])
          })
  setTodosProdutos(obj)
});
    }

    const aplicarAdicaoDeProd = () =>{
      if(preco === "" || novoProduto === ""){
        return alert("Preencha os campos antes de aplicar")
      }

      if (!todosProdutos.includes(novoProduto)){
        setAplicarColor("green")
        addNovoProdutoAoBanco()
      }else alert('ERRO : talvez esse produto já exista')
    }

    const addNovoProdutoAoBanco =() =>{

      
      axios.post(`https://${ip}/addProduct`, {
        nomeproduto:novoProduto,
        preco:preco,
        token:props.token,
      }).then(function (response) {
        alert(`Produto ${novoProduto} foi adicionado com preco ${preco} `)
        setPreco("")
        setNovoProduto("")
      })
      .catch(function (error) {
      alert("Permissão inválida")
        // console.error(error);
  });

    }


    const styles = StyleSheet.create({
    centeredView: {
      flex: 1,
      backgroundColor:'#fff',
      justifyContent: "center",
      alignItems: "center",
      marginTop: Dimensions.get('window').height*0.5,
      
    },
    modalView: {
      alignSelf:'center',
      width:Dimensions.get('window').width*0.8,
      height:Dimensions.get('window').height*0.32,
      marginTop:Dimensions.get('window').height*0.15,
      backgroundColor: "#fff",
      borderRadius: 20,
      padding: 35,
      alignItems: "center",
      shadowColor: "#555",
      shadowOffset: {
        width: 0,
        height: 1
      },
      shadowOpacity: 0.45,
      shadowRadius: 2,
      elevation: 5
    },
    aplicar:{
      color:aplicarColor,
      elevation: 5,backgroundColor: aplicarColor, borderRadius:50, height:40, justifyContent:'center', padding:5
    },
    voltar:{
      elevation: 5,backgroundColor: '#009dff', borderRadius:50, height:40, justifyContent:'center', padding:5
    },
    textWhite:{
      color:'#fff'
    }
  })


 

const fechar = () =>{
  props.setState(!props.state)
}
    
      return (
      <View style={styles.centeredView}>
      <Modal
        animationType="fade"
        transparent={true}
        visible={props.state}
        onRequestClose={() => {
          //  Alert.alert("Modal has been closed."); 
          
          props.setState(!props.state)
          
        }}>
     <View style={styles.modalView}>
         <Text style={{paddingBottom:Dimensions.get('window').height*0.03}}>ADICIONAR PRODUTOS</Text>
       <View style={{flexDirection:"row", paddingTop:10, justifyContent:'center', alignItems:'center'}}>
       <Icon name="list" size={30} color={"#999"} style={{marginRight:Dimensions.get('window').width*0.03, marginLeft:Dimensions.get('window').width*0.06}} />
       <TextInput  autoCapitalize={'none'} 
                  placeholder='adicione um produto' 
                  onChangeText={setNovoProduto} 
                  value={novoProduto} 
                  style={{backgroundColor:"#eee", width:Dimensions.get('window').width*0.38, paddingLeft:10,height:30, marginRight:10,}}/>
                  <Icon name="dollar" size={30} color={"#999"} style={{marginRight:Dimensions.get('window').width*0.03}} />
       <TextInput autoCapitalize={'none'} 
                  placeholder='preco' 
                  onChangeText={setPreco} 
                  value={preco} 
                  style={{backgroundColor:"#eee", width:Dimensions.get('window').width*0.15, paddingLeft:10,height:30}} />
                  
        </View>
       

         <View style={{width:Dimensions.get('window').width*0.8, marginTop:Dimensions.get('window').height*0.05,  flexDirection:'row', justifyContent:'space-around'}}>
           <TouchableOpacity
           style={styles.voltar}
           onPress={fechar
          }
          >
           <Text style={styles.textWhite}>Voltar</Text>
           {/* add aqui opções de preparo pra exportar - ARQUIVAR */}
         </TouchableOpacity>
         <TouchableOpacity
           style={styles.aplicar}
           onPress={aplicarAdicaoDeProd
          }
          >
           <Text style={styles.textStyle}>Aplicar</Text>
           {/* add aqui opções de preparo pra exportar - ARQUIVAR */}
         </TouchableOpacity>

         </View> 
     </View>
     
 </Modal>
 </View>)
  
}
function AlterPrecoModal (props) {


  const [aplicarColor,setAplicarColor]=useState("#ddd")

  const [preco, setPreco] = useState('')

  const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    backgroundColor:'#fff',
    justifyContent: "center",
    alignItems: "center",
    marginTop: Dimensions.get('window').height*0.5,
    
  },
  modalView: {
    alignSelf:'center',
    width:Dimensions.get('window').width*0.8,
    height:Dimensions.get('window').height*0.35,
    marginTop:Dimensions.get('window').height*0.25,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#555",
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.45,
    shadowRadius: 2,
    elevation: 5
  },
  aplicar:{
    color:'#fff',
    elevation: 5,backgroundColor: aplicarColor, borderRadius:50, height:40, justifyContent:'center', padding:5
  },
  voltar:{
    elevation: 5,backgroundColor: '#009dff', borderRadius:50, height:40, justifyContent:'center', padding:5
  },
  textWhite:{
    color:'#fff'
  }
})


const fechar = () =>{
props.setState(!props.state)
}

const apply = () =>{
  if(props.selectedProduct === "0" || preco === ""){
    return alert("Preencha os campos")
  }
  alert(`o produto ${props.selectedProduct} foi alterado tem como preço atual R$${preco}`)

  axios.post(`https://${ip}/editarPrecoProduto`,{
    nomeproduto:props.selectedProduct,
    preco:preco,
    token: props.token
}).then(function (response) {
  // console.log(response.data);
})
.catch(function (error) {
// alert("Login inválido")
  // console.error(error);
});
}
  if(props.state){
    

    return (
    <View style={styles.centeredView}>
    <Modal
      animationType="fade"
      transparent={true}
      visible={props.state}
      onRequestClose={() => {
        //  Alert.alert("Modal has been closed."); 
        
        props.setState(!props.state)
        
      }}>
   <View style={styles.modalView}>
     <Text style={{marginBottom:30}}>Alterar Preços</Text>
     <View style={{flexDirection:"row", justifyContent:'center', alignItems:'center',}}>
     <Icon name="list" size={30} color="#999" style={{marginRight:10,}} />
     <Picker
              mode={'dropdown'}
              style={{width:Dimensions.get('window').width*0.34,height: Dimensions.get('window').height*0.05}}
        selectedValue={props.selectedProduct}
        onValueChange={(itemValue, itemIndex) =>
          props.setSelectedProduct(itemValue)
        }>
          {props.allProducts}
        
      </Picker>
      <Icon name="dollar" size={30} color="#999" style={{marginRight:10,marginLeft:10,}} />
     <TextInput autoCapitalize={'none'} 
                placeholder='Novo preco' 
                onChangeText={setPreco} 
                value={preco} 
                style={{backgroundColor:"#eee", width:Dimensions.get('window').width*0.2,height: Dimensions.get('window').height*0.05, paddingLeft:10,}} />
      </View>
     

       <View style={{width:Dimensions.get('screen').width*0.8, marginBottom:10, marginTop:Dimensions.get("window").height*0.05,flexDirection:'row', justifyContent:'space-around'}}>
         <TouchableOpacity
         style={styles.voltar}
         onPress={fechar
        }
        >
         <Text style={styles.textWhite}>Voltar</Text>
         {/* add aqui opções de preparo pra exportar - ARQUIVAR */}
       </TouchableOpacity>
       <TouchableOpacity
         style={styles.aplicar}
         onPress={apply
        }
        >
         <Text style={styles.textStyle}>Aplicar</Text>
         {/* add aqui opções de preparo pra exportar - ARQUIVAR */}
       </TouchableOpacity>

       </View> 
   </View>
   
</Modal>
</View>)
}
return(<View></View>)
}
function DeleteModal (props) {

  const [excluirColor,setExcluirColor]=useState("#ddd")
  

  const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    backgroundColor:'#fff',
    justifyContent: "center",
    alignItems: "center",
    marginTop: Dimensions.get('window').height*0.5,
    
  },
  modalView: {
    alignSelf:'center',
    width:Dimensions.get('screen').width*0.8,
    height:Dimensions.get('screen').height*0.3,
    marginTop:Dimensions.get('screen').height*0.28,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#555",
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.45,
    shadowRadius: 2,
    elevation: 5
  },
  excluir:{
    color:'#fff',
    elevation: 5,backgroundColor: excluirColor, borderRadius:50, height:40, justifyContent:'center', padding:5
  },
  voltar:{
    elevation: 5,backgroundColor: '#009dff', borderRadius:50, height:40, justifyContent:'center', padding:5
  },
  textWhite:{
    color:'#fff'
  }
})

const excluirProduto = ()=>{
  // console.log(props.selectedProduct, 'produto')

  
  if(props.selectedProduct === 0 || props.selectedProduct === "0" || props.selectedProduct === "" ){
    alert("Escolha um produto para excluir")
    return
  }
  setExcluirColor("green") 


  axios.delete(`https://${ip}/deleteProduct`, {data:{
    nomeproduto:props.selectedProduct,
    token: props.token
  }}).then(function (response) {
    // console.warn(response.data);
  }).catch(error => console.log(error));
  

  setExcluirColor("#eee")
  alert(`produto ${props.selectedProduct} foi excluido`)
  props.setState(!props.state)
}

const fechar = () =>{
props.setState(!props.state)
props.setSelectedProduct("")
}
  if(props.state){
    

    return (
    <View style={styles.centeredView}>
    <Modal
      animationType="fade"
      transparent={true}
      visible={props.state}
      onRequestClose={() => {
        //  Alert.alert("Modal has been closed."); 
        
        props.setState(!props.state)
        
      }}>
   <View style={styles.modalView}>
     <Text style={{paddingBottom: Dimensions.get('window').height*0.04}}>CUIDADO AO EXCLUIR <Icon name="trash" size={20} color={"#999"} /></Text>
     <View style={{flexDirection:"row", justifyContent:'center', alignItems:"center",}}>
      <Icon name="list" size={30} color="#999"  />
     <Picker
              mode={'dropdown'}
              style={{marginLeft:10, paddingLeft:10,width:Dimensions.get('window').width*0.62,height: Dimensions.get('window').height*0.05}}
        selectedValue={props.selectedProduct}
        onValueChange={(itemValue, itemIndex) =>
          props.setSelectedProduct(itemValue)
        }>
          {props.allProducts}
        
      </Picker>
     
     </View>
     

       <View style={{width:Dimensions.get('screen').width*0.8, marginBottom:10, marginTop:18,flexDirection:'row', justifyContent:'space-around'}}>
         <TouchableOpacity
         style={styles.voltar}
         onPress={fechar
        }
        >
         <Text style={styles.textWhite}>Voltar</Text>
         {/* add aqui opções de preparo pra exportar - ARQUIVAR */}
       </TouchableOpacity>
       <TouchableOpacity
         style={styles.excluir}
         onPress={excluirProduto
        }
        >
         <Text style={styles.textStyle}>EXCLUIR</Text>
         {/* add aqui opções de preparo pra exportar - ARQUIVAR */}
       </TouchableOpacity>

       </View> 
   </View>
   
</Modal>
</View>)
}
return(<View></View>)
}
function NovoLoginModal (props) {

  const [email,setEmail] = useState('')
  const [aplicarColor,setAplicarColor]=useState("#ddd")
  const [username, setUsername] =useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm,setPasswordConfirm] = useState('')

  const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    backgroundColor:'#fff',
    justifyContent: "center",
    alignItems: "center",
    marginTop: Dimensions.get('window').height*0.5,
    
  },
  modalView: {
    alignSelf:'center',
    width:Dimensions.get('screen').width*0.8,
    height:Dimensions.get('screen').height*0.43,
    marginTop:Dimensions.get('screen').height*0.2  ,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#555",
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.45,
    shadowRadius: 2,
    elevation: 5
  },
  aplicar:{
    color:'#fff',
    elevation: 5,backgroundColor: aplicarColor, borderRadius:50, height:40, justifyContent:'center', padding:5
  },
  voltar:{
    elevation: 5,backgroundColor: '#009dff', borderRadius:50, height:40, justifyContent:'center', padding:5
  },
  textWhite:{
    color:'#fff'
  }
})
const aplicarNovoLogin = () =>{
  if(password === "" || passwordConfirm === "" || username === "" || password !== passwordConfirm){
    setAplicarColor("red")
    setTimeout(()=>{setAplicarColor('#ddd')},200)
    return alert('preencha todos os campos correntamente')
  }
  


  if(password === passwordConfirm && password !== ""){
    setAplicarColor('green')
    axios.post(`https://${ip}/create`,{
      username:username,
      password:password,
      email:email,
      token:props.token

  }).then(function (response) {
    // console.log(response.data)
    
    // console.warn(response.data.token);
  })
  .catch(function (error) {
    alert("Login inválido")
    console.error(error);
  });

  alert(`usuario ${username} foi criado`)
  setTimeout(()=>{setAplicarColor('#ddd')},100)
}
}
const fechar = () =>{
props.setState(!props.state)
}
  if(props.state){
    

    return (
    <View style={styles.centeredView}>
    <Modal
      animationType="fade"
      transparent={true}
      visible={props.state}
      onRequestClose={() => {
        //  Alert.alert("Modal has been closed."); 
        
        props.setState(!props.state)
        
      }}>
   <View style={styles.modalView}>
<Text style={{marginBottom:Dimensions.get('window').height*0.04}}>ADICIONAR NOVO LOGIN</Text>
<View style={{flexDirection:'row'}}>
<Icon name="user"size={20} color="#999" style={{marginRight:10}} />
     <TextInput  autoCapitalize={'none'} 
                placeholder='Adicione um nome de usuário/email' 
                onChangeText={setUsername} 
                value={username} 
                style={{backgroundColor:"#eee", width:"80%", paddingLeft:10,height:30, marginBottom:10,}}/>
                </View>
    <View style={{flexDirection:'row', justifyContent:'center',}}>
    <Icon name="envelope"size={20} color="#999" style={{marginRight:14,}} />
      <TextInput autoCapitalize={'none'} 
                placeholder='Email' 
                onChangeText={setEmail} 
                value={email} 
                style={{backgroundColor:"#eee", width:"77%", paddingLeft:10,height:30, marginBottom:10, marginRight:10,}} />
   </View>
    <View style={{flexDirection:'row'}}>
    <Icon name="lock"size={20} color="#999" style={{marginRight:12}} />
     <TextInput autoCapitalize={'none'} 
                placeholder='Senha' 
                onChangeText={setPassword} 
                value={password} 
                style={{backgroundColor:"#eee", width:"80%", paddingLeft:10,height:30, marginBottom:10}} />
     </View>
     <View style={{flexDirection:'row'}}>
    <Icon name="unlock"size={20} color="#999" style={{marginRight:7}} />
     <TextInput autoCapitalize={'none'} 
                placeholder='Confirmação de senha' 
                onChangeText={setPasswordConfirm} 
                value={passwordConfirm} 
                style={{backgroundColor:"#eee", width:"80%", paddingLeft:10,height:30}} />
     </View>

       <View style={{width:Dimensions.get('screen').width*0.8, marginBottom:10, marginTop:18,flexDirection:'row', justifyContent:'space-around'}}>
         <TouchableOpacity
         style={styles.voltar}
         onPress={fechar
        }
        >
         <Text style={styles.textWhite}>Voltar</Text>
         {/* add aqui opções de preparo pra exportar - ARQUIVAR */}
       </TouchableOpacity>
       <TouchableOpacity
         style={styles.aplicar}
         onPress={aplicarNovoLogin
        }
        >
         <Text style={styles.textStyle}>Aplicar</Text>
         {/* add aqui opções de preparo pra exportar - ARQUIVAR */}
       </TouchableOpacity>

       </View> 
   </View>
   
</Modal>
</View>)
}
return(<View></View>)
}
function TodosPedidosModal (props) {

  const [modalVisible,setModalVisible]=useState(false)
  const [cliente,setCliente] = useState('')
  const [id,setId] = useState('')
  const [nomeproduto,setNomeProduto]=useState("")
  const [quantidade,setQuantidade]=useState('')
  const [preco,setPreco] = useState("")
  const [status,setStatus] = useState('')
 
  useEffect(()=>{
    getTodosPedidosPorId()
},[props.state])


  const getTodosPedidosPorId =() =>{
    axios.get(`https://${ip}/todosPedidosPorId`, {
    }).then((res) => {
      const obj = []
      res.data.id.forEach((e,i, res)=>{
        obj.push(res[i])
      })
      setId(obj)
      setNomeProduto(res.data.nomeproduto)
      setPreco(res.data.preco)
      setQuantidade(res.data.quantidade)
      setStatus(res.data.status)
});
  }

  const styles = StyleSheet.create({
    flatListContainer: {
      flex: 1,
      marginTop: 5,
      marginHorizontal:5,
      
    },
    item: {
      backgroundColor: '#6e2e2e',
      alignItems: 'center',
      justifyContent: 'center',
      flex: 1,
      margin: 2,
      height: Dimensions.get('window').width/numColumns,
      borderRadius:20, 
    },
    itemInvisible: {
      backgroundColor: 'transparent',
    },
    itemText: {
      color: '#fff',
    },
    viewdaflatlist:{
      height: Dimensions.get('window').width/numColumns,
      width: Dimensions.get('window').width/3 - 5,
      
      
    },
    modalContainer:{
      height: Dimensions.get('window').height-300,
      backgroundColor: '#999',
  
    },
    /*
    exemplo
    */
    centeredView: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      marginTop: 22,
      
    },
    modalView: {
      width:Dimensions.get('screen').width*0.8,
      height:Dimensions.get('screen').height*0.78,
      margin: 20,
      backgroundColor: "white",
      borderRadius: 20,
      padding: 35,
      alignItems: "center",
      shadowColor: "#555",
      shadowOffset: {
        width: 0,
        height: 1
      },
      shadowOpacity: 0.45,
      shadowRadius: 2,
      elevation: 5
    },
    button: {
      borderRadius: 20,
      padding: 10,
      elevation: 2
    },
    buttonOpen: {
      backgroundColor: "#F194FF",
    },
    buttonClose: {
      backgroundColor: "#2196F3",
    },
    textStyle: {
      color: "white",
      fontWeight: "bold",
      textAlign: "center"
    },
    modalText: {
      marginBottom: 15,
      textAlign: "center"
    },
    viewAntesDoModal:{
      backgroundColor: "#999",
    },
    idList:{
      backgroundColor:"#777"
    },
    linhaDaComandaHeaderId:{
      width: Dimensions.get('window').width*0.09,
      margin: 1,
      textAlign:'center',
      color:"white"
    },
    linhaDaComandaHeaderNome:{
      width: Dimensions.get('window').width*0.28,
      margin: 1,
      textAlign:'center',
      color:"white"
    },
    headerPreco:{
      width: Dimensions.get('window').width*0.18,
      margin: 1,
      textAlign:'center',
      color:"white",
    },
    linhaDaComandaHeader:{
      width: Dimensions.get('window').width*0.2,
      margin: 1,
      textAlign:'center',
      color:"white"
    },
    linhaDaComanda:{
      color:'#fff',
      width: Dimensions.get('window').width*0.2-10,
      height: Dimensions.get('window').height/30,
      margin: 1,
      textAlign:'center'
    },
    linhaDaComanda2:{
      width: Dimensions.get('window').width*0.8/4-10,
      height: Dimensions.get('window').height/30,
      margin: 1,
      textAlign:'center'
    },
    linhaDaComandaId:{
      color:'#fff',
      width: Dimensions.get('window').width*0.09,
      height: Dimensions.get('window').height/30,
      margin: 1,
      textAlign:'center'
    },
    linhaDaComanda2Id:{
      width: Dimensions.get('window').width*0.09,
      height: Dimensions.get('window').height/30,
      margin: 1,
      textAlign:'center'
    },
    linhaDaComandaNome:{
        color:"#fff",
      width: Dimensions.get('window').width*0.28 ,
      margin: 1,
      textAlign:'center',
    },
    linhaDaComanda2Nome:{
      width: Dimensions.get('window').width*0.28  ,
      margin: 1,
      textAlign:'center',
    },

    plusAndMinusButtons:{
      backgroundColor:'#fff',
      justifyContent:'center',
      alignItems:'center',
      alignSelf:'center',
      width:Dimensions.get('window').width*0.05,
      height: Dimensions.get('window').height/35,
      borderWidth:0.5,
    },
    quantidade:{
      color:'#fff',
      width:Dimensions.get('window').width*0.2,
      textAlign:'center',
      margin:1
  },

  preco:{
      color:'#fff',
    width: Dimensions.get('window').width*0.18,
    margin: 1,
    textAlign:'center'
  },
  quantidadePreto:{
    width:Dimensions.get('window').width*0.2,
    textAlign:'center',
    margin:1
},

precoPreto:{
  width: Dimensions.get('window').width*0.18,
  margin: 1,
  textAlign:'center'
},


  
  });

  function ListaResultadoComanda (props) {
  



    if(props.id.length>1){
      const linha = []
      // console.log(props.quantidade, 'props quantidade')
      for (let i =0; i<props.id.length;i++){
        // adicionar key pra cada
        
        if(i%2 === 0){
          const obj = []
          obj.push(<Text  style={styles.linhaDaComandaId}>{props.id[i]}</Text>)
          obj.push(<Text  style={styles.linhaDaComandaNome}>{props.nome[i]}</Text>)
          obj.push(<Text  style={styles.preco}>{props.preco[i]}</Text>)
       
          obj.push(<Text  style={styles.quantidade}>{props.quantidade[i]}</Text>)
         
          linha.push(<View style={{flexDirection:'row', backgroundColor:'#6e2e2e'}}>{obj}</View>)
        }
        if(i%2 !== 0){
          const obj = []
          obj.push(<Text  style={styles.linhaDaComanda2Id}>{props.id[i]}</Text>)
          obj.push(<Text  style={styles.linhaDaComanda2Nome}>{props.nome[i]}</Text>)
          obj.push(<Text  style={styles.precoPreto}>{props.preco[i]}</Text>)
        
          obj.push(<Text  style={styles.quantidadePreto}>{props.quantidade[i]}</Text>)
         
          linha.push(<View style={{flexDirection:'row', backgroundColor:'#eee' }}>{obj}</View>)
        }
      }
      
      return <View style={{flexDirection:'column'}}>{linha}</View>
    }
  return(
    <View style={{backgroundColor:'#6e2e2e', flexDirection:'row', textAlign:"center"}}>
    <Text style={styles.linhaDaComandaId}>{props.id} </Text>
    <Text style={styles.linhaDaComandaNome}>{props.nome} </Text>
    <Text style={styles.preco}>{props.preco} </Text>
    <View style={{flexDirection:'row', justifyContent:'space-between',  width: Dimensions.get('window').width*0.19,
  margin: 1,}}>
  
    <Text style={styles.quantidade}  >{props.quantidade}</Text>
   
    </View>
    </View>
  )
  }
  



  return (
  
  <Modal
    animationType="fade"
    transparent={true}
    visible={props.state}
    onRequestClose={() => {
     //  Alert.alert("Modal has been closed."); 
      
      props.setState(!props.state)
      
    }}>
       <View style={styles.centeredView}>
         <View style={styles.modalView}>
           <Text style={styles.modalText}>TODOS PEDIDOS POR ID</Text>
           {/* add aqui as coisas da conta que puxar do cliente */}
           
           {/* View do header */}
           <View style={{backgroundColor:'#000', flexDirection:"row", textAlign:'center', marginBottom:1, height:50, alignItems:'center'}}>

           <Text style={styles.linhaDaComandaHeaderId}>ID </Text>
           <Text style={styles.linhaDaComandaHeaderNome}>NOME </Text>
           <Text style={styles.headerPreco}>PREÇO </Text>
           <Text style={styles.linhaDaComandaHeader}>QNTD </Text>
           </View>
           {/* View do resultado \/ */}
           <ScrollView style={{backgroundColor:'#ddd', width:headerWidthSize,}}>
           <ListaResultadoComanda nome={nomeproduto} preco={preco} quantidade={quantidade} id={id} />
           </ScrollView>

            {/* View do resultado /\ */}

           
        
           <View style={{width:Dimensions.get('screen').width*0.8, marginBottom:10, marginTop:20,flexDirection:'row', justifyContent:'space-around'}}>
           <TouchableOpacity
             style={[styles.button, styles.buttonClose]}
             onPress={() => {
             //  console.log('pressed')
             setCliente('')

             setQuantidade("")
             setPreco('')
             props.setState(!props.state)
             }}
           >
             <Text style={styles.textStyle}>Voltar</Text>
             {/* add aqui opções de preparo pra exportar - ARQUIVAR */}
           </TouchableOpacity>
           <Text style={{fontWeight: "bold", textAlign: "center", alignSelf:'center'}}>Total dessa lista R$  </Text>
           </View>

           
       </View>
       </View>
   </Modal>)
}
function ExportModal (props) {
  const [selectedAction, setSelectedAction] = useState('')
  const [aplicarColor,setAplicarColor]=useState("#ddd")


  const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    backgroundColor:'#fff',
    justifyContent: "center",
    alignItems: "center",
    marginTop: Dimensions.get('window').height*0.5,
    
  },
  modalView: {
    alignSelf:'center',
    width:Dimensions.get('screen').width*0.8,
    height:Dimensions.get('screen').height*0.37,
    marginTop:Dimensions.get('screen').height*0.17,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#555",
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.45,
    shadowRadius: 2,
    elevation: 5
  },
  aplicar:{
    color:'#fff',
    elevation: 5,backgroundColor: aplicarColor, borderRadius:50, height:40, justifyContent:'center', padding:5
  },
  voltar:{
    elevation: 5,backgroundColor: '#009dff', borderRadius:50, height:40, justifyContent:'center', padding:5
  },
  textWhite:{
    color:'#fff'
  }
})

const excelAplicar = ()=>{
  // console.log('aplicar export modal', selectedAction)
  if(selectedAction === "0" || selectedAction === ""){
    setAplicarColor('red')
    alert('selecione uma ação')
    setTimeout(()=>{
setAplicarColor('#ddd')
    },200)
  }
  if(selectedAction === "1"){
  setAplicarColor('green')

  axios({
    url: `https://${ip}/excelComandasFechadas`, //your url
    method: 'GET',
    responseType: 'blob', // important
}).then((response) => {
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
     // passar data aqui no nome
    link.setAttribute('download', 'Fechadas.xlsx'); //or any other extension
    document.body.appendChild(link);
    link.click();
});
setTimeout(()=>{
  setAplicarColor('#ddd')
      },200)
}
  if(selectedAction ==="2"){
    setAplicarColor('green')
    axios({
      url: `https://${ip}/excelTodasComandas`, //your url
      method: 'GET',
      responseType: 'blob', // important
  }).then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      // passar data aqui no nome
      link.setAttribute('download', 'Abertas-Fechadas.xlsx'); //or any other extension
      document.body.appendChild(link);
      link.click();
  });
  setTimeout(()=>{
    setAplicarColor('#ddd')
        },200)
  }
  if(selectedAction === "3"){
    setAplicarColor('green')
    
    axios({
      url: `https://${ip}/excelComandasFechadas`, //your url
      method: 'GET',
      responseType: 'blob', // important
  }).then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
       // passar data aqui no nome
      link.setAttribute('download', 'Fechadas.xlsx'); //or any other extension
      document.body.appendChild(link);
      link.click();
  });

  alert('deletando todas comandas fechadas')
  setTimeout(()=>{

    axios.delete(`https://${ip}/DeleteTodasComandasFechadas`,{data:{

      token:props.token
    }
    })
  },5000)
  setTimeout(()=>{
    setAplicarColor('#ddd')
        },200)
}
if(selectedAction==="4"){
  setAplicarColor('green')
  alert('deletando todas comandas fechadas')
  setTimeout(()=>{
    axios.delete(`https://${ip}/DeleteTodasComandasFechadas`, {data:{
      token:props.token
    }
  }
    )
  },2000)
  setTimeout(()=>{
    setAplicarColor('#ddd')
        },200)
}
}

const fechar = () =>{

props.setState(!props.state)
}

    return (
    <View style={styles.centeredView}>
    <Modal
      animationType="fade"
      transparent={true}
      visible={props.state}
      onRequestClose={() => {
        //  Alert.alert("Modal has been closed."); 
        
        props.setState(!props.state)
        
      }}>
   <View style={styles.modalView}>
     <Text style={{marginBottom:Dimensions.get('window').height*0.05}}>EXPORTAR DADOS PARA PLANILHA</Text>
     <View style={{flexDirection:"row"}}>
<Picker
mode={'dropdown'}
style={{width:Dimensions.get('window').width*0.70,height: Dimensions.get('window').height*0.05}}
selectedValue={selectedAction}
onValueChange={(itemValue, itemIndex) =>
setSelectedAction(itemValue)
}>
  <Picker.Item label="Selecione uma ação" value="0"/>
  <Picker.Item label="Exportar Aba Fechadas" value="1"/>
  <Picker.Item label="Exportar Aba Fechadas e Abertas" value="2"/>
  <Picker.Item label="Exportar Aba Fechadas e excluir Fechadas" value="3"/>
  <Picker.Item label="Excluir Fechadas" value="4"/>
</Picker>
      </View>
     

       <View style={{ width:Dimensions.get('screen').width*0.8, marginBottom:10, marginTop:50,flexDirection:'row', justifyContent:'space-around'}}>
         <TouchableOpacity
         style={styles.voltar}
         onPress={fechar
        }
        >
         <Text style={styles.textWhite}>Voltar</Text>
         {/* add aqui opções de preparo pra exportar - ARQUIVAR */}
       </TouchableOpacity>
       <TouchableOpacity
         style={styles.aplicar}
         onPress={excelAplicar
        }
        >
         <Text style={styles.textStyle}>Aplicar</Text>
         {/* add aqui opções de preparo pra exportar - ARQUIVAR */}
       </TouchableOpacity>

       </View> 
   </View>
   
</Modal>
</View>)
}
function DeleteOrderIdModal (props){

  const [id,setId] = useState([])
  const [idPedido,setIdPedido] =  useState("")
  const [nomeCliente,setNomeCliente] = useState("")
  const [aplicarColor, setAplicarColor] =  useState("#ddd")





  const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    backgroundColor:'#fff',
    justifyContent: "center",
    alignItems: "center",
    marginTop: Dimensions.get('window').height*0.5,
    
  },
  modalView: {
    alignSelf:'center',
    width:Dimensions.get('window').width*0.8,
    height:Dimensions.get('window').height*0.32,
    marginTop:Dimensions.get('window').height*0.15,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#555",
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.45,
    shadowRadius: 2,
    elevation: 5
  },
  aplicar:{
    color:aplicarColor,
    elevation: 5,backgroundColor: aplicarColor, borderRadius:50, height:40, justifyContent:'center', padding:5
  },
  voltar:{
    elevation: 5,backgroundColor: '#009dff', borderRadius:50, height:40, justifyContent:'center', padding:5
  },
  textWhite:{
    color:'#fff'
  }
})

const removerPorId = () =>{
  
  setAplicarColor("green")
  
    axios.get(`https://${ip}/comandaCliente`, {
        params: {
        cliente: nomeCliente,
        token: props.token,
      },  
  
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json;charset=UTF-8'
      },
    }).then((res) => {
      const obj = []
      res.data.id.forEach((e,i, res)=>{
        obj.push(res[i])
      })
      // console.log(obj)
      // console.log(obj.includes(+idPedido), 'includes127')
      setId(obj)
      if(obj.includes(+idPedido)){
        // console.log('axios delete')
        axios.delete(`https://${ip}/deletePedido`,{data:{token:props.token, idpedido:idPedido}})
        alert(`pedido de id${idPedido} foi deletado`)
        setAplicarColor('#ddd')
        setIdPedido("")
        setNomeCliente("")
      }else
      alert('Preencha corretamente os campos')
  })


}


const fechar = () =>{
props.setState(!props.state)
}
  
    return (
    <View style={styles.centeredView}>
    <Modal
      animationType="fade"
      transparent={true}
      visible={props.state}
      onRequestClose={() => {
        //  Alert.alert("Modal has been closed."); 
        
        props.setState(!props.state)
        
      }}>
   <View style={styles.modalView}>
       <Text style={{paddingBottom:Dimensions.get('window').height*0.03}}>REMOVER PEDIDO POR ID <Icon name="trash" size={20} color="#999" style={{marginLeft:Dimensions.get('window').width*0.20,}} /></Text>
     <View style={{flexDirection:"row", paddingTop:10,}}>
      <Icon name="user" size={20} color="#999" style={{marginRight:10,}} />
     <TextInput  autoCapitalize={'none'} 
                placeholder='Nome do Cliente' 
                onChangeText={setNomeCliente} 
                value={nomeCliente} 
                style={{backgroundColor:"#eee", width:Dimensions.get('window').width*0.38, paddingLeft:10,height:30, marginRight:10,}}/>
                <Icon name="hashtag" size={20} color="#999" style={{marginRight:10,}} />
     <TextInput autoCapitalize={'none'} 
                placeholder='id' 
                onChangeText={setIdPedido} 
                value={idPedido} 
                style={{backgroundColor:"#eee", width:Dimensions.get('window').width*0.18, paddingLeft:10,height:30}} />
                
      </View>
     

       <View style={{width:Dimensions.get('window').width*0.8, marginTop:Dimensions.get('window').height*0.05,  flexDirection:'row', justifyContent:'space-around'}}>
         <TouchableOpacity
         style={styles.voltar}
         onPress={fechar
        }
        >
         <Text style={styles.textWhite}>Voltar</Text>
         {/* add aqui opções de preparo pra exportar - ARQUIVAR */}
       </TouchableOpacity>
       <TouchableOpacity
         style={styles.aplicar}
         onPress={removerPorId
        }
        >
         <Text style={styles.textStyle}>Aplicar</Text>
         {/* add aqui opções de preparo pra exportar - ARQUIVAR */}
       </TouchableOpacity>

       </View> 
   </View>
   
</Modal>
</View>)

}