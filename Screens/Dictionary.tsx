import {StyleSheet, TextInput, SafeAreaView, ActivityIndicator, FlatList} from 'react-native';
import {View, Text} from 'react-native';
import React from 'react';
import wordData from '../public/Chinese2Igbo-obj.json';
import * as Font from 'expo-font';
import filter from 'lodash.filter';

const Dictionary = () => {
    const [isLoading, setIsLoading] = React.useState(false);
    const [data, setData] = React.useState([]);
    const [error, setError] = React.useState(null);
    const [fullData, setFullData] = React.useState([]); 
    const [searchQuery, setSearchQuery] = React.useState('');
    const [fontLoaded, setFontLoaded] = React.useState(false);

    React.useEffect(() => {
        setIsLoading(true);
        setData(wordData);
        setFullData(wordData);
        setIsLoading(false);
    }, []);

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        const formattedQuery = query.toLowerCase();
        const filteredData = filter(fullData, user => {
          return contains(user, formattedQuery);
        });
        setData(filteredData);
    }

    const contains = ({igbo, english, symbol}, query) => {
        if (igbo.includes(query) || english.includes(query) || symbol.includes(query)) {
          return true;
        }
        return false;
      };
      

    // Load the custom font using Expo's Font API
  React.useEffect(() => {
    const loadFont = async () => {
      await Font.loadAsync({
        // The name 'akagu' is arbitrary, you can choose something else
        // The path to the font file should be correct
        
        Akagu: require('../assets/fonts/Akagu.ttf'),
      });
      setFontLoaded(true);
    };
    //console.log("I am reading this code.");
    loadFont();
  }, []);

    if(isLoading) { 
        return (
            <SafeAreaView style={{flex:1, marginHorizontal:20}}>
            <ActivityIndicator size='large' color='#5500dc'/>
            </SafeAreaView>
        );
        }

    return (
        <SafeAreaView style={{flex:1, marginHorizontal:20}}>
        <TextInput placeholder='Search'
        clearButtonMode='always' 
        style={styles.searchBox}
        autoCapitalize='none'
        autoCorrect={false}
        value={searchQuery}
        onChangeText={(query) => handleSearch(query)}
        />

        <FlatList
        data={data} 
        keyExtractor={item => item.id}  
        renderItem={({item}) => (
            <View style={styles.itemContainer}>
                <View style={styles.symbolContainer}>
                    <Text style={{fontFamily: "Akagu", fontSize: 18}}>{item.symbol}</Text>
                </View>
                        <View style={styles.itemDetails}>
                        <Text style={styles.igbo}>{item.igbo}</Text>
                        <Text style={styles.english}>{item.english}</Text>
                        </View>
            </View>
        )}
        />

        </SafeAreaView>
    );
    }

    export default Dictionary;

    const styles = StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: '#fff',
          alignItems: 'center',
          justifyContent: 'center',
        },

        searchBox: {
            backgroundColor: '#fff',
            paddingHorizontal: 20,
            paddingVertical: 10,
            borderRadius: 8,
            shadowColor: '#000',
            shadowOffset: {width: 0, height: 10},
            shadowOpacity: 0.2,
            shadowRadius: 20,
            elevation: 5,
            marginTop: 30,
        },
        itemContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            padding: 20,
            borderBottomWidth: 1,
            borderBottomColor: '#eee',
        },
        symbolContainer: {
            height: 50,
            width: 50,
            backgroundColor: '#eee',
            borderRadius: 25,
            alignItems: 'center',
            justifyContent: 'center',
        },
        symbol: {
            fontSize: 18,
            fontWeight: 'bold',
            fontFamily: 'Akagu',
        },
        itemDetails: {
            marginLeft: 10,
            flex: 1,
        },
        igbo: {
            fontWeight: 'bold',
            fontSize: 16,
        },
        english: {
            opacity: 0.7,
        },

      });