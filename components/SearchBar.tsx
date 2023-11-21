import React from "react";
import { View, Text, TextInput, StyleSheet, NativeSyntheticEvent, TextInputSubmitEditingEventData } from "react-native";

/* type MyComponentProps = {
    searchText: string | undefined,
    onSubmit: void,


}; */

const SearchBar = (props: { searchText: string | undefined; setSearchText: (arg0: string) => void; onSubmit: () => void }) => {
    return(
        <View style= {styles.container}>
            <TextInput
                placeholder="Search"
                style= {styles.input}
                value={props.searchText}
                onChangeText={(text)=> props.setSearchText(text)}
                onSubmitEditing={props.onSubmit}
            />
        </View>
    )
}

export default SearchBar;

const styles = StyleSheet.create({
    container: {
        margin: 10
    },
    input: {
        backgroundColor: "lightgray",
        padding: 10,
        borderRadius: 15,
        color: "#000000",
        borderWidth: 1
    }
});