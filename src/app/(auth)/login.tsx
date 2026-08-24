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
  ScrollView,
  useWindowDimensions,
  Animated,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { supabase } from '../../lib/supabase';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

// --- Dynamic Multilingual Dictionary ---
const textContent = {
  hi: {
    langToggleBtn: 'English',
    tagline: 'आपका आध्यात्मिक सेतु',
    sanskrit: 'शुभम् करोति कल्याणम्।',
    titleLine1: 'आरम्भ करें',
    titleLine2: 'अपनी पवित्र यात्रा',
    desc: 'प्रामाणिक अनुष्ठान और सत्यापित पुरोहित, अब सीधे आपके द्वार पर।',
    badge1: 'सत्यापित पुरोहित',
    badge2: 'विश्वसनीय एवं सुरक्षित',
    devotee: 'स्वागतम्, भक्त',
    loginHeader: 'प्रवेश करें',
    subText: 'प्रामाणिक वैदिक अनुष्ठानों का अनुभव करें।',
    mobileLabel: 'मोबाइल नंबर',
    placeholder: '10-अंकों का नंबर',
    btnText: 'ओटीपी भेजें ➔',
    btnSent: 'ओटीपी भेजा गया ✓',
    privacy: 'आपकी जानकारी पूर्णतः सुरक्षित एवं गोपनीय है।',
    footer: 'संपूर्ण भारत में भक्तों द्वारा विश्वसनीय • श्रद्धा के साथ निर्मित',
  },
  en: {
    langToggleBtn: 'हिंदी',
    tagline: 'Your Spiritual Bridge',
    sanskrit: 'Shubham Karoti Kalyanam.',
    titleLine1: 'Begin Your',
    titleLine2: 'Blessed Journey',
    desc: 'Authentic rituals and verified priests, brought directly to your home.',
    badge1: 'Verified priests',
    badge2: 'Trusted & secure',
    devotee: '🙏Welcome, devotee🙏',
    loginHeader: 'Sign in to continue',
    subText: 'Experience authentic Vedic rituals.',
    mobileLabel: 'Mobile number',
    placeholder: '10-digit mobile number',
    btnText: 'Send OTP ➔',
    btnSent: 'OTP sent ✓',
    privacy: 'Your number stays private and secure.',
    footer: 'Trusted by devotees across India • Made with devotion',
  },
};

export default function LoginScreen() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [sent, setSent] = useState(false);
  const [hasSelectedLanguage, setHasSelectedLanguage] = useState(false);
  const [language, setLanguage] = useState<'hi' | 'en'>('hi');
  const t = textContent[language];

  // We explicitly grab both width and height of your monitor/screen
  const { width, height } = useWindowDimensions();
  const router = useRouter();
  const isLargeScreen = width >= 768;

  // --- Animations ---
  const bgScaleAnim = useRef(new Animated.Value(1)).current;
  const gatekeeperOpacity = useRef(new Animated.Value(1)).current;
  const buttonScaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(bgScaleAnim, { toValue: 1.05, duration: 25000, useNativeDriver: true }),
        Animated.timing(bgScaleAnim, { toValue: 1, duration: 25000, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const selectInitialLanguage = (lang: 'hi' | 'en') => {
    setLanguage(lang);
    Animated.timing(gatekeeperOpacity, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start(() => setHasSelectedLanguage(true));
  };

  const handleSendOTP = async () => {
    // 1. Check if it's a valid 10-digit Indian number
    if (phoneNumber.length !== 10) {
      alert("Please enter a valid 10-digit mobile number.");
      return;
    }

    // 2. Tell Supabase to send the SMS
    const { error } = await supabase.auth.signInWithOtp({
      phone: `+91${phoneNumber}`,
    });

    // 3. Handle the result
    if (error) {
      alert(error.message); // If something goes wrong, show the error
    } else {
      // 4. If successful, jump to the Verify screen and pass the phone number along
      router.push({
        pathname: '/(auth)/verify-otp',
        params: { phone: phoneNumber }
      });
    }
  };

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'hi' ? 'en' : 'hi'));
    setSent(false);
  };

  const handlePressIn = () => {
    Animated.spring(buttonScaleAnim, { toValue: 0.94, useNativeDriver: true }).start();
  };
  const handlePressOut = () => {
    Animated.spring(buttonScaleAnim, { toValue: 1, friction: 4, tension: 40, useNativeDriver: true }).start();
  };

  return (
    // Forcing the absolute outermost container to match your screen size exactly
    <View style={[styles.container, { width, height }]}>
      
      {/* Forcing the image to match screen width/height and stretch across the void */}
      <Animated.Image
        source={require('../../../assets/images/temple-bg.png')}
        style={[
          StyleSheet.absoluteFill, 
          { width, height, transform: [{ scale: bgScaleAnim }] }
        ]}
        resizeMode="cover"
      />

      <LinearGradient
        colors={['rgba(20, 10, 5, 0.2)', 'rgba(15, 7, 3, 0.55)', 'rgba(0, 0, 0, 0.85)']}
        style={[StyleSheet.absoluteFill, { width, height }]}
      />

      <StatusBar style="light" />

      {/* --- MAIN INTERFACE --- */}
      <SafeAreaWrapper>
        <ScrollView contentContainerStyle={[styles.scrollContent, { minHeight: height }]} showsVerticalScrollIndicator={false}>
          {/* Top Bar */}
          <View style={styles.topBar}>
            <View style={styles.brandBadge}>
              <Text style={styles.brandOm}>ॐ</Text>
              <Text style={styles.brandName}>Sanatan Setu</Text>
            </View>
            <TouchableOpacity style={styles.langPill} onPress={toggleLanguage}>
              <Text style={styles.langText}>{t.langToggleBtn} ⇄</Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.mainLayout, isLargeScreen ? styles.rowLayout : styles.columnLayout]}>
            {/* Left Hero Text */}
            <View style={[styles.heroSection, isLargeScreen ? styles.heroLarge : styles.heroMobile]}>
              <View style={styles.omCircle}>
                <Text style={styles.omLargeText}>ॐ</Text>
              </View>
              <Text style={styles.sanskritTitle}>{t.sanskrit}</Text>
              <View style={styles.taglineBadge}>
                <Text style={styles.taglineSparkle}>✦</Text>
                <Text style={styles.taglineText}>{t.tagline}</Text>
              </View>
              
              <Text style={styles.heroTitleMain}>{t.titleLine1}</Text>
              <Text style={styles.heroTitleItalic}>{t.titleLine2}</Text>
              <Text style={[styles.heroDescription, { textAlign: isLargeScreen ? 'left' : 'center' }]}>{t.desc}</Text>

              <View style={styles.trustBadgesRow}>
                <View style={styles.badgeItem}>
                  <Text style={styles.checkIcon}>✓</Text>
                  <Text style={styles.badgeLabel}>{t.badge1}</Text>
                </View>
                <View style={styles.badgeItem}>
                  <Text style={styles.checkIcon}>✓</Text>
                  <Text style={styles.badgeLabel}>{t.badge2}</Text>
                </View>
              </View>
            </View>

            {/* Right: Sheer Frosted Glass Card */}
            <View style={[styles.cardContainer, isLargeScreen ? styles.cardLarge : styles.cardMobile]}>
              <View style={styles.glassCard}>
                <View style={styles.cardHeaderRow}>
                  <View>
                    <Text style={styles.devoteeLabel}>{t.devotee.toUpperCase()}</Text>
                    <Text style={styles.cardMainHeading}>{t.loginHeader}</Text>
                  </View>
                  <View style={styles.shieldIcon}>
                    <Text style={styles.shieldText}>🛡️</Text>
                  </View>
                </View>

                <Text style={styles.cardSubText}>{t.subText}</Text>

                <Text style={styles.inputLabel}>{t.mobileLabel}</Text>
                <View style={styles.inputWrapper}>
                  <View style={styles.prefixBox}>
                    <Text style={styles.prefixText}>+91</Text>
                  </View>
                  <TextInput
                    style={styles.textInput}
                    placeholder={t.placeholder}
                    placeholderTextColor="rgba(255, 255, 255, 0.5)"
                    keyboardType="numeric"
                    maxLength={10}
                    value={phoneNumber}
                    onChangeText={(text) => {
                      setPhoneNumber(text.replace(/\D/g, ''));
                      setSent(false);
                    }}
                  />
                </View>

                <Animated.View style={{ transform: [{ scale: buttonScaleAnim }], elevation: 8, marginBottom: 14, borderRadius: 14 }}>
                  <Pressable
                    style={[styles.actionButton, phoneNumber.length === 10 ? styles.btnActive : styles.btnInactive]}
                    onPress={handleSendOTP}
                    onPressIn={handlePressIn}
                    onPressOut={handlePressOut}
                    disabled={phoneNumber.length < 10 || sent}
                  >
                    <LinearGradient
                      colors={
                        sent ? ['#059669', '#047857'] :
                        phoneNumber.length === 10 ? ['#D97706', '#B45309', '#92400E'] : 
                        ['rgba(217, 119, 6, 0.6)', 'rgba(180, 83, 9, 0.5)']
                      }
                      style={styles.btnGradient}
                      start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                    >
                      <Text style={styles.btnText}>{sent ? t.btnSent : t.btnText}</Text>
                    </LinearGradient>
                  </Pressable>
                </Animated.View>

                <View style={styles.privacyRow}>
                  <Text style={styles.privacyIcon}>🛡️</Text>
                  <Text style={styles.privacyText}>{t.privacy}</Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.bottomFooter}>
            <Text style={styles.footerText}>{t.footer.split(' • ')[0]} <Text style={{color: '#F59E0B'}}>•</Text> {t.footer.split(' • ')[1]}</Text>
          </View>
        </ScrollView>
      </SafeAreaWrapper>

      {/* --- INITIAL LANGUAGE GATEKEEPER OVERLAY --- */}
      {!hasSelectedLanguage && (
        <Animated.View style={[StyleSheet.absoluteFill, styles.gatekeeperOverlay, { opacity: gatekeeperOpacity, width, height }]}>
          <LinearGradient colors={['rgba(26, 12, 6, 0.98)', 'rgba(10, 4, 2, 1)']} style={StyleSheet.absoluteFill} />
          <View style={styles.gatekeeperContent}>
            <View style={styles.gatekeeperOmCircle}><Text style={styles.gatekeeperOmText}>ॐ</Text></View>
            <Text style={styles.gatekeeperTitle}>अपनी भाषा चुनें</Text>
            <Text style={styles.gatekeeperSubtitle}>Choose Your Language</Text>
            <TouchableOpacity style={styles.langChoiceBtn} onPress={() => selectInitialLanguage('hi')}>
              <LinearGradient colors={['#D97706', '#92400E']} style={styles.langChoiceGradient}>
                <Text style={styles.langChoiceTextMain}>हिंदी एवं संस्कृत</Text>
                <Text style={styles.langChoiceTextSub}>(Hindi with Sanskrit)</Text>
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.langChoiceBtn, styles.langChoiceBtnOutline]} onPress={() => selectInitialLanguage('en')}>
              <View style={styles.langChoiceOutlineInner}>
                <Text style={styles.langChoiceTextMainOutline}>English</Text>
                <Text style={styles.langChoiceTextSubOutline}>(English Only)</Text>
              </View>
            </TouchableOpacity>
          </View>
        </Animated.View>
      )}
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
  scrollContent: { flexGrow: 1, justifyContent: 'space-between', paddingHorizontal: 28, paddingVertical: 20 },
  
  // --- Top Bar ---
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  brandBadge: { flexDirection: 'row', alignItems: 'center' },
  brandOm: { fontSize: 24, color: '#FBBF24', marginRight: 8, fontWeight: 'bold', textShadowColor: 'rgba(0,0,0,0.8)', textShadowRadius: 4 },
  brandName: { fontSize: 16, color: '#FFF', fontWeight: '600', letterSpacing: 0.5, textShadowColor: 'rgba(0,0,0,0.8)', textShadowRadius: 4 },
  langPill: { backgroundColor: 'rgba(255, 255, 255, 0.1)', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  langText: { color: '#FFF', fontSize: 12, fontWeight: '500' },
  
  // --- Layouts ---
  mainLayout: { width: '100%', alignItems: 'center', justifyContent: 'center', marginVertical: 'auto' },
  rowLayout: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 40, maxWidth: 1280, alignSelf: 'center' },
  columnLayout: { flexDirection: 'column', gap: 40 },
  
  // --- Hero Section (Left Side) ---
  heroSection: { justifyContent: 'center' },
  heroLarge: { flex: 1, maxWidth: 520 },
  heroMobile: { width: '100%', alignItems: 'center', textAlign: 'center' },
  
  // 1. Premium Glowing Om Emblem
  omCircle: { 
    width: 64, 
    height: 64, 
    borderRadius: 32, 
    backgroundColor: 'rgba(20, 10, 5, 0.5)', 
    borderWidth: 1, 
    borderColor: 'rgba(251, 191, 36, 0.6)', 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginBottom: 24,
    // The beautiful soft glow from your screenshot:
    shadowColor: '#FBBF24',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 24,
    elevation: 10,
  },
  omLargeText: { fontSize: 32, color: '#FBBF24', fontWeight: '500' },
  
  // 2. Tagline
  sanskritTitle: { display: 'none' }, // Hiding this if you want it exactly like the screenshot
  taglineBadge: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  taglineSparkle: { color: '#FBBF24', fontSize: 14, marginRight: 8 },
  taglineText: { color: '#FBBF24', fontSize: 13, fontWeight: '500', letterSpacing: 0.5 },
  
  // 3. Thick Serif Titles (Matches "Begin your blessed journey.")
 heroTitleMain: { 
    fontSize: 36, // Reduced from 48 so it fits elegantly
    color: '#FFFFFF', 
    fontWeight: '900', // Made thicker to support the 3D shadow
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif', 
    marginBottom: 4,
    // 3D Shadow effect
    textShadowColor: 'rgba(0, 0, 0, 0.9)', 
    textShadowOffset: { width: 1, height: 3 }, 
    textShadowRadius: 8 
  },
  heroTitleItalic: { 
    fontSize: 36, // Reduced from 48
    color: '#FFD700', // Richer gold to match the splash screen
    fontWeight: '900', 
    fontStyle: 'normal', 
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif', 
    marginBottom: 20, 
    // 3D Golden Glow effect
    textShadowColor: 'rgba(245, 158, 11, 0.6)', 
    textShadowOffset: { width: 0, height: 4 }, 
    textShadowRadius: 10 
  },
  
 heroDescription: { 
    fontSize: 16, 
    lineHeight: 26, 
    color: 'rgba(255, 255, 255, 0.9)', 
    marginBottom: 28, 
    textShadowColor: 'rgba(0, 0, 0, 0.9)', 
    textShadowRadius: 4 
  },
  
  trustBadgesRow: { flexDirection: 'row', gap: 24, flexWrap: 'wrap' },
  badgeItem: { flexDirection: 'row', alignItems: 'center' },
  checkIcon: { color: '#FBBF24', fontSize: 14, marginRight: 8, fontWeight: 'bold' },
  badgeLabel: { color: '#E5E7EB', fontSize: 13, fontWeight: '500' },
  
  // --- Glass Card (Right Side) ---
  cardContainer: { justifyContent: 'center', alignItems: 'center' },
  cardLarge: { width: 440 },
  cardMobile: { width: '100%', maxWidth: 420 },
  glassCard: { 
    width: '100%', 
    backgroundColor: 'rgba(30, 15, 10, 0.45)', // Richer, warmer brown tint
    borderRadius: 24, 
    padding: 32, 
    borderWidth: 1, 
    borderColor: 'rgba(255, 255, 255, 0.1)', 
    // Outer card glow
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 10 }, 
    shadowOpacity: 0.8, 
    shadowRadius: 30,
  },
  cardHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 },
  devoteeLabel: { fontSize: 11, color: '#FBBF24', fontWeight: '700', letterSpacing: 1, marginBottom: 8 },
  
  // Login Title matches the Serif font of the main title
  cardMainHeading: { 
    fontSize: 28, 
    fontWeight: 'bold', 
    color: '#FFFFFF', 
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
  },
  
 shieldIcon: { 
    // ... keep your other existing properties here (width, height, backgroundColor, etc.)
    position: 'absolute',
    right: 20,  // This pushes the shield 20 pixels inward from the right edge
    top: 24,    // This pushes it down so it aligns with the top of your card
  },
  shieldText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  cardSubText: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 8,
    marginBottom: 20,
  },
  
  // --- Inputs & Buttons ---
  inputLabel: { fontSize: 13, fontWeight: '700', color: '#FFF', marginBottom: 10 },
  inputWrapper: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: 'rgba(15, 5, 0, 0.5)', 
    borderRadius: 14, 
    borderWidth: 1.5, 
    borderColor: 'rgba(251, 191, 36, 0.5)', // Golden glowing outline
    height: 56, 
    marginBottom: 24 
  },
  prefixBox: { paddingHorizontal: 16, borderRightWidth: 1, borderRightColor: 'rgba(255, 255, 255, 0.2)', justifyContent: 'center', height: '50%' },
  prefixText: { fontSize: 16, fontWeight: '700', color: '#FFF' },
  textInput: { flex: 1, fontSize: 16, fontWeight: '500', color: '#FFF', paddingHorizontal: 16, height: '100%' },
  
  // Bright glowing solid button
  actionButton: { 
    height: 56, 
    borderRadius: 14, 
    overflow: 'hidden',
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  btnActive: { opacity: 1 },
  btnInactive: { opacity: 0.6 },
  btnGradient: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  
  // Dark bold text on the bright button
  btnText: { fontSize: 16, fontWeight: '800', color: '#1A0B02' }, 
  
  privacyRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 8 },
  privacyIcon: { fontSize: 13, marginRight: 8, color: '#FBBF24' },
  privacyText: { fontSize: 12, color: 'rgba(255, 255, 255, 0.7)' },
  
  // --- Footer ---
  bottomFooter: { alignItems: 'center', paddingTop: 12 },
  footerText: { fontSize: 13, color: 'rgba(255, 255, 255, 0.5)' },
  
  // --- Gatekeeper Overlay ---
  gatekeeperOverlay: { zIndex: 100, justifyContent: 'center', alignItems: 'center', padding: 20 },
  gatekeeperContent: { width: '100%', maxWidth: 380, alignItems: 'center' },
  gatekeeperOmCircle: { width: 72, height: 72, borderRadius: 36, backgroundColor: 'rgba(20, 10, 5, 0.8)', borderWidth: 1, borderColor: '#FBBF24', alignItems: 'center', justifyContent: 'center', marginBottom: 24, shadowColor: '#FBBF24', shadowOpacity: 0.5, shadowRadius: 20 },
  gatekeeperOmText: { fontSize: 36, color: '#FBBF24', fontWeight: '500' },
  gatekeeperTitle: { fontSize: 32, fontWeight: 'bold', color: '#FFF', marginBottom: 4, fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif' },
  gatekeeperSubtitle: { fontSize: 15, color: '#FDE68A', marginBottom: 36 },
  langChoiceBtn: { width: '100%', height: 64, borderRadius: 16, marginBottom: 16, overflow: 'hidden' },
  langChoiceGradient: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  langChoiceTextMain: { fontSize: 18, fontWeight: 'bold', color: '#1A0B02' }, // Dark text on bright button
  langChoiceTextSub: { fontSize: 12, color: 'rgba(26, 11, 2, 0.7)', marginTop: 4 },
  langChoiceBtnOutline: { backgroundColor: 'transparent', borderWidth: 1.5, borderColor: '#FBBF24' },
  langChoiceOutlineInner: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(20, 10, 5, 0.8)' },
  langChoiceTextMainOutline: { fontSize: 18, fontWeight: 'bold', color: '#FBBF24' },
  langChoiceTextSubOutline: { fontSize: 12, color: 'rgba(251, 191, 36, 0.8)', marginTop: 4 },
});