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

const numColumns = 3;
const token = ''
const ip = '192.168.0.17'

export default function Abertas (props){
    const [eachCliente,setEachCliente] = useState("")
    const [modalVisible,setModalVisible]=useState(false)
    const [cliente,setCliente] = useState('')
    const [id,setId] = useState('')
    const [nomeproduto,setNomeProduto]=useState("")
    const [quantidade,setQuantidade]=useState('')
    const [preco,setPreco] = useState("")
    const [novoProduto,setNovoProduto] = useState("")
    const [qntdAntesDaMudanca, setQntdAntesDaMudanca]= useState('')
    const [idOndeMudou, setIdOndeMudou] = useState([])
    const [formaDePagamento,setFormaDePagamento] = useState('')
    const [color,setColor]= useState("#aaa")
    const [aplicarColor,setAplicarColor] = useState("#aaa")
    const [colorButtonTextInput, setColorButtonTextInput] = useState("#aaa")
    //useEffect on getClientes()
    // componentDidMount() {
    //     this.getClientes()
        
    //     }
    useEffect(()=>{
            getClientes()
    },[props.refresh])

const getClientes = ()=>{
        axios.get(`http://${ip}:3001/todosClientesAbertos`, {
        }).then((res) => {
          const obj = []
            const arrClientes = res.data
            arrClientes.forEach((e, i, arrClientes)=>{
              obj.push({key : arrClientes[i]})
            })
    setEachCliente(obj)
});
}

const getComandaCliente =(cliente)=>{
    console.log('getComandacliente')
  
    axios.get(`http://${ip}:3001/comandaCliente`, {
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
  })
  }
const  popUpComanda = (cliente) =>{
    getComandaCliente(cliente)
    const token = '' 
    setModalVisible(!modalVisible)
      axios.get(`http://${ip}:3001/comandaCliente`, {
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

  const setQntd = (q,id)=>{
    if (!idOndeMudou.includes(id)){
      setIdOndeMudou(idOndeMudou.concat(id))
    }
    setQntdAntesDaMudanca(quantidade)
    setQuantidade(q)
  }

  const updateQuantidade = (id, quantidade) =>{
    
    axios.post(`http://${ip}:3001/updateQuantidade`, {
      quantidade:quantidade,
      id:id,
      token: token
  })
  .then(function (response) {
      console.log(response.data)
    })
    .catch(function (error) {
      // console.error(error);
});
  }
  


const aplicarMudanca = () =>{
  // console.log(qntdAntesDaMudanca, 'antes')
console.log(quantidade, 'qnt atual')
console.log(id)
console.log(idOndeMudou, 'idondeMudou')
setAplicarColor("green")
// axios.post pra dar update onde mudou no banco nesses ids. tem que desmembrar provavelmente, com indexOf ids e idOndeMudou

// quando adicionar mais de um pedido existente
if(idOndeMudou.length>1){
  console.log(idOndeMudou)
for(let i in idOndeMudou){
  const quantidadeOndeMudou = quantidade[id.indexOf(idOndeMudou[i])]
  updateQuantidade(idOndeMudou[i], quantidadeOndeMudou)
  setIdOndeMudou([])
}
}
if(idOndeMudou.length===1){
  const quantidadeOndeMudou = quantidade[id.indexOf(idOndeMudou[0])]
  updateQuantidade(idOndeMudou[0], quantidadeOndeMudou)
  setIdOndeMudou([])
}



// terminou de aplicar a mudanca fecha o modal
setTimeout(()=>{

  setModalVisible(!modalVisible)
  setAplicarColor('#aaa')  
},200)
}

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

const addPeloTextInput = () =>{
  // novoProduto, cliente q ta clicado e mandar um post 
  console.log(cliente, novoProduto)
  setColorButtonTextInput('green')
  
  axios.post(`http://${ip}:3001/addToComanda`, {
    cliente: cliente,
    nomeproduto:novoProduto,
    quantidade:1
})
.then(function (response) {
    // console.warn(response.data);
  })
  .catch(function (error) {
    // console.error(error);
});
setTimeout(()=>{
  getComandaCliente(cliente)
  setNovoProduto('')
  setColorButtonTextInput('#aaa')
},2000)

}
const pagarAConta = () =>{
  
  if (formaDePagamento.length>2){
  console.log(cliente,' esta pagando um total de' , renderTotalRS(), ' reais com', formaDePagamento, 'dos pedidos com ids ', id )
  setColor('green')
  function encerraComanda (cadaid) {

      axios.post(`http://${ip}:3001/encerrarComanda`, {
        cliente:cliente,
        pagamento:formaDePagamento,
        id:cadaid
      })
      .then(function (response) {
        // console.warn(response.data)
      })
    .catch(function (error) {
    
      console.error(error);
    });
  }
  
  for(let i in id){
    encerraComanda(id[i])
  }
  setTimeout(()=>{
    setFormaDePagamento('')
    setModalVisible(!modalVisible)
    getClientes()
    setColor("#aaa")
  },200)
}

  // setModalVisible(!modalVisible)
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
              <Text style={styles.modalText}>Conta de {cliente}</Text>
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
              <ListaResultadoComanda nome={nomeproduto} preco={preco} quantidade={quantidade} id={id} setQntd={setQntd} />
              </ScrollView>

               {/* View do resultado /\ */}


              {/* botao de adicionar */}
              <View style={{flexDirection:'row', width:Dimensions.get('screen').width*0.75, textAlign: 'center', marginTop:8, marginBottom:10 }}>
              {/* <TextInput onChangeText={setNovoProduto} placeholder='adicionar um produto' value={novoProduto} style={{backgroundColor:"#eee", width:"100%", paddingLeft:10}}></TextInput> */}
                <TextInput 
                autoCapitalize={'none'} 
                placeholder='adicione um produto' 
                onChangeText={setNovoProduto} 
                value={novoProduto} 
                style={{backgroundColor:"#eee",alignContent:'center', width:Dimensions.get('screen').width*0.70, paddingLeft:10,height:30}} />
              <TouchableOpacity style={{backgroundColor: colorButtonTextInput, height:30, width:Dimensions.get('screen').width*0.05, justifyContent:'center', alignItems:'center'}} onPress={addPeloTextInput}><Text>+</Text></TouchableOpacity>
              </View>
              {/* add aqui as coisas da conta que puxar do cliente */}
              
              <View style={{flexDirection:'row', width:Dimensions.get('screen').width*0.75}}>

                <TextInput 
                  autoCapitalize={'none'} 
                  placeholder='adicione a forma de pagamento' 
                  onChangeText={setFormaDePagamento} 
                  value={formaDePagamento} 
                  style={{backgroundColor:"#eee", width:Dimensions.get('screen').width*0.5, paddingLeft:10,height:30}} />
                <TouchableOpacity 
                  style={{backgroundColor: color, height:30, width:Dimensions.get('window').width*0.22, justifyContent:'center', alignItems:'center', marginLeft:13}} 
                  onPress={pagarAConta}>
                  <Text style={styles.textStyle}>PAGAR</Text>
                </TouchableOpacity>
              </View>
              <View style={{width:Dimensions.get('screen').width*0.8, marginBottom:10, marginTop:20,flexDirection:'row', justifyContent:'space-around'}}>
              <TouchableOpacity
                style={[styles.button, styles.buttonClose]}
                onPress={() => {
                //  console.log('pressed')
                setCliente('')
                setIdOndeMudou([])
                setQuantidade("")
                setPreco('')
                setModalVisible(!modalVisible)  
                }}
              >
                <Text style={styles.textStyle}>Voltar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{elevation: 5,backgroundColor: aplicarColor, borderRadius:50, height:40, justifyContent:'center', padding:5}} 
                                onPress={aplicarMudanca}>
                <Text style={styles.textStyle}>Aplicar</Text>
              </TouchableOpacity>
              <Text style={{fontWeight: "bold", textAlign: "center", alignSelf:'center'}}>Total R${renderTotalRS()}</Text>
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
    extraData={[modalVisible, preco,nomeproduto,id,quantidade, novoProduto ]}
    />
 )   
}
  
const styles = StyleSheet.create({
    flatListContainer: {
      flex: 1,
      marginTop: 5,
      marginHorizontal:5,
      
    },
    item: {
      backgroundColor: '#4B7C6F',
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
      backgroundColor:'#bbb',
      justifyContent:'center',
      alignItems:'center',
      alignSelf:'center',
      width:Dimensions.get('window').width*0.05,
      height: Dimensions.get('window').height/35,
      borderWidth:0.5,
      elevation: 5,
    },
    quantidade:{
      width:Dimensions.get('window').width*0.06,
      textAlign:'center',
      margin:1
  },

  preco:{
    width: Dimensions.get('window').width*0.17,
    margin: 1,
    textAlign:'center'
  },

  
  });
  
function ListaResultadoComanda (props) {
  

const plusButton = (i)=>{
  const arrId = props.id[i]
  const arrQntd = [...props.quantidade]
  const result = props.quantidade[i]+1
  arrQntd.splice(i,1,result)
  console.log(arrQntd, 'arr qntd', props.quantidade, 'props quantidade', arrId, 'arrids')
  props.setQntd(arrQntd, arrId)
}
const minusButton=(i)=>{
  const arrId = props.id[i]
  const arrQntd = [...props.quantidade]
  const result = props.quantidade[i]-1
  if (result === 0) return 
  arrQntd.splice(i,1,result)
  console.log(arrQntd, 'arr qntd', props.quantidade, 'props quantidade')
  props.setQntd(arrQntd,arrId)
}



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
        obj.push(<TouchableOpacity style={styles.plusAndMinusButtons} onPress={()=>minusButton(i)}><Text>-</Text></TouchableOpacity>)
        obj.push(<Text  style={styles.quantidade}>{props.quantidade[i]}</Text>)
        obj.push(<TouchableOpacity style={styles.plusAndMinusButtons} onPress={()=>plusButton(i)}><Text>+</Text></TouchableOpacity>)
        linha.push(<View style={{flexDirection:'row', backgroundColor:'#5c998a'}}>{obj}</View>)
      }
      if(i%2 !== 0){
        const obj = []
        obj.push(<Text  style={styles.linhaDaComanda2Id}>{props.id[i]}</Text>)
        obj.push(<Text  style={styles.linhaDaComanda2Nome}>{props.nome[i]}</Text>)
        obj.push(<Text  style={styles.preco}>{props.preco[i]}</Text>)
        obj.push(<TouchableOpacity style={styles.plusAndMinusButtons} onPress={()=>minusButton(i)}><Text>-</Text></TouchableOpacity>)
        obj.push(<Text  style={styles.quantidade}>{props.quantidade[i]}</Text>)
        obj.push(<TouchableOpacity style={styles.plusAndMinusButtons}  onPress={()=>plusButton(i)}><Text>+</Text></TouchableOpacity>)
        linha.push(<View style={{flexDirection:'row', backgroundColor:'#eee' }}>{obj}</View>)
      }
    }
    
    return <View style={{flexDirection:'column'}}>{linha}</View>
  }
return(
  <View style={{backgroundColor:'#5c998a', flexDirection:'row', textAlign:"center"}}>
  <Text style={styles.linhaDaComandaId}>{props.id} </Text>
  <Text style={styles.linhaDaComandaNome}>{props.nome} </Text>
  <Text style={styles.preco}>{props.preco} </Text>
  <View style={{flexDirection:'row', justifyContent:'space-between',  width: Dimensions.get('window').width*0.19,
margin: 1,}}>
    <TouchableOpacity style={styles.plusAndMinusButtons} onPress={()=>minusButton(0)}><Text>-</Text></TouchableOpacity>
  <Text style={styles.quantidade}  >{props.quantidade}</Text>
  <TouchableOpacity style={styles.plusAndMinusButtons}  onPress={()=>plusButton(0)}><Text>+</Text></TouchableOpacity>
  </View>
  </View>
)
}
