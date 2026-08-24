import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  useWindowDimensions,
  Animated,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { supabase } from '../../lib/supabase'; 

const textContent = {
  hi: {
    back: 'वापस जाएं',
    title: 'ओटीपी सत्यापित करें',
    subtitle: 'हमने आपके मोबाइल नंबर पर एक 6-अंकीय सुरक्षित कोड भेजा है।',
    btnText: 'सत्यापित करें ➔',
    btnSuccess: 'सत्यापित ✓',
    resendWait: 'पुनः भेजने के लिए प्रतीक्षा करें',
    resendNow: 'OTP पुनः भेजें',
  },
  en: {
    back: 'Back',
    title: 'Verify OTP',
    subtitle: 'We have sent a 6-digit secure code to your mobile number.',
    btnText: 'Verify & Proceed ➔',
    btnSuccess: 'Verified ✓',
    resendWait: 'Resend code in',
    resendNow: 'Resend OTP',
  },
};

export default function VerifyOtpScreen() {
  const [language, setLanguage] = useState<'hi' | 'en'>('en'); 
  const t = textContent[language];

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [activeOTPIndex, setActiveOTPIndex] = useState(0);
  const [timer, setTimer] = useState(30);
  const [isVerifying, setIsVerifying] = useState(false);
  
  const inputRefs = useRef<Array<TextInput | null>>([]);
  const { width, height } = useWindowDimensions();
  const router = useRouter();
  const { phone } = useLocalSearchParams(); 

  const buttonScaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // FIX 1: Using ReturnType for the interval
    let interval: ReturnType<typeof setInterval>;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (text: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    if (text !== '') {
      if (index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && otp[index] === '') {
      if (index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  const handleVerify = async () => {
    const enteredOtp = otp.join('');
    if (enteredOtp.length === 6) {
      setIsVerifying(true);
      
      const { data, error } = await supabase.auth.verifyOtp({
        phone: `+91${phone}`,
        token: enteredOtp,
        type: 'sms',
      });

      setIsVerifying(false);

      if (error) {
        alert("Invalid OTP. Please try again.");
      } else if (data.session) {
        // FIX 2: Bypassing strict routing temporarily until we build the tabs screen
        alert("Login Successful! 🎉");
        router.replace('/(tabs)' as any); 
      }
    }
  };

  const handleResend = () => {
    setTimer(30);
    setOtp(['', '', '', '', '', '']);
    inputRefs.current[0]?.focus();
  };

  const handlePressIn = () => {
    Animated.spring(buttonScaleAnim, { toValue: 0.94, useNativeDriver: true }).start();
  };
  const handlePressOut = () => {
    Animated.spring(buttonScaleAnim, { toValue: 1, friction: 4, tension: 40, useNativeDriver: true }).start();
  };

  return (
    <View style={[styles.container, { width, height }]}>
      <Animated.Image
        source={require('../../../assets/images/temple-bg.png')}
        style={[StyleSheet.absoluteFill, { width, height }]}
        resizeMode="cover"
      />

      <LinearGradient
        colors={['rgba(10, 4, 2, 0.6)', 'rgba(0, 0, 0, 0.85)', 'rgba(0, 0, 0, 0.95)']}
        style={[StyleSheet.absoluteFill, { width, height }]}
      />

      <StatusBar style="light" />

      <SafeAreaWrapper>
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backArrow}>←</Text>
            <Text style={styles.backText}>{t.back}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.mainLayout}>
          <View style={styles.cardContainer}>
            <View style={styles.glassCard}>
              
              <View style={styles.shieldIcon}>
                <Text style={styles.shieldText}>🔐</Text>
              </View>

              <Text style={styles.cardMainHeading}>{t.title}</Text>
              <Text style={styles.cardSubText}>{t.subtitle}</Text>

              <View style={styles.otpContainer}>
                {otp.map((digit, index) => (
                  <TextInput
                    key={index}
                    // FIX 3: Added curly braces to explicitly return void
                    ref={(ref) => { inputRefs.current[index] = ref; }}
                    style={[
                      styles.otpBox,
                      activeOTPIndex === index && styles.otpBoxActive,
                    ]}
                    keyboardType="numeric"
                    maxLength={1}
                    value={digit}
                    onChangeText={(text) => handleChange(text.replace(/[^0-9]/g, ''), index)}
                    onKeyPress={(e) => handleKeyPress(e, index)}
                    onFocus={() => setActiveOTPIndex(index)}
                  />
                ))}
              </View>

              <Animated.View style={{ transform: [{ scale: buttonScaleAnim }], elevation: 8, marginBottom: 24, borderRadius: 14, width: '100%' }}>
                <Pressable
                  style={[styles.actionButton, otp.join('').length === 6 ? styles.btnActive : styles.btnInactive]}
                  onPress={handleVerify}
                  onPressIn={handlePressIn}
                  onPressOut={handlePressOut}
                  disabled={otp.join('').length < 6 || isVerifying}
                >
                  <LinearGradient
                    colors={
                      isVerifying ? ['#059669', '#047857'] : 
                      otp.join('').length === 6 ? ['#FFC045', '#F59E0B'] : 
                      ['rgba(255, 192, 69, 0.4)', 'rgba(245, 158, 11, 0.3)']
                    }
                    style={styles.btnGradient}
                    start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                  >
                    <Text style={styles.btnText}>{isVerifying ? t.btnSuccess : t.btnText}</Text>
                  </LinearGradient>
                </Pressable>
              </Animated.View>

              <View style={styles.resendRow}>
                {timer > 0 ? (
                  <Text style={styles.resendWaitText}>
                    {t.resendWait} <Text style={styles.timerText}>00:{timer < 10 ? `0${timer}` : timer}</Text>
                  </Text>
                ) : (
                  <TouchableOpacity onPress={handleResend}>
                    <Text style={styles.resendActiveText}>{t.resendNow}</Text>
                  </TouchableOpacity>
                )}
              </View>

            </View>
          </View>
        </View>
      </SafeAreaWrapper>
    </View>
  );
}

function SafeAreaWrapper({ children }: { children: React.ReactNode }) {
  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1, width: '100%' }}>
      {children}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', overflow: 'hidden' },
  topBar: { paddingHorizontal: 28, paddingTop: 60, paddingBottom: 20 },
  backButton: { flexDirection: 'row', alignItems: 'center' },
  backArrow: { color: '#FBBF24', fontSize: 24, marginRight: 8, fontWeight: 'bold' },
  backText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
  mainLayout: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20 },
  cardContainer: { width: '100%', maxWidth: 440 },
  glassCard: { 
    width: '100%', backgroundColor: 'rgba(30, 15, 10, 0.45)', borderRadius: 24, padding: 24, 
    borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.1)', shadowColor: '#000', 
    shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.8, shadowRadius: 30, alignItems: 'center',
  },
  shieldIcon: { width: 56, height: 56, borderRadius: 28, backgroundColor: 'rgba(20, 10, 5, 0.6)', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(251, 191, 36, 0.5)', marginBottom: 20 },
  shieldText: { fontSize: 24 },
  cardMainHeading: { fontSize: 32, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 12 },
  cardSubText: { fontSize: 15, color: 'rgba(255, 255, 255, 0.8)', marginBottom: 32, lineHeight: 22, textAlign: 'center' },
  otpContainer: { flexDirection: 'row', justifyContent: 'center', gap: 8, marginBottom: 32, width: '100%' },
  otpBox: { 
    width: 46, height: 56, backgroundColor: 'rgba(15, 5, 0, 0.5)', borderRadius: 12, borderWidth: 1.5, borderColor: 'rgba(255, 255, 255, 0.2)', 
    fontSize: 22, fontWeight: 'bold', color: '#FFF', textAlign: 'center',
  },
  otpBoxActive: { borderColor: '#FBBF24', backgroundColor: 'rgba(251, 191, 36, 0.05)' },
  actionButton: { height: 56, borderRadius: 14, overflow: 'hidden', width: '100%' },
  btnActive: { opacity: 1 },
  btnInactive: { opacity: 0.6 },
  btnGradient: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  btnText: { fontSize: 16, fontWeight: '800', color: '#1A0B02' }, 
  resendRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 8 },
  resendWaitText: { color: 'rgba(255, 255, 255, 0.6)', fontSize: 14 },
  timerText: { color: '#FBBF24', fontWeight: 'bold' },
  resendActiveText: { color: '#FBBF24', fontSize: 14, fontWeight: 'bold', textDecorationLine: 'underline' },
});