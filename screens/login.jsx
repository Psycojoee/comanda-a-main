import { Image, Text, TextInput, TouchableOpacity, View, ViewBase } from 'react-native';
import { styles } from '../style';

export default function Login({navigation}) {
    return (
        <View style={styles.container}>
            <Image style={styles.imagem} source={require('../assets/chevette.png')} />
            <Text>Sistema Para</Text>
            <Text style={styles.title}>Comanda</Text>
            <TextInput style={styles.input} placeholder='E-mail' />
            <TextInput style={styles.input} placeholder='Senha' secureTextEntry />
            <TouchableOpacity onPress={() => navigation.navigate('Comanda')}>
                <Text style={styles.button}>Entrar</Text>
            </TouchableOpacity>
            
        </View>
    );
}
