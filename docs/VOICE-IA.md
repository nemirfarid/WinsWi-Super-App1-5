# Communication vocale WinsWi

Le bouton IA central utilise les API vocales du navigateur lorsque disponibles :

1. Speech Recognition (FR/AR/EN) ;
2. transcription ;
3. envoi à `/api/ai` ;
4. Gemini ou fallback WinsWi ;
5. Speech Synthesis ;
6. historique Supabase si connecté.

Le mécanisme est sans dépendance payante obligatoire. Pour une expérience native Android/iOS plus robuste, un wrapper Capacitor/React Native pourra utiliser des moteurs natifs ultérieurement.
