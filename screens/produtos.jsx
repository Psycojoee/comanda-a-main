import { AuthContext } from '../context/AuthContext';
import { MaterialIcons } from '@expo/vector-icons';
import { View, TextInput, Button, Alert, ScrollView, Text, TouchableOpacity} from 'react-native';
import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { styles } from '../style';

export default function CadastroMedicamento({navigation}) {
    const { user } = useContext(AuthContext);
    const [nome, setNome] = useState('');
    const [horariosDeDosagem, setHorariosDeDosagem] = useState('');
    const [quantidade, setQuantidade] = useState('');
    const [medicamentos, setMedicamentos] = useState([]);

    useEffect(() => {
        carregarMedicamentos();
    }, []);

    const carregarMedicamentos = () => {
        if (user) {
            axios.get(`http://localhost:3000/usuarios/${user.id}`)
                .then(response => {
                    setMedicamentos(response.data.medicamentos || []);
                })
                .catch(error => {
                    Alert.alert('Erro', 'Falha ao carregar medicamentos.');
                });
        }
    };

    const handleSubmit = () => {
        if (!user) {
            Alert.alert('Erro', 'Usuário não está logado.');
            return;
        }

        if (!nome || !horariosDeDosagem || !quantidade) {
            Alert.alert('Erro', 'Por favor, preencha todos os campos.');
            return;
        }

        const novoMedicamento = {
            id: Math.random().toString(36).substr(2, 9), // Gera um ID único
            nome,
            horariosDeDosagem,
            quantidade
        };

        axios.get(`http://localhost:3000/usuarios/${user.id}`)
            .then(response => {
                const usuarioAtualizado = response.data;
                usuarioAtualizado.medicamentos = [...usuarioAtualizado.medicamentos, novoMedicamento];

                // Atualizar o usuário com o novo medicamento
                return axios.put(`http://localhost:3000/usuarios/${user.id}`, usuarioAtualizado);
            })
            .then(response => {
                setNome('');
                setHorariosDeDosagem('');
                setQuantidade('');
                carregarMedicamentos(); // Recarregar medicamentos após o sucesso
                Alert.alert('Sucesso', 'Medicamento cadastrado com sucesso!');
            })
            .catch(error => {
                Alert.alert('Erro', 'Falha ao cadastrar medicamento.');
            });
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <MaterialIcons name="exit-to-app" size={24} color="black" 
                    onPress={() => navigation.navigate ('Comanda')} />
            </View>
            <Text style={styles.title}>Login</Text>
            <TextInput 
                style={styles.input} 
                placeholder="Nome do Medicamento" 
                onChangeText={setNome} 
                value={nome} 
            />
            <TextInput
                style={styles.input} 
                placeholder="Horários de Dosagem" 
                onChangeText={setHorariosDeDosagem} 
                value={horariosDeDosagem} 
            />
            <TextInput 
                style={styles.input} 
                placeholder="Quantidade" 
                onChangeText={setQuantidade} 
                value={quantidade} 
                keyboardType="numeric" 
            />
            <Button style={styles.button}
                title="Cadastrar Medicamento" 
                onPress={handleSubmit} 
            />

            <ScrollView>
                {medicamentos.map((medicamento, index) => (
                    <Text key={index} style={styles.input} >{medicamento.nome} - {medicamento.horariosDeDosagem} - {medicamento.quantidade}</Text>
                ))}
            </ScrollView>
        </View>
    );
}