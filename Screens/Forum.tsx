import {View, Text, StyleSheet} from 'react-native';
import React from 'react';

const Forum = () => {
    return (
        <View style={styles.container}>
        <Text>Forum Screen</Text>
        </View>
    );
    }

    export default Forum;

    const styles = StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: '#fff',
          alignItems: 'center',
          justifyContent: 'center',
        },
      });