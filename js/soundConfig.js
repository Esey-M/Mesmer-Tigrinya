/**
 * Sound Configuration for Tigrinya Learning Website
 * Easy way to customize audio settings
 */

// Sound configuration
const SOUND_CONFIG = {
  // Enable/disable sounds globally
  enabled: true,
  
  // Volume levels (0.0 to 1.0)
  volumes: {
    correct: 0.7,    // Volume for correct answers
    incorrect: 0.6,  // Volume for wrong answers
    complete: 0.8,   // Volume for quiz completion
    click: 0.5,      // Volume for button clicks
    words: 0.9       // Volume for Tigrinya word pronunciation
  },
  
  // Audio file paths (relative to audio directory)
  files: {
    correct: 'correct.MP3',
    incorrect: 'incorrect.MP3',
    complete: 'complete.MP3',
    click: 'click.MP3',
    // Tigrinya words
    bet: 'bet.MP3',
    merha: 'merha.MP3',
    hasab: 'hasab.MP3',
    maekel: 'maekel.MP3',
    tsehafI: 'tsehafI.MP3'
  },
  
  // Fallback messages when audio files are not found
  fallbacks: {
    correct: '🔊 ቅኑዕ!',
    incorrect: '🔊 ደጊምካ ፈትን!',
    complete: '🔊 ሕቶ ተወዲኡ!',
    click: '🔊 ጠውቕ!',
    words: '🔊 Tigrinya word'
  }
};

// Enhanced sound system
class SoundManager {
  constructor() {
    this.config = SOUND_CONFIG;
    this.cache = new Map(); // Cache loaded audio objects
  }

  // Play a sound with error handling
  play(soundType, options = {}) {
    console.log(`🎵 Attempting to play: ${soundType}`);
    
    if (!this.config.enabled) {
      console.log('🔇 Sounds are disabled');
      return;
    }

    const volume = options.volume || this.config.volumes[soundType] || 0.7;
    const file = this.config.files[soundType];
    const fallback = this.config.fallbacks[soundType] || '🔊 Sound';

    if (!file) {
      console.log(`${fallback} (no file configured for ${soundType})`);
      return;
    }

    console.log(`📁 Looking for file: audio/${file}`);

    try {
      // Check cache first
      let audio = this.cache.get(soundType);
      
      if (!audio) {
        console.log(`🔄 Creating new audio object for ${soundType}`);
        // Try different paths depending on current location
        let audioPath;
        if (window.location.pathname.includes('/quizzes/')) {
          audioPath = `../audio/${file}`;
        } else {
          audioPath = `audio/${file}`;
        }
        console.log(`📁 Using path: ${audioPath}`);
        audio = new Audio(audioPath);
        audio.preload = 'auto';
        this.cache.set(soundType, audio);
        
        // Add event listeners for debugging
        audio.addEventListener('loadstart', () => console.log(`📥 Loading started: ${file}`));
        audio.addEventListener('canplay', () => console.log(`✅ Can play: ${file}`));
        audio.addEventListener('error', (e) => console.log(`❌ Audio error: ${file}`, e));
      }

      audio.volume = volume;
      audio.currentTime = 0; // Reset to beginning
      
      console.log(`▶️ Playing ${soundType} at volume ${volume}`);
      
      audio.play().then(() => {
        console.log(`🎉 Successfully playing: ${soundType}`);
      }).catch(error => {
        console.log(`${fallback} (audio file not found: ${file})`);
        console.log('Error details:', error);
      });

    } catch (error) {
      console.log(`${fallback} (error loading audio)`);
      console.log('Error details:', error);
    }
  }

  // Preload all sounds for better performance
  preloadAll() {
    Object.keys(this.config.files).forEach(soundType => {
      try {
        const file = this.config.files[soundType];
        let audioPath;
        if (window.location.pathname.includes('/quizzes/')) {
          audioPath = `../audio/${file}`;
        } else {
          audioPath = `audio/${file}`;
        }
        console.log(`🔄 Preloading: ${audioPath}`);
        const audio = new Audio(audioPath);
        audio.preload = 'auto';
        this.cache.set(soundType, audio);
      } catch (error) {
        console.log(`Could not preload ${soundType}:`, error.message);
      }
    });
  }

  // Enable/disable sounds
  setEnabled(enabled) {
    this.config.enabled = enabled;
    localStorage.setItem('tigrinyaSoundsEnabled', enabled);
  }

  // Load saved settings
  loadSettings() {
    const saved = localStorage.getItem('tigrinyaSoundsEnabled');
    if (saved !== null) {
      this.config.enabled = saved === 'true';
    }
  }

  // Save current settings
  saveSettings() {
    localStorage.setItem('tigrinyaSoundsEnabled', this.config.enabled);
  }
}

// Create global sound manager instance
window.soundManager = new SoundManager();

// Load settings and preload sounds when page loads
document.addEventListener('DOMContentLoaded', () => {
  window.soundManager.loadSettings();
  window.soundManager.preloadAll();
  
  // Set up sound toggle button
  const soundToggle = document.getElementById('soundToggle');
  if (soundToggle) {
    // Update button appearance based on current state
    const updateButton = () => {
      soundToggle.textContent = window.soundManager.config.enabled ? '🔊' : '🔇';
      soundToggle.title = window.soundManager.config.enabled ? 'Disable Sounds' : 'Enable Sounds';
    };
    
    updateButton();
    
    // Toggle sounds when button is clicked
    soundToggle.addEventListener('click', () => {
      window.soundManager.setEnabled(!window.soundManager.config.enabled);
      window.soundManager.saveSettings();
      updateButton();
      
      // Play a test sound if enabling
      if (window.soundManager.config.enabled) {
        window.soundManager.play('click');
      }
    });
  }
});

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { SoundManager, SOUND_CONFIG };
}
