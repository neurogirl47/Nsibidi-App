import {View, Text, StyleSheet} from 'react-native';
import React, { useState } from 'react';
import { Button, SafeAreaView, TouchableOpacity } from "react-native";
import { Ionicons, AntDesign } from "@expo/vector-icons";

const Login = ({ promptAsync }) => {
    return (
        <SafeAreaView style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <Ionicons name="logo-firebase" size={100} color="#FFA611" />
        <Text style={{ fontSize: 32, fontWeight: "bold" }}>Sign In with {" "}
          <Text style={{ color: "#4285F4"}}>G</Text>
          <Text style={{ color: "#EA4336"}}>o</Text>
          <Text style={{ color: "#FBBC04"}}>o</Text> 
          <Text style={{ color: "#4285F4"}}>g</Text>
          <Text style={{ color: "#34A853"}}>l</Text>
          <Text style={{ color: "#EA4336"}}>e</Text></Text>
          <TouchableOpacity style={{
            backgroundColor: "#4285F4",
            width: "90%",
            padding: 10,
            borderRadius: 15,
            flexDirection: "row",
            alignItems: "center",
            gap: 15,
            marginTop: 80,
            marginBottom: 150,
          }}
          onPress={() => promptAsync()}>
            <AntDesign name='google' size={30} color="white" />
            <Text style={{ fontWeight: "bold", color: "white", fontSize: 17 }}>
              Sign In with Google
            </Text>
          </TouchableOpacity>
        </SafeAreaView>
        
    );
    }

    export default Login;

    const styles = StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: '#fff',
          alignItems: 'center',
          justifyContent: 'center',
        },
      });