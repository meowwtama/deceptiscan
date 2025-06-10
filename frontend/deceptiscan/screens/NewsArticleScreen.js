import React from 'react';
import { View, Text, StyleSheet, Linking, TouchableOpacity, ScrollView, Image, Dimensions } from 'react-native';

const NewsArticle = () => {
  const openLink = (url) => {
    Linking.openURL(url).catch(err => console.error("Failed to open URL:", err));
  };
  const screenWidth = Dimensions.get('window').width;
  const imageWidth = screenWidth - 32;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.mainTitle}>Singapore's Multi-Layered Defense Against Scams</Text>
        <Text style={styles.subTitle}>How ScamShield is revolutionizing fraud prevention in the digital age</Text>
      </View>
      
       <Image
        source={require('../assets/scamshield.png')} 
        style={[styles.bannerImage, { width: imageWidth }]}
        resizeMode="cover"
      />

      
      <View style={styles.section}>
        <Text style={styles.paragraph}>
          In an era where digital scams have become increasingly sophisticated, Singapore has taken a bold step forward with its comprehensive ScamShield initiative. This multi-pronged approach combines cutting-edge technology with public education to create what experts are calling "the most comprehensive anti-scam ecosystem in Southeast Asia."
        </Text>
        <Text style={styles.paragraph}>
          Launched in November 2020 as a collaboration between the National Crime Prevention Council (NCPC) and Open Government Products, ScamShield represents Singapore's proactive stance against the rising tide of fraudulent activities that cost citizens millions annually.
        </Text>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>The ScamShield App: Your First Line of Defense</Text>
        <Text style={styles.paragraph}>
          At the heart of this initiative is the ScamShield mobile application, available for both iOS and Android devices. The app serves as a digital shield against three primary vectors of scams: suspicious calls, fraudulent websites, and phishing messages across SMS, Telegram, and WhatsApp.
        </Text>
        <Text style={styles.paragraph}>
          "What sets ScamShield apart is its dual functionality," explains Dr. Lim Wei Shan, cybersecurity expert at the Singapore Institute of Technology. "It not only identifies potential scams but also automatically blocks them, creating a proactive barrier rather than just reactive warnings."
        </Text>
        
        <View style={styles.downloadContainer}>
          <Text style={styles.downloadTitle}>Get Protected Today:</Text>
          <TouchableOpacity 
            style={[styles.button, styles.iosButton]}
            onPress={() => openLink('https://go.gov.sg/ss-ios')}
          >
            <Text style={styles.buttonText}>Download for iOS</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.button, styles.androidButton]}
            onPress={() => openLink('https://go.gov.sg/ss-android')}
          >
            <Text style={styles.buttonText}>Download for Android</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>How It Works: The Technology Behind the Protection</Text>
        <Text style={styles.paragraph}>
          The app leverages a constantly updated database of known scam numbers and URLs maintained by the Singapore Police Force. When users receive communications from these sources, the app:
        </Text>
        <Text style={styles.listItem}>• Automatically blocks calls from known scam numbers</Text>
        <Text style={styles.listItem}>• Filters scam SMS messages into a separate folder</Text>
        <Text style={styles.listItem}>• Provides real-time verification of suspicious links</Text>
        <Text style={styles.listItem}>• Allows users to report new scam attempts to help protect others</Text>
        <Text style={styles.paragraph}>
          Importantly, the app uses on-device processing for personal messages, ensuring private communications never leave your phone.
        </Text>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>24/7 Helpline: Human Support When You Need It</Text>
        <Text style={styles.paragraph}>
          Complementing the technological solution is the 1799 ScamShield Helpline, staffed round-the-clock by trained officers who can provide immediate assistance in verifying potential scams.
        </Text>
        <Text style={styles.paragraph}>
          "We recognize that even with the best technology, sometimes people need human reassurance," says Inspector Rachel Wong of the Anti-Scam Command. "Our operators are trained to walk callers through verification processes and can immediately escalate cases when needed."
        </Text>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Comprehensive Online Resources</Text>
        <Text style={styles.paragraph}>
          The ScamShield portal (<Text style={styles.link} onPress={() => openLink('https://www.scamshield.gov.sg')}>www.scamshield.gov.sg</Text>) serves as a one-stop resource center featuring:
        </Text>
        <Text style={styles.listItem}>• Up-to-date information on emerging scam trends</Text>
        <Text style={styles.listItem}>• Detailed prevention guides for different scam types</Text>
        <Text style={styles.listItem}>• Step-by-step instructions for victims</Text>
        <Text style={styles.listItem}>• Educational materials for schools and businesses</Text>
        <Text style={styles.paragraph}>
          The portal receives over 50,000 monthly visitors and has been credited with helping reduce phishing scam success rates by 37% since its launch.
        </Text>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Privacy by Design</Text>
        <Text style={styles.paragraph}>
          In developing ScamShield, privacy protections were implemented from the ground up. The app cannot read messages from saved contacts, and all user reports are anonymized before being added to the shared database.
        </Text>
        <Text style={styles.paragraph}>
          "We wanted to create something that would protect people without compromising their privacy," explains Marcus Tan, lead developer at Open Government Products. "The architecture ensures your personal communications remain personal."
        </Text>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Looking Ahead</Text>
        <Text style={styles.paragraph}>
          With plans to integrate with banking apps and expand detection capabilities to include deepfake audio and video, ScamShield is poised to remain at the forefront of anti-fraud technology. As scams evolve, so too does Singapore's digital defense.
        </Text>
        <Text style={styles.paragraph}>
          For more information or to download the app, visit <Text style={styles.link} onPress={() => openLink('https://www.scamshield.gov.sg')}>www.scamshield.gov.sg</Text> or call the 24-hour helpline at 1799.
        </Text>
      </View>
      
      <View style={styles.footer}>
        <Text style={styles.footerText}>© 2023 ScamShield Initiative. All rights reserved.</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  header: {
    marginBottom: 20,
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subTitle: {
    fontSize: 18,
    color: '#666',
    fontStyle: 'italic',
    marginBottom: 8,
  },
  byline: {
    fontSize: 14,
    color: '#888',
    marginBottom: 16,
  },
  bannerImage: {
    height: 150,
    borderRadius: 8,
    marginBottom: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 12,
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
    marginBottom: 16,
    textAlign: 'justify',
  },
  dropCap: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    lineHeight: 24,
  },
  listItem: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
    marginBottom: 8,
    marginLeft: 16,
  },
  downloadContainer: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 8,
    marginVertical: 16,
  },
  downloadTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#2c3e50',
  },
  button: {
    padding: 14,
    borderRadius: 8,
    marginBottom: 12,
    alignItems: 'center',
  },
  iosButton: {
    backgroundColor: 'grey',
  },
  androidButton: {
    backgroundColor: '#3ddc84',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  link: {
    color: '#1a73e8',
    textDecorationLine: 'underline',
  },
  footer: {
    marginTop: 32,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  footerText: {
    fontSize: 12,
    color: '#888',
    textAlign: 'center',
  },
});

export default NewsArticle;