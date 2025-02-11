import AsyncStorage from '@react-native-async-storage/async-storage'
import { Stack } from 'expo-router'
import { useEffect, useState } from 'react'
import { Button, FlatList, StyleSheet, Text, TextInput, View, } from 'react-native'


export default function Home(){
  const [todoList, setTodoList] = useState<{id:number,todo:string}[]>([]);
  const [todo,setTodo]= useState<string>('');

  useEffect(() => {
    getData();
  },[]);

  useEffect(() => {
    storeTodoList();
  },[
    todoList,
  ]);

  const storeTodoList = async () => {
    try {
      await AsyncStorage.setItem('todoList', JSON.stringify(todoList))
    } catch (error) {
      alert(error);
    }
  }
  const getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('todoList');
      setTodoList(jsonValue != null ? JSON.parse(jsonValue) : []);
    } catch (e) {
      alert(e);
    }
  };

  const handleSubmit= () =>{
    const ramdomId = Math.random();
    setTodoList([...todoList,{id:ramdomId,todo:todo}]);
    setTodo('');
  }

  const handleDelete = (id:number) =>{
    const newTodoList = todoList.filter((item) => item.id !== id);
    setTodoList(newTodoList);
  }

  const renderItem = ({item}:{item:{id:number,todo:string}}) => {
    return(<View style={styles.itemContainer}>
      <Text numberOfLines={1}>{item.todo}</Text>
      <Button  title='Delete' onPress={()=> handleDelete(item.id)} color='red'/>
    </View>);
  }

  return (
    <View style={styles.container}>
    <Stack.Screen
      options={{
        title: 'To-Do List',
        headerStyle: { backgroundColor: '#f4511e' },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        }
      }}
    />
      <View style={styles.inputContainer}>
        <TextInput style={styles.todoInput} value={todo} onChangeText={(text) => setTodo(text)} placeholder='Type Todo' />
        <Button title='Submit' onPress={handleSubmit}/>
      </View>
      <View style={styles.todoContainer}>
        <FlatList data={todoList} renderItem={renderItem}/>
      </View>
    </View>
);
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    alignItems: 'center',
    padding:20,
  },
  inputContainer:{
    flexDirection:'row'
  },
  todoContainer:{
    paddingTop:20,
    flex:1,
    width:'100%',
  },
  itemContainer:{
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center',
  },
  todoInput:{
    width:'80%',
    borderWidth:1,
    borderColor:'black',
    padding:5,
    marginRight:10
  },
  deleteButton:{
    backgroundColor:'red',
    padding:5,
    borderRadius:5
  }
});