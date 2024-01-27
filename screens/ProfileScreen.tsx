    import { Picker } from '@react-native-picker/picker';
    import RNPickerSelect from 'react-native-picker-select';
    import React, { useState, useEffect } from 'react';
    import {RefreshControl, Text, View, TextInput, Button, StyleSheet, Image, Platform, KeyboardAvoidingView,ScrollView,PermissionsAndroid  } from 'react-native';
    import { launchImageLibrary, MediaType, ImagePickerResponse, Asset, launchCamera } from 'react-native-image-picker';
    import axios from 'axios';
    import AsyncStorage from '@react-native-async-storage/async-storage';
    import { TouchableOpacity } from 'react-native';
    import * as ImagePicker from 'expo-image-picker';
    import { Buffer } from 'buffer';
    import {useTranslation} from "react-i18next";
    import { Ionicons } from '@expo/vector-icons';



    interface ProfileScreenProps {
        logout: () => void;
    }
    const ProfileScreen: React.FC<ProfileScreenProps> = ({ logout }) => {
        const [userData, setUserData] = useState({
            username: '',
            usersurname: '',
            userphone: '',
            useremail: '',
            password: '',
            planguage: '',
            plocation: '',
            pimage: '',
            updatePassword: false
        });
        const [refreshing, setRefreshing] = useState(false);
        const { t, i18n } = useTranslation();
        const [isPasswordChanged, setIsPasswordChanged] = useState(false);

        const onRefresh = React.useCallback(async () => {
            setRefreshing(true);
            try {
                await loadProfile();
            } catch (error) {
                console.error('Error refreshing profile:', error);
            }
            setRefreshing(false);
        }, []);

        useEffect(() => {
            loadProfile();
        }, []);

        const handleUpdate = async () => {
            try {
                if (!userData.username || !userData.usersurname || !userData.userphone ||
                    !userData.useremail || (!userData.password && isPasswordChanged) ||
                    !userData.planguage || !userData.plocation) {
                    alert(t('fillallfields'));
                    return;
                }
                if (!validateEmail(userData.useremail)) {
                    alert(t('emailalert'));
                    return;
                }

                if (userData.userphone.length>11){
                    alert(t('phonealert'));
                    return;
                }

                if (isPasswordChanged){
                    if (!validatePassword(userData.password)) {
                        alert(t('passalert'));
                        return;
                    }
                    userData.updatePassword = true;
                }
                else{
                    userData.updatePassword = false;
                }
                const updateResponse = await axios.post('http://10.0.2.2:3000/updateProfile', userData);
                console.log(updateResponse.data);
                alert(t('profilesuccess'));
                i18n.changeLanguage(userData.planguage);
            } catch (error) {
                console.error('Update error:', error);
                alert(t('checkdata'));
            }
        };


        const selectImage = async () => {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            });

            if (!result.canceled) {
                handleImageUpload(result.assets[0].uri); 
            }
        };

        const loadProfile = async () => {
            try {
                const username = await AsyncStorage.getItem('@username');
                if (username !== null) {
                    setUserData( {...userData,username});
                    const response = await axios.get('http://10.0.2.2:3000/profile', { params: { username } });
                    if (response.data.pimage){
                        const byteArray = response.data.pimage.data;
                        const base64Image = Buffer.from(byteArray).toString('base64');
                        setUserData({ ...response.data, pimage: `data:image/jpeg;base64,${base64Image}` });
                    }
                    setIsPasswordChanged(false);
                }
            } catch (error) {
                console.error('Profil yüklenirken hata oluştu:', error);
            }
        };



        const handleImageUpload = async (uri: string) => {
            const response = await fetch(uri);
            const blob = await response.blob();
            const reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onloadend = async () => {
                const base64data = reader.result;
                if (typeof base64data === 'string') {
                    try {
                        const uploadResponse = await axios.post('http://10.0.2.2:3000/uploadImage', {
                            image: base64data,
                            username: userData.username,
                        });

                        console.log(uploadResponse);
                        if (uploadResponse.status === 200) {
                            loadProfile();  
                        } else {
                            console.error('Image upload failed:', uploadResponse.data);
                        }
                    } catch (error) {
                        console.error('Error uploading image:', error);
                    }
                }
            };
        };


        const validateEmail = (email:string) => {
            const re = /\S+@\S+\.\S+/;
            return re.test(email);
        };

        const validatePassword = (password :string) => {
            const regex = /^(?=.*[a-z])(?=.*[A-Z]).{6,16}$/;
            return regex.test(password);
        };

        return (
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.container}
            >
                <ScrollView
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                        />
                    }
                >
            <View style={styles.container}>
                <View style={styles.imageContainer}>
                    <TouchableOpacity onPress={selectImage}>
                        <Image
                            source={userData.pimage ? { uri: userData.pimage } : require('./default.png')}
                            style={styles.profileImage}
                        />

                    </TouchableOpacity>
                </View>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>{t('username')} *</Text>
                    <TextInput
                        placeholder={t('username')}
                        value={userData.username}
                        editable={false}
                        style={styles.input}
                    />
                </View>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>{t('surname')} *</Text>
                <TextInput
                    placeholder={t('surname')}
                    value={userData.usersurname}
                    onChangeText={text => setUserData({ ...userData, usersurname: text })}
                    style={styles.input}
                />
                </View>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>{t('phone')} *</Text>
                <TextInput
                    placeholder="+905-555-5555"
                    value={userData.userphone}
                    onChangeText={text => setUserData({ ...userData, userphone: text })}
                    style={styles.input}
                />
                </View>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>{t('email')} *</Text>
                <TextInput
                    placeholder={t('email')}
                    value={userData.useremail}
                    onChangeText={text => setUserData({ ...userData, useremail: text })}
                    style={styles.input}
                />
                </View>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>{t('password')} *</Text>
                <TextInput
                    placeholder={t('password')}
                    value={userData.password}
                    onChangeText={text => {
                        setUserData({ ...userData, password: text });
                        setIsPasswordChanged(true); 
                    }}
                    secureTextEntry
                    style={styles.input}
                    onFocus={() => setUserData({ ...userData, password: '' })} 
                />
                </View>
                <View style={styles.pickerContainer}>
                    <Text style={styles.label}>{t('applanguage')} *</Text>
                <RNPickerSelect
                    onValueChange={(value) => setUserData({ ...userData, planguage: value })}
                    items={[
                        { label: 'English', value: 'en' },
                        { label: 'Turkish', value: 'tr' },
                        { label: 'Espanol', value: 'es' },
                        { label: 'French', value: 'fr' },
                        { label: 'Deutsch', value: 'de' },
                    ]}
                    style={pickerSelectStyles}
                    value={userData.planguage}
                />
                    </View>
                <View style={styles.pickerContainer}>
                    <Text style={styles.label}>{t('location')} *</Text>
                <RNPickerSelect
                    onValueChange={(value) => setUserData({ ...userData, plocation: value })}
                    items={[
                        { label: 'Argentina', value: 'ar' },
                        { label: 'Australia', value: 'au' },
                        { label: 'Austria', value: 'at' },
                        { label: 'Belgium', value: 'be' },
                        { label: 'Brazil', value: 'br' },
                        { label: 'Bulgaria', value: 'bg' },
                        { label: 'Canada', value: 'ca' },
                        { label: 'China', value: 'cn' },
                        { label: 'Czech Republic', value: 'cz' },
                        { label: 'Egypt', value: 'eg' },
                        { label: 'France', value: 'fr' },
                        { label: 'Germany', value: 'de' },
                        { label: 'Greece', value: 'gr' },
                        { label: 'India', value: 'in' },
                        { label: 'Indonesia', value: 'id' },
                        { label: 'Ireland', value: 'ie' },
                        { label: 'Italy', value: 'it' },
                        { label: 'Japan', value: 'jp' },
                        { label: 'Korea', value: 'kr' },
                        { label: 'Malaysia', value: 'my' },
                        { label: 'Mexican', value: 'mx' },
                        { label: 'Netherlands', value: 'nl' },
                        { label: 'New Zealand', value: 'nz' },
                        { label: 'Norway', value: 'no' },
                        { label: 'Poland', value: 'pl' },
                        { label: 'Portugal', value: 'pt' },
                        { label: 'Romania', value: 'ro' },
                        { label: 'Russia', value: 'ru' },
                        { label: 'Saudi Arabia', value: 'sa' },
                        { label: 'Slovakia', value: 'sk' },
                        { label: 'South Africa', value: 'za' },
                        { label: 'Sweden', value: 'se' },
                        { label: 'Switzerland', value: 'ch' },
                        { label: 'Taiwan', value: 'tw' },
                        { label: 'Thailand', value: 'th' },
                        { label: 'Türkiye', value: 'tr' },
                        { label: 'UAE', value: 'ae' },
                        { label: 'Ukraine', value: 'ua' },
                        { label: 'United Kingdom', value: 'gb' },
                        { label: 'USA', value: 'us' } ]}
                    style={pickerSelectStyles}
                    value={userData.plocation}
                />
                </View>
                <TouchableOpacity onPress={handleUpdate} style={[styles.button, styles.updateButton]}>
                    <Ionicons name="checkmark-circle-outline" size={20} color="white" />
                    <Text style={styles.buttonText}>{t('update')}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={logout} style={[styles.button, styles.logoutButton]}>
                    <Ionicons name="exit-outline" size={20} color="white" />
                    <Text style={styles.buttonText}>{t('logout')}</Text>
                </TouchableOpacity>

            </View>
                </ScrollView>
            </KeyboardAvoidingView>
        );
    };

    const pickerSelectStyles = StyleSheet.create({
        inputIOS: {
            height: 44,
            marginBottom:12,
            backgroundColor: 'white',
            color: 'black',
        },
        inputAndroid: {
            height: 44,
            marginBottom:12,
            backgroundColor: 'white',
            color: 'black',
        },
    });
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            padding: 20,
            backgroundColor: '#f5f5f5', 
        },
        inputContainer: {
            marginBottom: 15,
        },
        pickerContainer: {
            marginBottom: 15,
        },
        label: {
            marginBottom: 5,
            fontWeight: 'bold',
            color: '#333', 
        },
        fieldContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            marginVertical: 5,
        },
        input: {
            borderWidth: 1,
            borderColor: '#ddd', 
            borderRadius: 5, 
            padding: 10,
            backgroundColor: '#fff', 
        },
        picker: {
            height: 50,
            width: '100%',
            borderRadius: 5,
            marginVertical: 5,
        },
        imageContainer: {
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            marginVertical: 10,
        },
        profileImage: {
            width: 200,
            height: 200,
            borderRadius: 100, 
            backgroundColor: '#ddd', 
        },
        button: {
            flexDirection: 'row', 
            alignItems: 'center', 
            padding: 12, 
            borderRadius: 5,
            textAlign: 'center',
            marginVertical: 10,
            justifyContent: 'center', 
        },
        updateButton: {
            backgroundColor: '#007bff',
        },
        logoutButton: {
            backgroundColor: '#dc3545',
        },
        buttonText: {
            color: '#fff',
            fontWeight: 'bold',
            marginLeft: 5, 
        },
    });
    export default ProfileScreen;
