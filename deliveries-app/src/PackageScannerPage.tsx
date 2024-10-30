import React, { useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { useCameraDevice, useFrameProcessor } from 'react-native-vision-camera'
import IonIcon from 'react-native-vector-icons/Ionicons'
import { Camera } from 'react-native-vision-camera'
import type { Routes } from './Routes'
import type { NativeStackScreenProps } from '@react-navigation/native-stack'
import { useTextRecognition } from 'react-native-vision-camera-text-recognition'
import { PressableOpacity } from 'react-native-pressable-opacity'
import { SAFE_AREA_PADDING } from './Constants'
import { runOnJS } from 'react-native-reanimated'
//import nlp from 'compromise/three'

type Props = NativeStackScreenProps<Routes, 'PackageScannerPage'>
export function PackageScannerPage({ navigation }: Props): React.ReactElement {
  // Use the default back camera
  const device = useCameraDevice('back')
  const options = { language: 'latin' as 'latin' }
  const { scanText } = useTextRecognition(options)
  const [currentText, setCurrentText] = useState('nothing...')

  // Frame processor for text recognition
  const frameProcessor = useFrameProcessor(
    (frame) => {
      'worklet'
      const data = scanText(frame)
      console.log(JSON.stringify(data), 'data')
      if (data && data.length > 0 && data[0]?.resultText) {
        if (data[0]?.resultText) {
          //note: nlp is not working (build fails when trying to use it)
          //let doc = nlp(data[0].resultText)
          //let str = doc.people().normalize().text()
          const text = data[0].resultText
          console.log(text, 'data')
          //console.log(str, 'people')
          runOnJS(() => setCurrentText(text))
        }
      }
    },
    [scanText],
  )

  return (
    <>
      {device && <Camera style={StyleSheet.absoluteFill} device={device} isActive={true} frameProcessor={frameProcessor} />}

      {/* Showing recognized text */}
      <View style={styles.textContainer}>
        <Text style={styles.recognizedText}>{currentText || 'No text recognized'}</Text>
      </View>

      {/* Back Button */}
      <PressableOpacity style={styles.backButton} onPress={navigation.goBack}>
        <IonIcon name="chevron-back" color="white" size={35} />
      </PressableOpacity>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  textContainer: {
    position: 'absolute',
    bottom: 100,
    left: SAFE_AREA_PADDING.paddingLeft,
    right: SAFE_AREA_PADDING.paddingRight,
    alignItems: 'center',
    padding: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // semi-transparent background for better visibility
  },
  recognizedText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
  button: {
    marginBottom: 16, // Adjust this as needed
    padding: 10,
    backgroundColor: 'rgba(140, 140, 140, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  backButton: {
    position: 'absolute',
    left: SAFE_AREA_PADDING.paddingLeft,
    top: SAFE_AREA_PADDING.paddingTop,
  },
})