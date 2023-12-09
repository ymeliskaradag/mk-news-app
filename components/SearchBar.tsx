import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, NativeSyntheticEvent, TextInputSubmitEditingEventData } from "react-native";
import { debounce } from "lodash";

/* type MyComponentProps = {
    searchText: string | undefined,
    onSubmit: void,


}; */

const SearchBar = (props: { searchText: string | undefined; setSearchText: (arg0: string) => void; onSubmit: () => void }) => {

      const [inputValue, setInputValue] = useState<string | undefined>();

      // debounce kullanarak yazma işlemi için gecikme ekleyin
      const debouncedSearch = debounce((text: string) => {
        props.setSearchText(text);
        props.onSubmit();
      }, 300); // 300 milisaniye gecikme süresi

      const handleTextChange = (text: string) => {
        setInputValue(text);
        debouncedSearch(text); // debounce edilmiş fonksiyonu çağırın
      };

    return(
        <View style= {styles.container}>
            <TextInput
                placeholder="Search"
                style= {styles.input}
                value={inputValue}
                onChangeText={handleTextChange}
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