import streamlit as st
import requests
from PIL import Image

# ---------- CONFIG ----------
API_KEY = "49d024d9d68195d141ac42218f1423b9"  

st.set_page_config(page_title="Weather App", page_icon="🌤️", layout="centered")
st.title("🌤️ Dynamic Weather App")

# ---------- USER INPUT ----------
city = st.text_input("Enter City Name")

if st.button("Get Weather") and city:
    url = f"http://api.openweathermap.org/data/2.5/weather?q={city}&appid={API_KEY}&units=metric"
    data = requests.get(url).json()
    
    if data.get("cod") != 200:
        st.error(f"Error: {data.get('message')}")
    else:
        temp = data['main']['temp']
        desc = data['weather'][0]['description']
        humidity = data['main']['humidity']
        wind = data['wind']['speed']
        weather_main = data['weather'][0]['main'].lower()
        
        # Dynamic background
        if "cloud" in weather_main:
            bg = "cloudy.jpg"
        elif "rain" in weather_main or "drizzle" in weather_main:
            bg = "rainy.jpg"
        elif "snow" in weather_main:
            bg = "snow.jpg"
        elif "clear" in weather_main:
            bg = "sunny.jpg"
        else:
            bg = "default.jpg"
        
        image = Image.open(bg)
        st.image(image, use_column_width=True)
        
        st.subheader(f"{city}, {data['sys']['country']}")
        st.write(f"**Temperature:** {temp} °C")
        st.write(f"**Weather:** {desc}")
        st.write(f"**Humidity:** {humidity}%")
        st.write(f"**Wind Speed:** {wind} m/s")
