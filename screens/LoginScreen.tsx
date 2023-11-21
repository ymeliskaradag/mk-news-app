//import React, { useState } from "react";
//import { View, Text, TextInput, Button, StyleSheet } from "react-native";

/* const LoginScreen = ({ setIsLoggedIn }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistered, setIsRegistered] = useState(false);

  const handleLogin = () => {
    // Burada e-posta ve şifre ile gerçek bir oturum açma işlemi yapabilirsiniz.
    // Örnek olarak, her iki alanın doldurulduğunu kontrol edelim ve kayıt yapmadığımızı varsayalım.
    if (email && password) {
      setIsLoggedIn(true);
    }
  };

  const handleRegister = () => {
    // Burada kayıt işlemi yapabilirsiniz.
    // Örnek olarak, e-posta ve şifre alanlarını kullanarak bir kullanıcı oluşturalım.
    if (email && password) {
      setIsRegistered(true);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {isRegistered ? "Kayıt Oldunuz!" : "Giriş Yapın"}
      </Text>
      <TextInput
        style={styles.input}
        placeholder="E-posta"
        value={email}
        onChangeText={(text) => setEmail(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Şifre"
        secureTextEntry={true}
        value={password}
        onChangeText={(text) => setPassword(text)}
      />
      <Button
        title={isRegistered ? "Giriş Yap" : "Kayıt Ol"}
        onPress={isRegistered ? handleLogin : handleRegister}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 10,
  },
});

export default LoginScreen; */


