import react, { useState } from "react";
import { View, Text, StyleSheet, FlatList} from "react-native";
import SearchBar from "../components/SearchBar";
import Article from "../components/Article";
import axios from "axios";


const SearchScreen = () => {
    const [searchText, setSearchText] = useState<string | undefined>();
    const [error, setError] = useState<Error | null>(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [articles, setArticles] = useState<any[]>([]);

    const searchArticles= () => {
        if (!searchText) {
            // Eğer kullanıcı bir şey girmediyse, API çağrısı yapmadan çık
            return;
        }

        axios.get('https://newsapi.org/v2/top-headlines?country=us&apiKey=e155fffdb31f4f6d9bc1015cf1b7db71', 
        {
            params: {
                category: "general",
                q: searchText
            }
        })
        .then((response) => {
            // handle success
            console.log(response.data.articles);
            setIsLoaded(true);
            setArticles(response.data.articles);
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
    return(
        <View style= {styles.container}>
            <SearchBar searchText={searchText} setSearchText={setSearchText} onSubmit={searchArticles}/>
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
    )
}

export default SearchScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#ffffff"
    }
})