import React, { useState, useContext, useEffect } from 'react';
import { View, TextInput, Button, Alert, ScrollView, Text } from 'react-native';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

export default function CadastroMedicamento() {
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
        <View>
            <TextInput 
                placeholder="Nome do Medicamento" 
                onChangeText={setNome} 
                value={nome} 
            />
            <TextInput 
                placeholder="Horários de Dosagem" 
                onChangeText={setHorariosDeDosagem} 
                value={horariosDeDosagem} 
            />
            <TextInput 
                placeholder="Quantidade" 
                onChangeText={setQuantidade} 
                value={quantidade} 
                keyboardType="numeric" 
            />
            <Button 
                title="Cadastrar Medicamento" 
                onPress={handleSubmit} 
            />

            <ScrollView>
                {medicamentos.map((medicamento, index) => (
                    <Text key={index}>{medicamento.nome} - {medicamento.horariosDeDosagem} - {medicamento.quantidade}</Text>
                ))}
            </ScrollView>
        </View>
    );
}