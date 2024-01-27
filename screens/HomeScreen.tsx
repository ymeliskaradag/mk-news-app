import React, { useEffect, useState } from "react";
import {View, StyleSheet, Text, SafeAreaView, FlatList, Alert} from "react-native";
import Article from "../components/Article";
import axios from "axios";
import RNPickerSelect from "react-native-picker-select";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {useTranslation} from "react-i18next";
import { useNavigation } from '@react-navigation/native';

const HomeScreen: React.FC = () => {
    const [error, setError] = useState<Error | null>(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [articles, setArticles] = useState<any[]>([]);
    const [selectedCountry, setSelectedCountry] = useState<string | undefined>();
    const { t, i18n } = useTranslation();
    const navigation = useNavigation();
    const [selectedCategory, setSelectedCategory] = useState<string>('general');
    const getNews = () => {
        // Use selectedCategory in the API call
        axios.get(`https://newsapi.org/v2/top-headlines`, {
            params: {
                country: selectedCountry,
                category: selectedCategory,
                apiKey: '2b4971a2df0a43bb8c73060a9eded34e'
            }
        })
            .then((response) => {
                setArticles(response.data.articles);
                setIsLoaded(true);
            })
            .catch((error) => {
                console.log(error);
                setIsLoaded(true);
                setError(error);
            });
    };
    useEffect(() => {
        fetchInitialCountry();
    }, []);

    useEffect(() => {
        if (selectedCountry && selectedCategory) {
            getNews();
        }
    }, [selectedCountry, selectedCategory]);


    const fetchInitialCountry = async () => {
        try {
            const username = await AsyncStorage.getItem('@username');
            if (username) {
                const response = await axios.get('http://10.0.2.2:3000/location', { params: { username } });
                if (response.data && response.data.plocation) {
                    setSelectedCountry(response.data.plocation);
                } else {
                    setSelectedCountry('en');
                    Alert.alert(t('warn'), t('updaterequired'));
                }
            } else {
                console.error('No username found in AsyncStorage');
            }
        } catch (error) {
            console.error('Failed to fetch initial country:', error);
        }
    };


    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.pickerRow}>
                <Text style={[styles.label]}>{t('category')}:</Text>
                <RNPickerSelect
                    onValueChange={(value) => setSelectedCategory(value)}
                    style={pickerSelectStyles}
                    value={selectedCategory}
                    placeholder={{ label: t('selectcategory'), value: null }}
                    items={[
                        { label: t('general'), value: 'general' },
                        { label: t('business'), value: 'business' },
                        { label: t('entertainment'), value: 'entertainment' },
                        { label: t('health'), value: 'health' },
                        { label: t('science'), value: 'science' },
                        { label: t('sports'), value: 'sports' },
                        { label: t('technology'), value: 'technology' },
                    ]}
                    useNativeAndroidPickerStyle={false}
                />
                <Text style={[styles.label]}>{t('location')}:</Text>
                <RNPickerSelect
                    onValueChange={(value) => setSelectedCountry(value)}
                    style={pickerSelectStyles}
                    value={selectedCountry}
                    placeholder={{ label: t('selectcountry'), value: null }}
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
                    useNativeAndroidPickerStyle={false}
                />
            </View>

            {error && <Text style={styles.errorText}>Error: {t('newserror')}</Text>}
            {!isLoaded && <Text style={styles.loadingText}>{t('loading')}</Text>}

            {isLoaded && !error && (
                <FlatList
                    data={articles}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => (
                        <Article
                            source={item.source}
                            urlToImage={item.urlToImage}
                            title={item.title}
                            description={item.description}
                            author={item.author}
                            publishedAt={item.publishedAt}
                            url={item.url}
                        />
                    )}
                />
            )}
        </SafeAreaView>
    );
}

export default HomeScreen;

const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        height: 44,
        backgroundColor: 'white',
        color: 'black',
    },
    inputAndroid: {
        height: 44,
        backgroundColor: 'white',
        color: 'black',
        borderColor:'gray',
        borderWidth:1,
        paddingHorizontal:10,
        borderRadius:10
    },
});
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#ffffff"
    },
    errorText: {
        color: 'red',
        textAlign: 'center',
        marginVertical: 10,
    },
    loadingText: {
        textAlign: 'center',
        marginVertical: 10,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginTop: 20,
        marginBottom: 10,
        textAlign: 'center',
    },
    pickerContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
    },
    pickerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
    },
    label: {
        marginHorizontal: 5,
        fontWeight: 'bold',
    },
    inputIOS: {
        fontSize: 16,
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 4,
        color: 'black',
        paddingRight: 30,
        backgroundColor: 'white',
        marginBottom: 15,
    },
    inputAndroid: {
        fontSize: 16,
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderWidth: 0.5,
        borderColor: 'purple',
        borderRadius: 8,
        color: 'black',
        paddingRight: 30,
        backgroundColor: 'white',
        marginBottom: 15,
    },
}) 