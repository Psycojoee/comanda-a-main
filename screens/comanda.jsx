import React, { useContext, useEffect, useState } from 'react';
import { Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { AuthContext } from '../context/AuthContext.js';
import { MaterialIcons } from '@expo/vector-icons';
import { styles } from '../style.js';

export default function Comanda({ navigation }) {
    const { user } = useContext(AuthContext);
    const [medicamentos, setMedicamentos] = useState([]);
    const [erro, setErro] = useState("");

    useEffect(() => {
        if (user && user.nome) {
            fetch('http://localhost:3000/usuarios')
                .then(response => response.json())
                .then(data => {
                    console.log('Dados da API:', data); // Log da resposta da API
                    const usuarioEncontrado = data.find(u => u.nome === user.nome);
                    console.log('Usuário Encontrado:', usuarioEncontrado); // Log do usuário encontrado

                    if (usuarioEncontrado && usuarioEncontrado.medicamentos) {
                        setMedicamentos(usuarioEncontrado.medicamentos);
                    } else {
                        setErro("Usuário não encontrado ou sem medicamentos.");
                    }
                })
                .catch(error => {
                    console.error('Erro ao buscar dados:', error);
                    setErro("Erro ao carregar os medicamentos. Detalhes: " + error.message);
                });
        } else {
            setErro("Usuário não identificado.");
        }
    }, [user]);

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