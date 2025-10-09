from moviepy.video.io.VideoFileClip import VideoFileClip
from moviepy.audio.io.AudioFileClip import AudioFileClip
from moviepy.editor import VideoFileClip, AudioFileClip, ImageClip, TextClip, CompositeVideoClip
import numpy as np

# === 1. Фон (видео Happy Birthday) ===
background = VideoFileClip("assets/happy_birthday_full.mp4").resize((1080, 1920)).subclip(0, 20)

# === 2. Музыка ===
music = AudioFileClip("assets/happy_birthday.mp3").volumex(0.8)

# === 3. Малыш MyMiniBaby ===
baby = (ImageClip("assets/baby.png")
        .resize(height=600)
        .set_position(("center", lambda t: 900 + 20 * np.sin(2 * np.pi * 0.5 * t)))
        .rotate(lambda t: 3 * np.sin(2 * np.pi * 0.8 * t))
        .set_duration(20)
        .crossfadein(1))

# === 4. Текст ===
text = (TextClip("🎂 Happy 10th Birthday, Dashenka! 💖",
                fontsize=72,
                color='white',
                font='Arial-Bold',
                size=(1080, None),
                method='caption')
        .set_position(("center", 150))
        .set_duration(20))

# === 5. Объединяем слои ===
final = CompositeVideoClip([background, baby, text])
final = final.set_audio(music)

# === 6. Экспорт ===
final.write_videofile("MyMiniBaby2_Birthday_Dashenka.mp4", fps=25, codec="libx264", audio_codec="aac")
