import { CameraView, useCameraPermissions } from 'expo-camera';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { StyleSheet, Text, View, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../../components/Button';
import { Colors } from '../../constants/Colors';

export default function HomeScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [hasScanned, setHasScanned] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  // Réinitialiser le scanning quand la page regagne le focus
  useFocusEffect(
    useCallback(() => {
      setHasScanned(false);
      setIsCameraOpen(false);
      setShowSuccess(false);
    }, [])
  );

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={['top', 'left', 'right']}>
        <View style={[styles.container, { backgroundColor: colors.background }]}>
          <View style={styles.welcomeContainer}>
            <Text style={[styles.welcomeText, { color: colors.tint }]}>TrustQR</Text>
            <Text style={[styles.message, { color: colors.text }]}>Nous avons besoin de votre autorisation pour utiliser la caméra</Text>
          </View>
          <View style={styles.buttonContainer}>
            <Button onPress={requestPermission} title="Autoriser la caméra" variant="primary" />
          </View>
        </View>
      </SafeAreaView>
    );
  }



  const handleBarcodeScanned = ({ type, data }: { type: string; data: string }) => {
    // Éviter les scans multiples
    if (hasScanned) return;
    
    setHasScanned(true);
    setShowSuccess(true);
    
    // Délai pour montrer le feedback avant de naviguer
    setTimeout(() => {
      setIsCameraOpen(false);
      setShowSuccess(false);
      // Navigate to result page with scanned data
      router.push(`/(tabs)/result?data=${encodeURIComponent(data)}&type=${encodeURIComponent(type)}`);
    }, 1500); // 1.5 secondes de feedback
  };

  const openCamera = () => {
    setIsCameraOpen(true);
    setHasScanned(false);
  };

  const closeCamera = () => {
    setIsCameraOpen(false);
    setHasScanned(false);
    setShowSuccess(false);
  };

  if (isCameraOpen) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={['top', 'left', 'right']}>
        <View style={[styles.container, { backgroundColor: colors.background }]}>
                  <View style={[styles.cameraContainer, { borderColor: colors.tint }]}>
          <CameraView 
            style={styles.camera} 
            facing="back"
            onBarcodeScanned={!hasScanned ? handleBarcodeScanned : undefined}
            barcodeScannerSettings={{
              barcodeTypes: ["qr", "pdf417"],
            }}
          />
          
          {/* Cadre intérieur pour guider l'utilisateur */}
          <View style={styles.scanFrame}>
            <View style={[styles.scanCorner, { borderColor: colors.tint }]} />
            <View style={[styles.scanCorner, styles.scanCornerTopRight, { borderColor: colors.tint }]} />
            <View style={[styles.scanCorner, styles.scanCornerBottomLeft, { borderColor: colors.tint }]} />
            <View style={[styles.scanCorner, styles.scanCornerBottomRight, { borderColor: colors.tint }]} />
          </View>
          
          {/* Feedback de succès */}
          {showSuccess && (
            <View style={styles.successOverlay}>
              <View style={[styles.successIcon, { backgroundColor: colors.security.safe }]}>
                <Text style={[styles.checkmark, { color: colors.white }]}>✓</Text>
              </View>
              <Text style={[styles.successText, { color: colors.white }]}>QR Code détecté !</Text>
            </View>
          )}
        </View>
          
          <View style={styles.buttonContainer}>
            <Button 
              onPress={closeCamera}
              title="Annuler"
              variant="secondary"
            />
          </View>
        </View>
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={['top', 'left', 'right']}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.welcomeContainer}>
          <Text style={[styles.welcomeText, { color: colors.tint }]}>TrustQR</Text>
          <Text style={[styles.subtitleText, { color: colors.text }]}>Scanner de QR codes sécurisé</Text>
        </View>
        
        <View style={styles.buttonContainer}>
          <Button 
            onPress={openCamera}
            title="Scanner"
            variant="secondary"
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  cameraContainer: {
    width: 300,
    height: 300,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 2,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    marginTop: 20,
    paddingHorizontal: 40,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  welcomeText: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitleText: {
    fontSize: 16,
    textAlign: 'center',
  },
  scanFrame: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanCorner: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderWidth: 3,
    top: 60,
    left: 60,
    borderBottomWidth: 0,
    borderRightWidth: 0,
  },
  scanCornerTopRight: {
    left: undefined,
    right: 60,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
    borderRightWidth: 3,
  },
  scanCornerBottomLeft: {
    top: undefined,
    bottom: 60,
    borderTopWidth: 0,
    borderRightWidth: 0,
    borderBottomWidth: 3,
  },
  scanCornerBottomRight: {
    top: undefined,
    left: undefined,
    right: 60,
    bottom: 60,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 3,
    borderRightWidth: 3,
  },
  successOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  checkmark: {
    fontSize: 40,
    fontWeight: 'bold',
  },
  successText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
