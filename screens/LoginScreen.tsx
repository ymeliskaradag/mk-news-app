import React, {FC, useState} from 'react';
import {Text, Image, View, StyleSheet, TextInput, Button, Alert, TouchableOpacity} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useTranslation} from "react-i18next";
import {Buffer} from "buffer";
import { Ionicons } from '@expo/vector-icons';

interface LoginScreenProps {
    setIsLoggedIn: (loggedIn: boolean) => void;
}
const LoginScreen: FC<LoginScreenProps> = ({ setIsLoggedIn }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [profileImage, setProfileImage] = useState<string | null>(null);
    const { t, i18n } = useTranslation();
    const storeUsername = async (username :string) => {
        try {
            await AsyncStorage.setItem('@username', username);
        } catch (e) {
            console.log(e);
        }
    }


    const handleLogin = async () => {
        axios.post('http://10.0.2.2:3000/login', {
             username,
            password,
        }).then(response => {
            console.log(response.data);
            storeUsername(username);
            setIsLoggedIn(true);
            axios.get('http://10.0.2.2:3000/language', { params: { username } })
                .then( languageResponse => {
                    const userLanguage = languageResponse.data.planguage;
                    i18n.changeLanguage(userLanguage);
                }).catch(error => {
                console.error(error);
            })
        }).catch(error => {
            console.error(error);
            const message = error.response ? error.response.data : t('loginfailed');
            Alert.alert(t('warn'), message);
        });
    };
    const validatePassword = (password :string) => {
        const regex = /^(?=.*[a-z])(?=.*[A-Z]).{6,16}$/;
        return regex.test(password);
    };
    const handleRegister = () => {
        if (!validatePassword(password)) {
            alert(t('passalert'));
            return;
        }
        axios.post('http://10.0.2.2:3000/register', {
            username,
            password,
        }).then(response => {
            console.log(response.data);
            storeUsername(username);
            handleLogin();
        }).catch(error => {
            console.error(error);
            Alert.alert(t('warn'), t('registerfailed')); 
        });
    };

    const handleUsernameEndEditing = async () => {
        if (username) {
            try {
                const response = await axios.get('http://10.0.2.2:3000/profile', { params: { username } });
                if (response.data && response.data.pimage) {
                    const byteArray = response.data.pimage.data;
                    const base64Image = Buffer.from(byteArray).toString('base64');
                    setProfileImage(`data:image/png;base64,${base64Image}`);
                }
            } catch (error) {
            }
        }
    };

    return (

        <View style={styles.container}>
            <Text style={styles.title}>news app</Text>
            {profileImage && (
                <Image source={{ uri: profileImage }} style={styles.profilePic} />
            )}
            <TextInput
                placeholder={t('username')}
                value={username}
                onChangeText={setUsername}
                style={styles.input}
                onEndEditing={handleUsernameEndEditing}
            />
            <TextInput
                placeholder={t('password')}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={styles.input}
            />
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={[styles.button, styles.loginButton]} onPress={handleLogin}>
                    <Ionicons name="log-in" size={20} color="white" />
                    <Text style={styles.buttonText}>{t('login')}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button, styles.registerButton]} onPress={handleRegister}>
                    <Ionicons name="person-add" size={20} color="white" />
                    <Text style={styles.buttonText}>{t('register')}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5', 
        marginBottom:100
    },
    title: {
        fontSize: 48,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 60
    },
    input: {
        width: '80%',
        height: 40,
        borderColor: '#ccc', 
        borderWidth: 1,
        marginVertical: 10,
        padding: 10,
        borderRadius: 5, 
        backgroundColor: '#fff', 
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '80%',
        marginTop: 20, 
    },
    button: {
        flexDirection: 'row', 
        alignItems: 'center', 
        padding: 12, 
        borderRadius: 5,
        marginTop:20,
        flex: 1,
        justifyContent: 'center', 
        marginHorizontal: 5, 
    },
    loginButton: {
        backgroundColor: '#007bff', 
    },
    registerButton: {
        backgroundColor: '#28a745', 
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        marginLeft: 5, 
    },
    profilePic: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginTop:60,
        marginBottom: 20, 
    },
});

export default LoginScreen;
