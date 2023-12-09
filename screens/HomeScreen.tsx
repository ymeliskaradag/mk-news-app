import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text, SafeAreaView, FlatList } from "react-native";
import Article from "../components/Article";
import axios from "axios";

const HomeScreen: React.FC = () => {
    const [error, setError] = useState<Error | null>(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [articles, setArticles] = useState<any[]>([]);
    
    const getNews = () => {
        axios.get('https://newsapi.org/v2/top-headlines?apiKey=e155fffdb31f4f6d9bc1015cf1b7db71',
        {
            params: {
                category: "general"
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
    
    useEffect(() => {
        getNews();

    }, []); 
    
    if (error) {
        return <Text>Error: {error.message}</Text>;
      } else if (!isLoaded) {
        return <Text>Loading...</Text>;
      } else {
        return(
            <SafeAreaView style={styles.container }> 
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
    
            </SafeAreaView>
        )
    }
    
}

export default HomeScreen;

const styles = StyleSheet.create({
    container: {

    }
}) 