# Audio Files for Tigrinya Learning Website

## 🎵 Required Audio Files

Place your custom audio files in this directory with these exact names:

### **Quiz Sound Effects:**
- `correct.mp3` - Sound for correct answers (e.g., "ding", "chime", "success")
- `incorrect.mp3` - Sound for wrong answers (e.g., "buzz", "error", "try again")
- `complete.mp3` - Sound when quiz is finished (e.g., "fanfare", "celebration")
- `click.mp3` - Sound for button clicks (e.g., "pop", "tap", "click")

### **Listening Quiz Audio:**
- `bet.mp3` - Audio for "ቤት" (house)
- `merha.mp3` - Audio for "መርሓ" (road)
- `hasab.mp3` - Audio for "ሓሳብ" (idea)
- `maekel.mp3` - Audio for "ማእከል" (center)
- `tsehafI.mp3` - Audio for "ጸሓፊ" (writer)

## 🎨 **Recommended Audio Characteristics:**

### **Sound Effects:**
- **Duration**: 0.5-2 seconds
- **Format**: MP3, WAV, or OGG
- **Volume**: Moderate (not too loud)
- **Style**: Kid-friendly, cheerful sounds

### **Tigrinya Words:**
- **Duration**: 1-3 seconds
- **Format**: MP3, WAV, or OGG
- **Quality**: Clear pronunciation
- **Speaker**: Native Tigrinya speaker preferred

## 🔧 **How to Add Your Sounds:**

1. **Record or find audio files** with the names listed above
2. **Place them in this `/audio/` directory**
3. **Test the sounds** by taking a quiz
4. **Adjust volume** in `quizApp.js` if needed

## 🎯 **Sound Ideas:**

### **Correct Answer Sounds:**
- Bell chime
- Success ding
- Happy "yay!"
- Star twinkle
- Celebration sound

### **Incorrect Answer Sounds:**
- Gentle "oops"
- Soft buzz
- "Try again" voice
- Gentle error sound
- Encouraging "almost!"

### **Quiz Complete Sounds:**
- Fanfare
- Applause
- "Great job!" voice
- Victory music
- Celebration jingle

## 📱 **Browser Compatibility:**

- **Chrome**: MP3, WAV, OGG
- **Firefox**: MP3, WAV, OGG
- **Safari**: MP3, WAV
- **Edge**: MP3, WAV, OGG

## 🎵 **Free Sound Resources:**

- [Freesound.org](https://freesound.org) - Free sound effects
- [Zapsplat](https://zapsplat.com) - Professional sounds (free account)
- [BBC Sound Effects](https://sound-effects.bbcrewind.co.uk) - BBC archive
- [Adobe Audition](https://adobe.com/audition) - Audio editing software

## 🔇 **Disabling Sounds:**

If you want to disable sounds temporarily, edit `quizApp.js`:

```javascript
const config = {
  showProgress: true,
  enableSounds: false, // Set to false to disable sounds
  animationDuration: 600,
  feedbackDuration: 1000,
  ...options
};
```

---

**Note**: The website will work perfectly without audio files - it will just show console messages instead of playing sounds.
