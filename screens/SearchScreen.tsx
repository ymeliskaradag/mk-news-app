import react, { useState } from "react";
import { View, Text, StyleSheet, FlatList, Button, TouchableOpacity, Modal, TouchableWithoutFeedback} from "react-native";
import RNPickerSelect from 'react-native-picker-select';
import SearchBar from "../components/SearchBar";
import Article from "../components/Article";
import axios from "axios";


const SearchScreen = () => {
    const [searchText, setSearchText] = useState<string | undefined>();
    const [selectedCountry, setSelectedCountry] = useState<string>('us');
    const [error, setError] = useState<Error | null>(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [articles, setArticles] = useState<any[]>([]);
    const [page, setPage] = useState(1); // Başlangıç sayfa numarası
    const pageSize = 20; // Sayfa başına öğe sayısı
    const [modalVisible, setModalVisible] = useState(false);

    const searchArticles= () => {
        if (!searchText) {
            // Eğer kullanıcı bir şey girmediyse, API çağrısı yapmadan çık
            return;
        }

        axios.get(`https://newsapi.org/v2/top-headlines?country=${selectedCountry}&apiKey=e155fffdb31f4f6d9bc1015cf1b7db71`,
        {
            params: {
                category: "general",
                q: searchText,
                page: page,
                pageSize: pageSize
            }
        })
        .then((response) => {
            // handle success
            console.log(response.data.articles);
            setIsLoaded(true);
            setArticles(response.data.articles);
            setPage(page + 1); // Bir sonraki sayfaya geç
        })
        .catch(function (error) {
            // handle error
            console.log(error);
            setIsLoaded(true);
            setError(error);
        })
        .finally(function () {
            // always executed
        });
    }

      const handleChange = (value) => {
        console.log('Selected Country:', value);
        setSelectedCountry(value);
        setModalVisible(false);
      };
    return (
    <View style={styles.container}>
      <View style={styles.controlsContainer}>
        <Text>Select Country:</Text>
        <TouchableWithoutFeedback onPress={() => setModalVisible(true)}>
          <View style={styles.pickerContainer}>
            <Text>{selectedCountry}</Text>
          </View>
        </TouchableWithoutFeedback>

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}
        >
          <TouchableWithoutFeedback onPress={() => setModalVisible(!modalVisible)}>
            <View style={styles.modalOverlay} />
          </TouchableWithoutFeedback>

          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <RNPickerSelect
                selectedValue={selectedCountry}
                style={{
                  inputIOS: {
                    fontSize: 16,
                    paddingVertical: 12,
                    paddingHorizontal: 10,
                    borderWidth: 1,
                    borderColor: 'gray',
                    borderRadius: 4,
                    color: 'black',
                    paddingRight: 30,
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
                  },
                  iconContainer: {
                    top: 20,
                    right: 15,
                  },
                }}
                onValueChange={(value) => handleChange(value)}
                items={[
                  { label: 'A.B.D.', value: 'us' },
                  { label: 'Kanada', value: 'ca' },
                  { label: 'BAE', value: 'ae' },
                  { label: 'Arjantin', value: 'ar' },
                  { label: 'Çin', value: 'cn' },
                  { label: 'Almanya', value: 'de' },
                  { label: 'Fransa', value: 'fr' },
                  { label: 'İngiltere', value: 'gb' }
                ]}
                useNativeAndroidPickerStyle={false}
                Icon={() => {
                  return (
                    <View
                      style={{
                        backgroundColor: 'transparent',
                        borderTopWidth: 10,
                        borderTopColor: 'gray',
                        borderRightWidth: 10,
                        borderRightColor: 'transparent',
                        borderLeftWidth: 10,
                        borderLeftColor: 'transparent',
                        width: 0,
                        height: 0,
                      }}
                    />
                  );
                }}
              />
            </View>
          </View>
        </Modal>

      </View>
          <SearchBar searchText={searchText} setSearchText={setSearchText} onSubmit={searchArticles} />
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff"
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: 10,
  },
  pickerContainer: {
    borderWidth: 1,
    padding: 10,
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Arka planın şeffaflığı
  },
});

export default SearchScreen;