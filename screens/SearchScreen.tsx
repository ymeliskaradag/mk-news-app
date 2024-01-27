import react, { useState } from "react";
import RNPickerSelect from 'react-native-picker-select';
import SearchBar from "../components/SearchBar";
import Article from "../components/Article";
import { Picker } from '@react-native-picker/picker';
import { View, Text, StyleSheet, FlatList, Button, TouchableOpacity, Modal, TouchableWithoutFeedback } from "react-native";
import axios from "axios";
import React from "react";
import {useTranslation} from "react-i18next";


const SearchScreen = () => {
    const [searchText, setSearchText] = useState<string | undefined>();
    const [selectedCountry, setSelectedCountry] = useState<string>('us');
    const [error, setError] = useState<Error | null>(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [articles, setArticles] = useState<any[]>([]);
    const [page, setPage] = useState(1);
    const [modalVisible, setModalVisible] = useState(false);
    const { t, i18n } = useTranslation();
    const [selectedCategory, setSelectedCategory] = useState<string>('general');

    const searchArticles = () => {
        axios.get(`https:.org/v2/top-headlines`, {
            params: {
                country: selectedCountry,
                category: selectedCategory,
                q: searchText,
                apiKey: '2b4971a2df0a43bb8c73060a9eded34e'//'e155fffdb31f4f6d9bc1015cf1b7db71'
            }
        })
        .then((response) => {
            setArticles(response.data.articles);
            setPage(page + 1);
            setIsLoaded(true);
        })
        .catch(function (error) {

            console.log(error);
            setIsLoaded(true);
            setError(error);
        })
        .finally(function () {

        });
    }

    return (
        <View style={styles.container}>
            <View style={styles.controlsContainer}>
                <Text>{t('category')}:</Text>
                <RNPickerSelect
                    onValueChange={(value) => {
                        setSelectedCategory(value);
                        searchArticles();
                    }}
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
                <Text>{t('location')}:</Text>
                <RNPickerSelect
                    onValueChange={(value) => {
                        setSelectedCountry(value);
                        searchArticles();
                    }}
                    placeholder={{ label: t('selectcountry'), value: null }}
                    style={pickerSelectStyles}
                    value={selectedCountry}
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
            <SearchBar
                searchText={searchText}
                setSearchText={setSearchText}
                onSubmit={searchArticles}
            />
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
      </View>
    );
}


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
const styles= StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#ffffff"
    },
    controlsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        margin: 10,
    },
    pickerContainer: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 4,
        padding: 10,
        marginVertical: 10,
    },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
});


export default SearchScreen;