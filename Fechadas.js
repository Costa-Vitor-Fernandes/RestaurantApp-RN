import React, { useState, useEffect } from 'react';
import {
 StyleSheet,
 Text,
 View,
 TextInput,
 Dimensions,
 TouchableOpacity,
 FlatList, Modal, Pressable, ScrollView
} from 'react-native';
import axios from 'axios';

const numColumns = 3
const ip = '192.168.0.17'
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
      backgroundColor:'green',
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
  

export default function Fechadas (props) {
    
    const [eachCliente,setEachCliente] = useState("")
    const [modalVisible,setModalVisible]=useState(false)
    const [cliente,setCliente] = useState('')
    const [id,setId] = useState('')
    const [nomeproduto,setNomeProduto]=useState("")
    const [quantidade,setQuantidade]=useState('')
    const [preco,setPreco] = useState("")
    const [formaDePagamento,setFormaDePagamento] = useState('')


    //useEffect on getClientesFechados()
    // componentDidMount() {
    //     this.getClientesFechados()
        
    //     }
    useEffect(()=>{
            getClientesFechados()
    },[props.refresh])

const getClientesFechados = ()=>{
        axios.get(`http://${ip}:3001/todosClientesFechados`, {
        }).then((res) => {
          const obj = []
            const arrClientes = res.data
            arrClientes.forEach((e, i, arrClientes)=>{
              obj.push({key : arrClientes[i]})
            })
    setEachCliente(obj)
});
}

const getComandaClienteFechado =(cliente)=>{
    console.log('getComandacliente')
  
    axios.get(`http://${ip}:3001/comandaFechadaCliente`, {
        params: {
        cliente: cliente,
        // token: token,
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
      console.log(obj)
      setId(obj)
      setNomeProduto(res.data.nomeproduto)
      setPreco(res.data.preco)
      setQuantidade(res.data.quantidade)
      setFormaDePagamento(res.data.pagamento)
  })
  }
const  popUpComanda = (cliente) =>{
    getComandaClienteFechado(cliente)
    const token = '' 
    setModalVisible(!modalVisible)
      axios.get(`http://${ip}/comandaFechadaCliente`, {
        // body da req deve conter nome do cliente: nome e token: "TOKEN"
        params: {
          cliente: cliente,
          token: token,
        },  
    
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json;charset=UTF-8'
        },
            })
            .then(function (response) {
              // console.warn(response.data);
              }).catch(error => console.log(error));

            setCliente(cliente)
}
const formatData = (data, numColumns) => {
    const numberOfFullRows = Math.floor(data.length / numColumns);
  
    let numberOfElementsLastRow = data.length - (numberOfFullRows * numColumns);
    while (numberOfElementsLastRow !== numColumns && numberOfElementsLastRow !== 0) {
      data.push({ key: `blank-${numberOfElementsLastRow}`, empty: true });
      numberOfElementsLastRow++;
    }
    
  
    return data;
  };

const renderTotalRS = () =>{
  if(id.length>1){
    let total = null
    for (let i in preco){
      total+=preco[i]*quantidade[i]
    }
    return total
  }
  if(id.length===1){
    return preco*quantidade
  }
}



const headerWidthSize = Dimensions.get('window').width*0.755

    
 const renderItem = ({ item, index }) => {
    
    // console.log('log item',item)

    if (item.empty === true) {
      return <View style={[styles.item, styles.itemInvisible]} />;
    }
    return (
      <View style={styles.viewdaflatlist} >

      <Modal
       animationType="fade"
       transparent={true}
       visible={modalVisible}
       onRequestClose={() => {
        //  Alert.alert("Modal has been closed."); 
         
         setModalVisible(!modalVisible)
         
       }}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>Conta de {cliente} - FECHADA</Text>
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
                setModalVisible(!modalVisible)  
                }}
              >
                <Text style={styles.textStyle}>Voltar</Text>
                {/* add aqui opções de preparo pra exportar - ARQUIVAR */}
              </TouchableOpacity>
              <Text style={{fontWeight: "bold", textAlign: "center", alignSelf:'center'}}>Total R${renderTotalRS()} pago com {formaDePagamento}</Text>
              </View>

              
          </View>
          </View>
      </Modal>
        <Pressable
           style={styles.item}
           onPress={()=>
            popUpComanda(item.key)
          }
           >
            
        <Text style={styles.itemText}>{item.key}</Text>
          
      </Pressable>
          </View>
    );
  };

  if(eachCliente.length === 0){
    return <View style={{justifyContent:'center', alignItems:'center'}} ><Text>Não tem ninguem, adicione para começar</Text></View>
  }

 return(
    <FlatList

    data={formatData(eachCliente, numColumns)}
    style={styles.flatListContainer}
    renderItem={renderItem}
    numColumns={numColumns}
    extraData={[modalVisible, preco,nomeproduto,id,quantidade, ]}
    />
 )   

}
  
  
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
