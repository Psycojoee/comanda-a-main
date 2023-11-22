import React, { useContext, useEffect, useState, useCallback } from 'react';
import { Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { AuthContext } from '../context/AuthContext.js';
import { MaterialIcons } from '@expo/vector-icons';
import { styles } from '../style.js';

export default function Comanda({ navigation }) {
    const { user } = useContext(AuthContext);
    const [medicamentos, setMedicamentos] = useState([]);
    const [erro, setErro] = useState("");

    const carregarMedicamentos = useCallback(() => {
        if (user && user.nome) {
            fetch('http://localhost:3000/usuarios')
                .then(response => response.json())
                .then(data => {
                    // Ajuste: Verifique se a resposta é um array ou contém a chave 'usuarios'
                    const listaUsuarios = Array.isArray(data) ? data : data.usuarios;
                    if (listaUsuarios) {
                        const usuarioEncontrado = listaUsuarios.find(u => u.nome === user.nome);
                        if (usuarioEncontrado && usuarioEncontrado.medicamentos) {
                            setMedicamentos(usuarioEncontrado.medicamentos);
                        } else {
                            setErro("Usuário não encontrado ou sem medicamentos.");
                        }
                    } else {
                        setErro("Erro na estrutura dos dados da API.");
                    }
                })
                .catch(error => {
                    console.error('Erro ao buscar dados:', error);
                    setErro("Erro ao carregar os medicamentos. Detalhes: " + error.message);
                });
        }
    }, [user]);

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', carregarMedicamentos);

        // Carregar medicamentos na montagem inicial
        carregarMedicamentos();

        return unsubscribe;
    }, [navigation, carregarMedicamentos]);

    return (
        <View style={styles.containerBetween}>
            <View style={styles.header}>
                <View>
                    <Text>Seja Bem Vindo,</Text>
                    <Text style={styles.title}>{user ? user.nome : ''}</Text>
                </View>
                <MaterialIcons name="exit-to-app" size={24} color="black"
                    onPress={() => navigation.navigate('Home')} />
            </View>

            <ScrollView>
                {erro ? (
                    <Text style={styles.error}>{erro}</Text>
                ) : (
                    medicamentos.map((medicamento, index) => (
                        <Text key={index} style={styles.input}>
                            {medicamento.nome} - {medicamento.horariosDeDosagem} - {medicamento.quantidade}
                        </Text>
                    ))
                )}
            </ScrollView>

            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Produtos')}>
                <Text style={styles.buttonText}>Cadastrar novo medicamento</Text>
            </TouchableOpacity>

            <Text>Obrigado pela preferência</Text>
        </View>
    );
}
