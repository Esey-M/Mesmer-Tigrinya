{
  "tasks": [
    {
      "id": "progress-storage",
      "name": "Implement Progress Storage System",
      "description": "Create localStorage-based system to track quiz completion and user progress across sessions",
      "complexity": "Medium",
      "dependencies": [],
      "files": {
        "js": ["js/progressTracker.js (new)"],
        "html": ["index.html", "quizzes.html"],
        "css": ["css/style.css"]
      }
    },
    {
      "id": "progress-ui",
      "name": "Add Progress UI Components",
      "description": "Create visual progress indicators and dashboard for quiz completion tracking",
      "complexity": "Low",
      "dependencies": ["progress-storage"],
      "files": {
        "html": ["progress.html (new)", "quizzes.html"],
        "css": ["css/style.css"],
        "js": ["js/progressTracker.js"]
      }
    },
    {
      "id": "listening-questions",
      "name": "Create Listening Quiz Questions",
      "description": "Design audio-based question data structure for listening comprehension",
      "complexity": "Medium",
      "dependencies": [],
      "files": {
        "js": ["quizzes/listening-quiz.html"],
        "audio": ["audio/ (new listening audio files)"]
      }
    },
    {
      "id": "listening-controls",
      "name": "Implement Audio Playback Controls",
      "description": "Add play/pause/replay buttons and audio loading states for listening quiz",
      "complexity": "Medium",
      "dependencies": ["listening-questions"],
      "files": {
        "html": ["quizzes/listening-quiz.html"],
        "css": ["css/style.css"],
        "js": ["js/quizApp.js", "js/soundConfig.js"]
      }
    },
    {
      "id": "difficulty-data",
      "name": "Add Difficulty Levels to Quiz Data",
      "description": "Tag existing quiz questions with difficulty levels (beginner, intermediate, advanced)",
      "complexity": "Low",
      "dependencies": [],
      "files": {
        "js": ["all quiz .html files in quizzes/"]
      }
    },
    {
      "id": "difficulty-ui",
      "name": "Create Difficulty Selection Interface",
      "description": "Add UI for selecting difficulty level before starting quizzes",
      "complexity": "Low",
      "dependencies": ["difficulty-data"],
      "files": {
        "html": ["quizzes.html"],
        "css": ["css/style.css"],
        "js": ["js/quizApp.js"]
      }
    },
    {
      "id": "vocabulary-data",
      "name": "Create Vocabulary Data Structure",
      "description": "Design category-based word collections with Tigrinya-English pairs and audio",
      "complexity": "Medium",
      "dependencies": [],
      "files": {
        "js": ["js/vocabulary.js (new)"]
      }
    },
    {
      "id": "vocabulary-ui",
      "name": "Build Flashcard Interface",
      "description": "Create interactive flashcard UI with flip animations and audio playback",
      "complexity": "Medium",
      "dependencies": ["vocabulary-data"],
      "files": {
        "html": ["vocabulary.html (new)"],
        "css": ["css/style.css"],
        "js": ["js/vocabulary.js"]
      }
    },
    {
      "id": "story-audio",
      "name": "Add Audio Narration to Stories",
      "description": "Integrate audio narration files and synchronization with story text",
      "complexity": "Medium",
      "dependencies": [],
      "files": {
        "html": ["stories.html", "individual story pages"],
        "css": ["css/style.css"],
        "js": ["js/storyReader.js (new)"]
      }
    },
    {
      "id": "story-comprehension",
      "name": "Create Story Comprehension Questions",
      "description": "Add interactive questions and progress tracking to story reading experience",
      "complexity": "Low",
      "dependencies": ["story-audio"],
      "files": {
        "html": ["stories.html"],
        "js": ["js/storyReader.js"]
      }
    },
    {
      "id": "achievement-data",
      "name": "Design Achievement System",
      "description": "Create achievement criteria and badge data structure",
      "complexity": "Low",
      "dependencies": [],
      "files": {
        "js": ["js/achievements.js (new)"]
      }
    },
    {
      "id": "achievement-ui",
      "name": "Implement Achievement UI and Notifications",
      "description": "Add badge display, notifications, and celebration animations",
      "complexity": "Medium",
      "dependencies": ["achievement-data"],
      "files": {
        "html": ["achievements.html (new)", "index.html"],
        "css": ["css/style.css"],
        "js": ["js/achievements.js"]
      }
    },
    {
      "id": "offline-service-worker",
      "name": "Implement Service Worker Caching",
      "description": "Create service worker for offline asset caching and app functionality",
      "complexity": "High",
      "dependencies": [],
      "files": {
        "js": ["sw.js (new, service worker)"]
      }
    },
    {
      "id": "offline-ui",
      "name": "Add Offline Mode Indicators",
      "description": "Implement UI indicators for offline status and cached content availability",
      "complexity": "Low",
      "dependencies": ["offline-service-worker"],
      "files": {
        "html": ["index.html"],
        "css": ["css/style.css"],
        "js": ["js/offlineManager.js (new)"]
      }
    }
  ]
}