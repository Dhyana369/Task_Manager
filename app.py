from flask import Flask, send_from_directory
import os

app = Flask(__name__, static_folder='.')

# Serve index.html for the home page
@app.route('/')
def home():
    return send_from_directory('.', 'index.html')

# Serve other static files (CSS, JS, images, etc.)
@app.route('/<path:path>')
def static_files(path):
    return send_from_directory('.', path)

# Example analytics route (replace with your real logic later)
@app.route('/api/analytics')
def analytics():
    # Dummy response for now
    return {"tasks_completed": [3, 5, 2, 4, 6]}

if __name__ == "__main__":
    # For local testing
    app.run(host="0.0.0.0", port=7860, debug=True)
