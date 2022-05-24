import {View, Text,Button, StyleSheet, TouchableOpacity, Dimensions,Modal,TextInput, ScrollView} from 'react-native'
import { useState,useEffect } from 'react'
import { BottomTabBar } from '@react-navigation/bottom-tabs'
import axios from 'axios'

const ip ='192.168.0.17'
const numColumns=3
const headerWidthSize = Dimensions.get('window').width*0.755

export default function Configuracao (){

  const [exportModal,setExportModal]= useState(false)
  const [addProdutosModal,setAddProdutosModal]= useState(false)
  const [alterPrecoModal, setAlterPrecoModal]= useState(false)
  const [deleteProdutoModal,setDeleteProdutotModal]= useState(false)
  const [novoLoginModal,setNovoLoginModal]= useState(false)
  const [todosPedidosModal,setTodosPedidosModal]= useState(false)


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
        <Text>
          Configurações Configurações Configurações 
        </Text>         
          <TouchableOpacity style={styles.basicButton} onPress={()=>setAddProdutosModal(true)}>
          <Text style={styles.textButton}>Adicionar Produtos</Text></TouchableOpacity>
          

          <TouchableOpacity style={styles.basicButton} onPress={()=>setAlterPrecoModal(true)}>
          <Text style={styles.textButton}>Alterar Preço</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.basicButton} onPress={()=>setDeleteProdutotModal(true)}>
          <Text style={styles.textButton}>Excluir Produtos</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.basicButton} onPress={()=>setNovoLoginModal(true)}>
          <Text style={styles.textButton}>Cadastrar novo Login</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.basicButton} onPress={()=>setTodosPedidosModal(true)}>
          <Text style={styles.textButton}>Todos Pedidos Abertos e Fechados / id</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.basicButton} onPress={()=>setExportModal(true)}>
          <Text style={styles.textButton}>Encerrar Aba Fechadas(Exportar p/ Excel)"</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.basicButton} >
          <Text style={styles.textButton}>Lista Todos os Produtos</Text>
          </TouchableOpacity>

          {/* MODAL */}
          {addProdutosModal? <AddProductModal state={addProdutosModal} setState={addProdutos} /> : null}
          {alterPrecoModal? <AlterPrecoModal state={alterPrecoModal} setState={alterPreco} /> : null}
          {deleteProdutoModal? <DeleteModal state={deleteProdutoModal} setState={deleteProduto} /> : null}
          {novoLoginModal? <NovoLoginModal state={novoLoginModal} setState={novoLogin} /> : null}
          {todosPedidosModal? <TodosPedidosModal state={todosPedidosModal} setState={todosPedidosId} /> : null}
          {exportModal? <ExportModal state={exportModal} setState={exportFunc} /> : null}
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
      axios.get(`http://${ip}:3001/allProducts`, {
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
      if (!todosProdutos.includes(novoProduto)){
        addNovoProdutoAoBanco()
      }else alert('ERRO : talvez já exista')
    }

    const addNovoProdutoAoBanco =() =>{
      console.log(novoProduto, preco, "novo Produto e preco")
      axios.post(`http://${ip}:3001/addProduct`, {
        nomeproduto:novoProduto,
        preco:preco
      }).then(function (response) {
        alert(`Produto ${novoProduto} foi adicionado com preco ${preco} `)
        setPreco("")
        setNovoProduto("")
      })
      .catch(function (error) {
      alert("Login inválido")
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
      width:Dimensions.get('screen').width*0.8,
      height:Dimensions.get('screen').height*0.77,
      marginTop:Dimensions.get('screen').height*0.05,
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
       <View style={{flexDirection:"row"}}>

       <TextInput  autoCapitalize={'none'} 
                  placeholder='adicione um produto' 
                  onChangeText={setNovoProduto} 
                  value={novoProduto} 
                  style={{backgroundColor:"#eee", width:"80%", paddingLeft:10,height:30, marginRight:10,}}/>
       <TextInput autoCapitalize={'none'} 
                  placeholder='preco' 
                  onChangeText={setPreco} 
                  value={preco} 
                  style={{backgroundColor:"#eee", width:"30%", paddingLeft:10,height:30}} />
        </View>
       

         <View style={{ backgroundColor:'orange',width:Dimensions.get('screen').width*0.8, marginBottom:10, marginTop:18,flexDirection:'row', justifyContent:'space-around'}}>
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
  const [produto, setProduto] =useState('')
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
    width:Dimensions.get('screen').width*0.8,
    height:Dimensions.get('screen').height*0.77,
    marginTop:Dimensions.get('screen').height*0.05,
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
     <View style={{flexDirection:"row"}}>

     <TextInput  autoCapitalize={'none'} 
                placeholder='Adicione um produto existente' 
                onChangeText={setProduto} 
                value={produto} 
                style={{backgroundColor:"#eee", width:"80%", paddingLeft:10,height:30, marginRight:10,}}/>
     <TextInput autoCapitalize={'none'} 
                placeholder='Novo preco' 
                onChangeText={setPreco} 
                value={preco} 
                style={{backgroundColor:"#eee", width:"30%", paddingLeft:10,height:30}} />
      </View>
     

       <View style={{ backgroundColor:'orange',width:Dimensions.get('screen').width*0.8, marginBottom:10, marginTop:18,flexDirection:'row', justifyContent:'space-around'}}>
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
         onPress={fechar
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

  const [aplicarColor,setAplicarColor]=useState("#ddd")
  const [produto, setProduto] =useState('')

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
    height:Dimensions.get('screen').height*0.77,
    marginTop:Dimensions.get('screen').height*0.05,
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
     <View style={{flexDirection:"row"}}>

     <TextInput  autoCapitalize={'none'} 
                placeholder='Delete um produto existente' 
                onChangeText={setProduto} 
                value={produto} 
                style={{backgroundColor:"#eee", width:"100%", paddingLeft:10,height:30, marginRight:10,}}/>
     </View>
     

       <View style={{ backgroundColor:'orange',width:Dimensions.get('screen').width*0.8, marginBottom:10, marginTop:18,flexDirection:'row', justifyContent:'space-around'}}>
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
         onPress={fechar
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
function NovoLoginModal (props) {

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
    height:Dimensions.get('screen').height*0.77,
    marginTop:Dimensions.get('screen').height*0.05,
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

     <TextInput  autoCapitalize={'none'} 
                placeholder='Adicione um nome de usuário/email' 
                onChangeText={setUsername} 
                value={username} 
                style={{backgroundColor:"#eee", width:"80%", paddingLeft:10,height:30, marginBottom:10,}}/>
     <TextInput autoCapitalize={'none'} 
                placeholder='Senha' 
                onChangeText={setPassword} 
                value={password} 
                style={{backgroundColor:"#eee", width:"80%", paddingLeft:10,height:30, marginBottom:10}} />
     <TextInput autoCapitalize={'none'} 
                placeholder='Confirmação de senha' 
                onChangeText={setPasswordConfirm} 
                value={passwordConfirm} 
                style={{backgroundColor:"#eee", width:"80%", paddingLeft:10,height:30}} />
     

       <View style={{ backgroundColor:'orange',width:Dimensions.get('screen').width*0.8, marginBottom:10, marginTop:18,flexDirection:'row', justifyContent:'space-around'}}>
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
         onPress={fechar
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
    axios.get(`http://${ip}:3001/todosPedidosPorId`, {
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
  const [aplicarColor,setAplicarColor]=useState("#ddd")
  const [produto, setProduto] =useState('')
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
    width:Dimensions.get('screen').width*0.8,
    height:Dimensions.get('screen').height*0.77,
    marginTop:Dimensions.get('screen').height*0.05,
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
     <View style={{flexDirection:"row"}}>

      </View>
     

       <View style={{ backgroundColor:'orange',width:Dimensions.get('screen').width*0.8, marginBottom:10, marginTop:18,flexDirection:'row', justifyContent:'space-around'}}>
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
         onPress={fechar
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