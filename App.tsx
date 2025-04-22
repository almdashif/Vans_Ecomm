import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  BackHandler,
  Platform,
  StatusBar,
  StyleSheet,
  ToastAndroid,
  useColorScheme,
  View,
} from 'react-native';
import { WebView, WebViewNavigation } from 'react-native-webview';
import { Colors } from 'react-native/Libraries/NewAppScreen';

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    flex: 1,
  };

  const webViewRef = useRef<WebView>(null);
  const canGoBack = useRef<boolean>(false);
  const [exitWarning, setExitWarning] = useState<boolean>(false);

  // Handle Android back button
  useEffect(() => {
    const backAction = () => {
      if (canGoBack.current && webViewRef.current) {
        webViewRef.current.goBack();
        return true;
      }

      if (!exitWarning) {
        ToastAndroid.show('Press back again to exit', ToastAndroid.SHORT);
        setExitWarning(true);
        setTimeout(() => setExitWarning(false), 2000);
        return true;
      }

      return false; // Exit app
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, [exitWarning]);

  const handleNavChange = (navState: WebViewNavigation) => {
    canGoBack.current = navState.canGoBack;
  };

  return (
    <View style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <View style={styles.container}>
        <WebView
          ref={webViewRef}
          source={{ uri: 'https://www.vans.com/en-gb' }}
          javaScriptEnabled
          domStorageEnabled
          cacheEnabled={true}  // Enable cache for better performance
          startInLoadingState={true}
          onNavigationStateChange={handleNavChange}
          renderLoading={() => (
            <ActivityIndicator
              size="large"
              color="#000"
              style={{ flex: 1, justifyContent: 'center' }}
            />
          )}
          allowsBackForwardNavigationGestures
          allowsInlineMediaPlayback
          originWhitelist={['*']}
          androidLayerType="hardware"  // Use hardware acceleration
          renderToHardwareTextureAndroid={true}  // Render textures to GPU for smoother performance
          androidHardwareAccelerationDisabled={false}  // Ensure hardware acceleration is enabled
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? 0 : 0,
  },
});

export default App;
