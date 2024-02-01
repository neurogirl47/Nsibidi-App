import React, {useState, useEffect, useRef} from 'react';
import { View, Text, StyleSheet, Button, PanResponder } from 'react-native';
import { Svg, Path } from 'react-native-svg';
import characters from '../public/Chinese2Igbo.json';
import * as Font from 'expo-font';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

export default function Game() {
  type Point = { x: number; y: number };
  type Trace = Point[];
  type UserTracing = Trace[];

  
  const [score, setScore] = useState(0);
  const [fontLoaded, setFontLoaded] = useState(false);
  const [currentCharacter, setCurrentCharacter] = useState<string | null>(null);
  const [definition, setDefinition] = useState<string | null>(null); // Set this based on the character
  const [translation, setTranslation] = useState<string | null>(null); // Set this based on the character
  const [userTracing, setUserTracing] = useState<UserTracing>([]);
  const [characterStyles, setCharacterStyles] = useState({fontFamily: 'Akagu', // The name of the custom font
  position: 'absolute',
  fontSize: 300,
  width: '80%',
  height: '60%',
  justifyContent: 'center',
  textAlign: 'center',
  color: 'grey',
  opacity: 1,});
  const [characterState, setCharacterState] = useState(0);
  const [textState, setTextState] = useState("Trace Over The Nsibidi Character");
  const [submitButtonText, setSubmitButtonText] = useState("Submit");
  const [clearButtonText, setClearButtonText] = useState("Clear");
  const [clearState, setClearState] = useState(false); //0 = clear, 1 = submit
  const [images, setImages] = useState<{ character: string | null, tracing: UserTracing }[]>([]); // declare images state variable
  const svgRef = useRef<Svg>(null);

  // Load the custom font using Expo's Font API
  useEffect(() => {
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

  // Once the font is loaded, set a random character
  useEffect(() => {
    if (fontLoaded) {
      let randomCharacter = getRandomCharacter();
      setCurrentCharacter(randomCharacter[1]);
      setDefinition(randomCharacter[0]);
      setTranslation(randomCharacter[2]);
    }
  }, [fontLoaded]);

  const panResponder = useRef(
    PanResponder.create({
    // Handle touch start, move, and end events
    onStartShouldSetPanResponder: () => true,
    onPanResponderGrant: (evt, gestureState) => {
      // The user has started a touch, add a new trace
      setUserTracing((oldTracing) => [...oldTracing, []]);
    },
    onPanResponderMove: (evt, gestureState) => {
      // The user is moving their finger, add the new position to the trace
      setUserTracing((oldTracing) => {
        const newTracing = [...oldTracing];
        const currentTraceIndex = newTracing.length - 1;
        newTracing[currentTraceIndex].push({
          x: gestureState.moveX,
          y: gestureState.moveY,
        });
        return newTracing;
      });
    },
    onPanResponderRelease: (evt, gestureState) => {
      // The user has ended a touch
      // In this simple example, we don't do anything special here
    },
  })
  ).current;

  const submit = () => {
    // Compare userTracing with the image of currentCharacter
    // This would likely involve image processing techniques and could be quite complex
    // If the accuracy is 80% or more, increase the score and show a success message
    // If the accuracy is less than 80%, show a failure message

    //add the image that was traced to the array of images
    const newImage = {character: currentCharacter, tracing: userTracing};
    const newImages = [...images, newImage];
    setImages(newImages);

    //save the image locallys
    const saveImage = async (newImage: any) => {
      try {

        //If image is not rendered, return
        if (!newImage) return;

        //const trimmedTrace = JSON.stringify(newImage.tracing).slice(1,-1);
        // Call the function to convert newImage.tracing to a path command string.
        const pathD = tracingToPathD(newImage.tracing);
        //console.log("This is pathD " + pathD);

        // Use pathD when creating the SVG string.
        const svgString = `<?xml version="1.0" standalone="no"?>
        <!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd" >
        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" viewBox="-10 0 1010 1000"><path fill="currentColor" d="${pathD}"></path></svg>`;

    try{
        // Define the path and name of the file to be saved
        const filename = `${FileSystem.documentDirectory}${newImage.character}.svg`;
        //console.log("The file's name is", filename);

  // Write the SVG XML to the file
  await FileSystem.writeAsStringAsync(filename, svgString, {
    encoding: FileSystem.EncodingType.UTF8,
  });
  
  //console.log('File is saved at ' + filename);


  

  if(!(await Sharing.isAvailableAsync())) {
    alert("Uh oh, sharing isn't avaialble on your platform");
    return;
  }

  await Sharing.shareAsync(filename);
      } catch (error) {
        console.error('Error: ' + error);
      }
    
  } catch (error) {
    console.error('Error processing SVG or saving file: ' + error);
  }
};
      

  //saveImage(newImage);

  //the first button click
    if(characterState == 0){
    setCharacterState(1);
    setClearState(false);
    setTextState("Freehand Draw The Nsibidi Character");
    let newCharacterStyles = {fontFamily: 'Akagu', // The name of the custom font
    position: 'absolute',
    fontSize: 100,
    width: '80%',
    height: '60%',
    justifyContent: 'center',
    textAlign: 'left',
    color: 'black',
    opacity: 1,};
    setCharacterStyles(newCharacterStyles);

    //clear tracing
    setUserTracing([]);
    }

    //the second button click
    else if(characterState == 1){
      setCharacterState(2);
      setClearState(false);
      setTextState("Draw The Nsibidi Character From Memory");
      let newCharacterStyles = {fontFamily: 'Akagu', // The name of the custom font
      position: 'absolute',
      fontSize: 100,
      width: '80%',
      height: '60%',
      justifyContent: 'center',
      textAlign: 'center',
      color: 'black',
      opacity: 0,};
      setCharacterStyles(newCharacterStyles);

      //clear tracing
      setUserTracing([]);
    }

    //the third button click
    else if(characterState == 2){
      setCharacterState(3);
      setClearState(false);
      setTextState("Did You Get It Right?");
      setSubmitButtonText("Yes");
      setClearButtonText("No");
      let newCharacterStyles = {fontFamily: 'Akagu', // The name of the custom font
      position: 'absolute',
      fontSize: 100,
      width: '80%',
      height: '60%',
      justifyContent: 'center',
      textAlign: 'left',
      color: 'black',
      opacity: 1,};
      setCharacterStyles(newCharacterStyles);

    }

    //the fourth button click if the user got it wrong
    else if(characterState == 3 && clearState == true){
    setCharacterState(0);
    setClearState(false);
    setTextState("Trace Over The Nsibidi Character");
    setSubmitButtonText("Submit");
    setClearButtonText("Clear");
    let newCharacterStyles = {fontFamily: 'Akagu', // The name of the custom font
    position: 'absolute',
    fontSize: 300,
    width: '80%',
    height: '60%',
    justifyContent: 'center',
    textAlign: 'center',
    color: 'grey',
    opacity: 1,};
    setCharacterStyles(newCharacterStyles);

    //clear tracing
    setUserTracing([]);
    }

    //the fourth button click
    else if (characterState == 3){
      setScore(score + 1);
      setCharacterState(0);
      setClearState(false);
      setSubmitButtonText("Submit");
      setClearButtonText("Clear");
    //get a new character
      let randomCharacter = getRandomCharacter();
      setCurrentCharacter(randomCharacter[1]);
      setDefinition(randomCharacter[0]);
      setTranslation(randomCharacter[2]);

      //clear tracing
      setUserTracing([]);

      //reset text
      setTextState("Trace Over The Nsibidi Character");
      setCharacterStyles({fontFamily: 'Akagu', // The name of the custom font
      position: 'absolute',
      fontSize: 300,
      width: '80%',
      height: '60%',
      justifyContent: 'center',
      textAlign: 'center',
      color: 'grey',
      opacity: 1,});
    }
  };

  const clearTracing = () => {
    setUserTracing([]);
    setClearState(true);
  };

  // Render the current character using the custom font
  if (fontLoaded && currentCharacter && definition && translation) {
    return (
      <View style={styles.container}>
      <Text style={styles.score}>Score: {score}</Text>
      <Text style={styles.heading}>{textState}</Text>
      <View style={styles.topHalf}></View>
      <View style={styles.tracingContainer}></View>
      <Text style={characterStyles}>{currentCharacter}</Text>
      <Svg style={styles.tracingArea} fill="none" {...panResponder.panHandlers}>
        {userTracing.map((trace, index) => (
          <Path
            key={index}
            d={traceToSvgPath(trace)}
            fill="none"
            stroke="blue"
            strokeWidth="10"
          />
        ))}
      </Svg>
      
      <View style={styles.bottomHalf}>
      <Text style={styles.definition}>Igbo: {definition}</Text>
      <Text style={styles.definition}>English: {translation} </Text>
      <View style={styles.buttonContainer}>
      <View style={styles.button}>
        <Button title={clearButtonText} onPress={clearTracing} />
      </View>  
      <View style={styles.button}>
        <Button title={submitButtonText} onPress={submit} color="green"/>
      </View>
      </View>
      </View>
    </View>
  );
} else {
  return <View />;
}
} 

const traceToSvgPath = (trace: any) => {
  if (trace.length === 0) return '';
  
  // Move to the first point
  let path = `M ${trace[0].x} ${trace[0].y}`;
  
  // Draw a line to each subsequent point
  for (let i = 1; i < trace.length; i++) {
    path += ` L ${trace[i].x} ${trace[i].y}`;
  }

  //console.log a byte array of the path data
  //console.log(path.split('').map((char) => char.charCodeAt(0)));
  
  return path;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  score: {
    fontSize: 24,
    margin: 20,
    alignSelf: 'center',
  },
  heading: {
    fontSize: 30,
    fontWeight: 'bold',
    margin: 20,
    textAlign: 'center',
    color: 'blue',
  },
  tracingArea: {
    flex: 1,
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  definition: {
    fontSize: 20,
    margin: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
  },
  button: {
    width: '40%',
  },
  character: {
    fontFamily: 'Akagu', // The name of the custom font
    position: 'absolute',
    fontSize: 300,
    width: '80%',
    height: '60%',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'grey',
  },
  tracingContainer: {
    position: 'relative',
    width: '80%',
    height: '30%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  topHalf: {
    flex: 0.5,
    alignItems: 'center',
    width: '100%',
  },
  bottomHalf: {
    flex: 0.5,
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
    zIndex: 1,
  },
});


const getRandomCharacter = () => {
  const randomIndex = Math.floor(Math.random() * characters.length);
  return characters[randomIndex];
};

function tracingToPathD(tracing: any): string {
    // Initialize an array to hold the path commands.
    let pathCommands: string[] = [];
    
    // Iterate over each trace in the tracing.
    tracing.forEach((trace: string | any[]) => {
        // If trace has points, process it.
        if(trace.length > 0) {
            // Start a new path with the 'M' command using the first point of the trace.
            pathCommands.push(`M ${trace[0].x} ${trace[0].y}`);
            
            // Continue the path with 'L' commands for the rest of the points in the trace.
            for(let i = 1; i < trace.length; i++) {
                pathCommands.push(`L ${trace[i].x} ${trace[i].y}`);
            }
        }
    });
    
    // Join the path commands into a single string and return it.
    return pathCommands.join(' ');
}



/*function formatSvg(svgString: string, callback: (formattedSvgString: string) => void): void {
  parseString(svgString, (err: any, result: any) => {
      if (err) {
          throw new Error('Error parsing SVG string.');
      }

      try {
          const pathElement = result.svg.path[0];
          if (!pathElement) throw new Error('No path element found in the provided SVG string.');

          const dAttributeJsonString = pathElement.$.d;
          if (!dAttributeJsonString) throw new Error('No "d" attribute found in the path element.');

          console.log("dAttributedJsonString is", dAttributeJsonString);
          const pointsArray = JSON.parse(dAttributeJsonString.replace(/'/g, '"')) as Array<Array<{x: number, y: number}>>;
          const dAttributeString = pointsArray.map(subArray => {
              if (subArray.length === 0) return '';
              const moveTo = `M${subArray[0].x} ${subArray[0].y}`;
              const lineToCommands = subArray.slice(1).map(point => `L${point.x} ${point.y}`).join(' ');
              return moveTo + ' ' + lineToCommands;
          }).join(' ');

          pathElement.$.d = dAttributeString;
          callback(result);
      } catch (e) {
          throw new Error('Error parsing the "d" attribute JSON string.');
      }
  });
}*/