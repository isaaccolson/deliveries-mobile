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

// import * as React from 'react'
// import { StyleSheet } from 'react-native'
// import { useCameraDevice, useFrameProcessor } from 'react-native-vision-camera'
// import IonIcon from 'react-native-vector-icons/Ionicons'
// import { Camera } from 'react-native-vision-camera'
// import type { Routes } from './Routes'
// import type { NativeStackScreenProps } from '@react-navigation/native-stack'
// import { useTextRecognition } from 'react-native-vision-camera-text-recognition'
// import { PressableOpacity } from 'react-native-pressable-opacity'
// import { SAFE_AREA_PADDING } from './Constants'

// type Props = NativeStackScreenProps<Routes, 'CodeScannerPage'>
// export function CodeScannerPage({ navigation }: Props): React.ReactElement {
//   // 1. Use a simple default back camera
//   const device = useCameraDevice('back');
//   const options = { language: 'latin' as 'latin' }
//   const {scanText} = useTextRecognition(options)
//   const frameProcessor = useFrameProcessor((frame) => {
//     'worklet'
//     const data = scanText(frame)
//     console.log(data, 'data')
//   }, [])
//   return (
//     <>
//       {!!device && (
//         <Camera
//           style={StyleSheet.absoluteFill}
//           device={device}
//           isActive={true}
//           frameProcessorFps={1}
//           frameProcessor={frameProcessor}
//         />
//       )}

//       <PressableOpacity style={styles.backButton} onPress={navigation.goBack}>
//         <IonIcon name="chevron-back" color="white" size={35} />
//       </PressableOpacity>
//     </>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: 'black',
//   },
//   button: {
//   backButton: {
//     position: 'absolute',
//     left: SAFE_AREA_PADDING.paddingLeft,
//     top: SAFE_AREA_PADDING.paddingTop,
//   },
// })

// import * as React from 'react'
// import { useCallback, useRef, useState } from 'react'
// import type { AlertButton } from 'react-native'
// import { Alert, Linking, StyleSheet, View } from 'react-native'
// import type { Code } from 'react-native-vision-camera'
// import { useCameraDevice, useCodeScanner } from 'react-native-vision-camera'
// import { Camera } from 'react-native-vision-camera'
// import { CONTENT_SPACING, CONTROL_BUTTON_SIZE, SAFE_AREA_PADDING } from './Constants'
// import { useIsForeground } from './hooks/useIsForeground'
// import { StatusBarBlurBackground } from './views/StatusBarBlurBackground'
// import { PressableOpacity } from 'react-native-pressable-opacity'
// import IonIcon from 'react-native-vector-icons/Ionicons'
// import type { Routes } from './Routes'
// import type { NativeStackScreenProps } from '@react-navigation/native-stack'
// import { useIsFocused } from '@react-navigation/core'

// const showCodeAlert = (value: string, onDismissed: () => void): void => {
//   const buttons: AlertButton[] = [
//     {
//       text: 'Close',
//       style: 'cancel',
//       onPress: onDismissed,
//     },
//   ]
//   if (value.startsWith('http')) {
//     buttons.push({
//       text: 'Open URL',
//       onPress: () => {
//         Linking.openURL(value)
//         onDismissed()
//       },
//     })
//   }
//   Alert.alert('Scanned Code', value, buttons)
// }

// type Props = NativeStackScreenProps<Routes, 'CodeScannerPage'>
// export function CodeScannerPage({ navigation }: Props): React.ReactElement {
//   // 1. Use a simple default back camera
//   const device = useCameraDevice('back')

//   // 2. Only activate Camera when the app is focused and this screen is currently opened
//   const isFocused = useIsFocused()
//   const isForeground = useIsForeground()
//   const isActive = isFocused && isForeground

//   // 3. (Optional) enable a torch setting
//   const [torch, setTorch] = useState(false)

//   // 4. On code scanned, we show an aler to the user
//   const isShowingAlert = useRef(false)
//   const onCodeScanned = useCallback((codes: Code[]) => {
//     console.log(`Scanned ${codes.length} codes:`, codes)
//     const value = codes[0]?.value
//     if (value == null) return
//     if (isShowingAlert.current) return
//     showCodeAlert(value, () => {
//       isShowingAlert.current = false
//     })
//     isShowingAlert.current = true
//   }, [])

//   // 5. Initialize the Code Scanner to scan QR codes and Barcodes
//   const codeScanner = useCodeScanner({
//     codeTypes: ['qr', 'ean-13'],
//     onCodeScanned: onCodeScanned,
//   })

//   return (
//     <View style={styles.container}>
//       {device != null && (
//         <Camera
//           style={StyleSheet.absoluteFill}
//           device={device}
//           isActive={isActive}
//           codeScanner={codeScanner}
//           torch={torch ? 'on' : 'off'}
//           enableZoomGesture={true}
//         />
//       )}

//       <StatusBarBlurBackground />

//       <View style={styles.rightButtonRow}>
//         <PressableOpacity style={styles.button} onPress={() => setTorch(!torch)} disabledOpacity={0.4}>
//           <IonIcon name={torch ? 'flash' : 'flash-off'} color="white" size={24} />
//         </PressableOpacity>
//       </View>

//       {/* Back Button */}
//       <PressableOpacity style={styles.backButton} onPress={navigation.goBack}>
//         <IonIcon name="chevron-back" color="white" size={35} />
//       </PressableOpacity>
//     </View>
//   )
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: 'black',
//   },
//   // button: {
//   //   marginBottom: CONTENT_SPACING,
//   //   width: CONTROL_BUTTON_SIZE,
//   //   height: CONTROL_BUTTON_SIZE,
//   //   borderRadius: CONTROL_BUTTON_SIZE / 2,
//   //   backgroundColor: 'rgba(140, 140, 140, 0.3)',
//   //   justifyContent: 'center',
//   //   alignItems: 'center',
//   // },
//   // rightButtonRow: {
//   //   position: 'absolute',
//   //   right: SAFE_AREA_PADDING.paddingRight,
//   //   top: SAFE_AREA_PADDING.paddingTop,
//   },
//   backButton: {
//     position: 'absolute',
//     left: SAFE_AREA_PADDING.paddingLeft,
//     top: SAFE_AREA_PADDING.paddingTop,
//   },
// })
