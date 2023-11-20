import React, { useState } from 'react';
import { View, TextInput, Button, Text } from 'react-native';
import axios from 'axios';
import { styles } from '../style';
import { MaterialIcons } from '@expo/vector-icons';

const SignUp = ({ navigation }) => {
  const [userDetails, setUserDetails] = useState({
    nome: '',
    email: '',
    senha: '',
    endereco: '',
    data: '',
    medicamentos: []  // Adiciona medicamentos aqui
  });
  const [erro, setErro] = useState("");

  const handleInputChange = (field, value) => {
    setUserDetails({
      ...userDetails,
      [field]: value,
    });
  };

  const handleSubmit = async () => {
    if (!userDetails.nome || !userDetails.email || !userDetails.senha) {
      setErro("Preencha os campos corretamente");
      return;
    }

    try {
      const response = await axios.post('http://localhost:3000/usuarios', userDetails);
      console.log(response.data);
      navigation.navigate('Home');
    } catch (error) {
      console.error(error);
      setErro("Erro ao realizar o cadastro");
    }
  };

  return (
    <View style={styles.containerTest}>
      <MaterialIcons name="exit-to-app" size={24} color="black" style = {styles.title}
        onPress={() => navigation.navigate('Home')} />
      <TextInput
        style={styles.input}
        placeholder="Nome"
        onChangeText={(value) => handleInputChange('nome', value)}
        value={userDetails.nome}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        onChangeText={(value) => handleInputChange('email', value)}
        value={userDetails.email}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        value={userDetails.senha}
        onChangeText={(value) => handleInputChange('senha', value)}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="Endereço"
        value={userDetails.endereco}
        onChangeText={(value) => handleInputChange('endereco', value)}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Data"
        value={userDetails.data}
        onChangeText={(value) => handleInputChange('data', value)}
        autoCapitalize="none"
      />
      {erro !== "" && <Text style={styles.error}>{erro}</Text>} {/* Exibe a mensagem de erro */}
      <Button title="Cadastrar" onPress={handleSubmit}/>
    </View>
  );
};

export default SignUp;
