import moment from "moment";
import React, { ReactNode } from "react";
import { View, StyleSheet, Text, Image, Pressable} from "react-native";
import * as WebBrowser from 'expo-web-browser';

type MyComponentProps = {
    source: {
      name: string;
    };
    urlToImage: string | undefined;
    title: ReactNode;
    description: ReactNode;
    author: ReactNode;
    publishedAt: Date;
    url: string;
};  

const Article: React.FC<MyComponentProps> = (props) => {

    const goToSource = () => {
        WebBrowser.openBrowserAsync(props.url);
    }
    
    return(
        <Pressable style={styles.container } onPress={goToSource}> 
        {/*image */}
        <Image
           source={props.urlToImage ? { uri: props.urlToImage } : require('../assets/no-image.png')}
           style={styles.image}
        />

           <View style={{padding: 20}}>

        {/*title */}
            <Text style={styles.title}> {props.title} </Text>
        {/*description */}
            <Text style={styles.description} numberOfLines={3}> {props.description} </Text>
            <View style={styles.data}>
                <Text style={styles.heading}>by: {props.author ? <Text style={styles.author}>{props.author}</Text> : '-'} </Text>
                <Text style={styles.date}> {moment(props.publishedAt).format("MMM Do YY")} </Text>
            </View>
        {/*source */}
            <View style={{marginTop: 10}}>
                <Text>source: <Text style={styles.source}> {props.source.name} </Text></Text>
            </View>
            </View>
        </Pressable>
    )
}

export default Article;

const styles = StyleSheet.create({
    container:{
        width: "90%",
        alignSelf: "center",
        borderRadius: 40,
        shadowOpacity: 0.5,
        shadowColor: "#000000",
        shadowOffset: {
            height: 5,
            width: 5
        },
        backgroundColor: "#ffffff",
        marginTop: 20,
        elevation: 5
    },
    image:{
        height: 200,
        width: "100%",
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40
    },
    title:{
        fontSize: 18,
        fontWeight: "600",
        marginTop: 10
    },
    description:{
        fontSize: 16,
        fontWeight: "400",
        marginTop: 10
    },
    data:{
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 10
    },
    heading:{

    },
    author:{
        fontWeight:"bold",
        fontSize: 15
    },
    date:{
        fontWeight: "bold",
        color: "#e63946",
        fontSize: 15
    },
    source:{
        color: "#e63946",
        fontWeight: "bold",
        fontSize: 18
    }
})