import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, SafeAreaView, Easing, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

// Disable native driver on Web, keep it on for iOS/Android
const USE_NATIVE_DRIVER = Platform.OS !== 'web';

// Smooth, graceful 3D Depth Zoom-Out Animation
const SmoothZoomingOm = ({ delay, startX, startY, duration, baseFontSize }: any) => {
  const scale = useRef(new Animated.Value(0.2)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.parallel([
        Animated.timing(scale, {
          toValue: 3.2,
          duration: duration,
          easing: Easing.out(Easing.quad),
          useNativeDriver: USE_NATIVE_DRIVER,
        }),
        Animated.sequence([
          Animated.timing(opacity, {
            toValue: 0.35, 
            duration: duration * 0.3,
            useNativeDriver: USE_NATIVE_DRIVER,
          }),
          Animated.timing(opacity, {
            toValue: 0,
            duration: duration * 0.7,
            useNativeDriver: USE_NATIVE_DRIVER,
          }),
        ]),
      ])
    );

    const timeout = setTimeout(() => {
      animation.start();
    }, delay);

    return () => {
      clearTimeout(timeout);
      animation.stop();
    };
  }, [delay, duration]);

  return (
    <Animated.Text
      style={[
        styles.zoomingOm,
        {
          left: startX,
          top: startY,
          fontSize: baseFontSize,
          opacity: opacity,
          transform: [{ scale }],
        },
      ]}
    >
      ॐ
    </Animated.Text>
  );
};

export default function SplashScreen() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const router = useRouter();

  // 🚀 THE FIX: We use percentages now! 
  // This guarantees they spread across 100% of the screen instantly.
  const backgroundOms = Array.from({ length: 22 }).map((_, i) => ({
    id: i,
    delay: Math.random() * 4000,
    duration: 6000 + Math.random() * 4000,
    startX: `${Math.random() * 90}%`, // Random position from 0% to 90% of the screen width
    startY: `${Math.random() * 90}%`, // Random position from 0% to 90% of the screen height
    baseFontSize: 18 + Math.random() * 22,
  }));

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 1500, useNativeDriver: USE_NATIVE_DRIVER }),
      Animated.spring(scaleAnim, { toValue: 1, friction: 4, tension: 15, useNativeDriver: USE_NATIVE_DRIVER }),
    ]).start();

    // Auto-transition to login after 5 seconds
    const timer = setTimeout(() => {
      router.replace('/(auth)/login');
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <LinearGradient colors={['#FF6B00', '#D83800', '#8B1800']} style={styles.container}>
      {backgroundOms.map((om) => (
        <SmoothZoomingOm
          key={om.id}
          delay={om.delay}
          duration={om.duration}
          startX={om.startX}
          startY={om.startY}
          baseFontSize={om.baseFontSize}
        />
      ))}

      <SafeAreaView style={styles.safeArea}>
        <StatusBar style="light" />

        <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
          <View style={styles.logoRing}>
            <View style={styles.innerRing}>
              <View style={styles.centerWrapper}>
                <Text style={[styles.mainOmText, styles.omShadow2]}>ॐ</Text>
                <Text style={[styles.mainOmText, styles.omShadow1]}>ॐ</Text>
                <Text style={[styles.mainOmText]}>ॐ</Text>
              </View>
            </View>
          </View>

          <View style={styles.centerWrapper}>
            <Text numberOfLines={1} style={[styles.title, styles.titleShadow2]}>Sanatan Setu</Text>
            <Text numberOfLines={1} style={[styles.title, styles.titleShadow1]}>Sanatan Setu</Text>
            <Text numberOfLines={1} style={styles.title}>Sanatan Setu</Text>
          </View>

          <Text style={styles.hindiTitle}>सनातन सेतु</Text>

          <View style={styles.dividerContainer}>
            <View style={styles.line} />
            <Text style={styles.star}>✦</Text>
            <View style={styles.line} />
          </View>

          <Text style={styles.tagline}>Connecting devotees with verified priests</Text>
          <Text style={styles.tagline}>for authentic Vedic rituals</Text>
        </Animated.View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, width: '100%', height: '100%', overflow: 'hidden', position: 'relative' },
  safeArea: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  zoomingOm: {
    position: 'absolute',
    color: '#FFD700',
    fontWeight: 'bold',
    zIndex: 1,
    userSelect: 'none',
  } as any,
  content: { alignItems: 'center', justifyContent: 'center', width: '100%', zIndex: 10 },
  logoRing: { width: 150, height: 150, borderRadius: 75, borderWidth: 1.5, borderColor: 'rgba(255, 215, 0, 0.2)', alignItems: 'center', justifyContent: 'center', marginBottom: 30, backgroundColor: 'rgba(255,255,255,0.02)' },
  innerRing: { width: 110, height: 110, borderRadius: 55, borderWidth: 1.5, borderColor: 'rgba(255, 215, 0, 0.6)', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255, 255, 255, 0.08)' },
  centerWrapper: { position: 'relative', alignItems: 'center', justifyContent: 'center' },
  mainOmText: { fontSize: 70, color: '#FFD700' },
  omShadow1: { position: 'absolute', color: '#B8860B', top: 3, left: 2, zIndex: -1 },
  omShadow2: { position: 'absolute', color: 'rgba(0,0,0,0.6)', top: 7, left: 4, zIndex: -2, textShadowRadius: 10 },
  title: { fontSize: 44, color: '#FFFFFF', fontWeight: '900', letterSpacing: 2 },
  titleShadow1: { position: 'absolute', color: '#D4AF37', top: 3, left: 2, zIndex: -1 },
  titleShadow2: { position: 'absolute', color: 'rgba(0,0,0,0.5)', top: 6, left: 4, zIndex: -2, textShadowRadius: 10 },
  hindiTitle: { fontSize: 24, color: '#FFE8A1', marginTop: 12, letterSpacing: 4, fontWeight: '600', textShadowColor: 'rgba(0,0,0,0.4)', textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 4 },
  dividerContainer: { flexDirection: 'row', alignItems: 'center', marginVertical: 30 },
  line: { height: 1, width: 80, backgroundColor: 'rgba(255, 215, 0, 0.4)' },
  star: { color: '#FFD700', marginHorizontal: 15, fontSize: 18 },
  tagline: { color: 'rgba(255, 255, 255, 0.95)', fontSize: 15, lineHeight: 24, fontWeight: '500', letterSpacing: 0.5, textShadowColor: 'rgba(0,0,0,0.5)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 3 }
});