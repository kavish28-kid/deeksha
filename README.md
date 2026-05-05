# A Tiny Universe

An interactive romantic 3D prank website built with Three.js, GLSL shaders, HTML, CSS, and JavaScript.

The experience starts with a playful fake AI patience test, then suddenly shifts into a cinematic cosmic love reveal. It includes glowing stars, a nebula shader, bloom, floating hearts, an anime-style Alien AI tease, and a final emotional eyes-themed message.

## Experience Flow

1. **Playful Tease**
   - Fake AI system scan.
   - Progress bar resets and delays the reveal.
   - The button dodges the cursor/tap attempts.
   - Designed to feel funny and dramatic, not genuinely frustrating.

2. **Sudden Silence**
   - The screen cuts to black briefly.
   - Motion stops for a cinematic emotional shift.

3. **Cosmic Reveal**
   - Starfield and GLSL nebula fade in.
   - Particles form her name in the sky.
   - A glowing 3D heart appears and breathes with a heartbeat effect.

4. **Personal Message**
   - Typewriter text reveals the love message slowly.
   - Her name appears with a soft glow.

5. **Anime Alien Tease**
   - After the final button click, a tiny anime-inspired Alien AI character appears.
   - It references Sanemi and Ace energy in a playful way.
   - This adds one more fun delay before the deepest reveal.

6. **Eyes Reveal**
   - A glowing eye/iris portal appears in the 3D scene.
   - The final quote reveals:

   > To the right eyes, you are art.  
   > And I swear...  
   > I love your eyes so much.  
   > People say they see the world with two eyes...  
   > but somehow, my whole world is in yours.

7. **Final Line**
   - The experience ends with:

   > I'll always choose you.

## Customization

Open `script.js` and edit the `CONFIG` section at the top:

```js
const CONFIG = {
  HER_NAME: "Her Name",
  NICKNAME: "Alien",
  ANIME_MUSE: "Sanemi and Ace",
  TEASE_SECONDS: 65,
  MAX_BUTTON_DODGES: 14,
  YOUR_MESSAGE: [
    "Okay okay... I'll stop teasing you",
    "I just wanted to make you smile first...",
    "Because...",
    "you matter to me more than I say.",
    "I don't just like you...",
    "I genuinely care about you.",
    "You mean more to me than words can explain.",
    "I love you."
  ],
  EXTRA_MESSAGE: "Every moment with you feels different... better.",
  MUSIC_URL: "./assets/shiddat-title-track.mp3",
  MUSIC_VOLUME: 0.11,
  VOICE_URL: "",
  PHOTO_URLS: []
};
```

### Music

Place your own legally available audio file at:

```text
assets/shiddat-title-track.mp3
```

The volume is intentionally low so it feels emotional instead of overpowering.

### Voice Message

Record your own voice note and place it in the project, then update:

```js
VOICE_URL: "./assets/voice-message.mp3"
```

### Photo Memories

Add image paths to `PHOTO_URLS`:

```js
PHOTO_URLS: [
  "./assets/photo-1.jpg",
  "./assets/photo-2.jpg",
  "./assets/photo-3.jpg"
]
```

## Run Locally

Use any local static server. For example:

```bash
python -m http.server 5173
```

Then open:

```text
http://127.0.0.1:5173/
```

## Files

- `index.html` - page structure and UI layers.
- `styles.css` - responsive styling, glass effects, mobile polish, anime character.
- `script.js` - Three.js scene, shaders, particles, timeline, interactions, config.
- `assets/` - optional music, voice messages, and photos.

## Notes

- Three.js is loaded by CDN, so no build setup is required.
- The site is mobile-friendly and reduces particle counts on smaller devices.
- Browser autoplay rules require user interaction before music can play, so audio starts after the prank interaction begins.
